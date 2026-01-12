import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Copy, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PaymentData {
  transactionId: string;
  qrCode: string;
  qrCodeBase64: string;
  pixCode: string;
  expiresAt: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { nome, amount } = location.state || {};
  const [copied, setCopied] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"loading" | "pending" | "paid" | "error">("loading");
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const valorPagamento = "32,67";

  // Create payment on mount
  useEffect(() => {
    const createPayment = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('pushinpay', {
          body: {
            action: 'create',
            amount: valorPagamento,
          },
        });

        if (error) throw error;
        
        if (data.success) {
          setPaymentData({
            transactionId: data.transactionId,
            qrCode: data.qrCode,
            qrCodeBase64: data.qrCodeBase64,
            pixCode: data.pixCode,
            expiresAt: data.expiresAt,
          });
          setPaymentStatus("pending");
        } else {
          throw new Error(data.error || 'Erro ao criar pagamento');
        }
      } catch (err) {
        console.error('Error creating payment:', err);
        setError('Não foi possível gerar o QR Code. Tente novamente.');
        setPaymentStatus("error");
      }
    };

    createPayment();
  }, []);

  // Check payment status periodically
  useEffect(() => {
    if (!paymentData?.transactionId || paymentStatus !== "pending") return;

    const checkStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('pushinpay', {
          body: {
            action: 'status',
            transactionId: paymentData.transactionId,
          },
        });

        if (error) throw error;

        if (data.success && data.status === 'paid') {
          setPaymentStatus("paid");
          setTimeout(() => {
            navigate("/sucesso", { state: { nome, amount } });
          }, 2000);
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
      }
    };

    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [paymentData?.transactionId, paymentStatus, navigate, nome, amount]);

  const pixCode = paymentData?.pixCode || "Gerando código PIX...";

  const handleCopy = async () => {
    if (!paymentData?.pixCode) return;
    
    const copyToClipboard = async (text: string): Promise<boolean> => {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          return true;
        } catch {
          // Fall through to fallback
        }
      }
      
      // Fallback for mobile browsers
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        return successful;
      } catch {
        return false;
      }
    };

    const success = await copyToClipboard(paymentData.pixCode);
    
    if (success) {
      setCopied(true);
      setShowCopiedMessage(true);
      // Navigate to awaiting payment page after showing copied message
      setTimeout(() => {
        navigate("/aguardando", { 
          state: { 
            nome, 
            amount, 
            transactionId: paymentData.transactionId,
            pixCode: paymentData.pixCode 
          } 
        });
      }, 1500);
    }
  };

  if (paymentStatus === "loading") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Gerando QR Code PIX...</p>
      </div>
    );
  }

  if (paymentStatus === "error") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <p className="text-destructive text-lg font-semibold mb-2">Erro</p>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border py-4 px-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* PushinPay Logo */}
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary-foreground">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-lg text-foreground">PushinPay</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Valor</p>
            <p className="font-bold text-xl text-foreground">R$ {valorPagamento}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-md mx-auto w-full px-4 py-6">
        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div className="bg-card p-6 rounded-2xl shadow-lg border border-border">
            <div className="w-56 h-56 bg-background relative rounded-lg overflow-hidden flex items-center justify-center">
              {paymentData?.qrCodeBase64 ? (
                <img 
                  src={`data:image/png;base64,${paymentData.qrCodeBase64}`} 
                  alt="QR Code PIX" 
                  className="w-full h-full object-contain"
                />
              ) : paymentData?.qrCode ? (
                <img 
                  src={paymentData.qrCode} 
                  alt="QR Code PIX" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* QR Code pattern placeholder */}
                  <rect x="0" y="0" width="200" height="200" fill="white"/>
                  <rect x="10" y="10" width="50" height="50" fill="black"/>
                  <rect x="15" y="15" width="40" height="40" fill="white"/>
                  <rect x="22" y="22" width="26" height="26" fill="black"/>
                  <rect x="140" y="10" width="50" height="50" fill="black"/>
                  <rect x="145" y="15" width="40" height="40" fill="white"/>
                  <rect x="152" y="22" width="26" height="26" fill="black"/>
                  <rect x="10" y="140" width="50" height="50" fill="black"/>
                  <rect x="15" y="145" width="40" height="40" fill="white"/>
                  <rect x="22" y="152" width="26" height="26" fill="black"/>
                  {Array.from({ length: 12 }).map((_, i) =>
                    Array.from({ length: 12 }).map((_, j) => {
                      const show = (i + j) % 2 === 0 || (i * j) % 3 === 0;
                      if (!show) return null;
                      const x = 70 + j * 5;
                      const y = 70 + i * 5;
                      if (x > 125 || y > 125) return null;
                      return (
                        <rect key={`${i}-${j}`} x={x} y={y} width="4" height="4" fill="black"/>
                      );
                    })
                  )}
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* How to pay instructions */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-4">
          <p className="font-semibold text-foreground text-lg mb-4">Como pagar:</p>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                1
              </span>
              <span className="text-muted-foreground">Abra o app do seu banco</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                2
              </span>
              <span className="text-muted-foreground">Escolha pagar via PIX</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                3
              </span>
              <span className="text-muted-foreground">Escaneie o QR Code ou copie o código</span>
            </li>
          </ol>
        </div>

        {/* PIX Copia e Cola */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-6">
          <p className="text-xs text-muted-foreground font-medium mb-3 uppercase tracking-wide">
            PIX Copia e Cola
          </p>
          <div className="bg-secondary/30 rounded-xl p-3 mb-4">
            <p
              className="text-sm text-muted-foreground font-mono break-all leading-relaxed"
              translate="no"
            >
              {pixCode}
            </p>
          </div>
          <button
            onClick={handleCopy}
            disabled={!paymentData?.pixCode}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
              copied 
                ? "bg-success text-success-foreground" 
                : "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Código Copiado!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copiar código PIX
              </>
            )}
          </button>
          
          {/* Copied Message */}
          {showCopiedMessage && (
            <div className="mt-4 bg-success/20 border border-success/30 rounded-xl p-4 text-center animate-in fade-in duration-300">
              <div className="flex items-center justify-center gap-2 text-success">
                <Check className="w-5 h-5" />
                <span className="font-semibold">Seu codico foi copiado!</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Cole no seu app do banco para pagar
              </p>
            </div>
          )}
        </div>

        {/* Payment Status */}
        <div className="flex flex-col items-center justify-center gap-3 py-4">
          {paymentStatus === "paid" ? (
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-success" />
              <span className="text-success font-medium">Pagamento confirmado!</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <span className="text-muted-foreground font-medium">Aguardando pagamento...</span>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                O status será atualizado automaticamente após a confirmação
              </p>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 px-4 border-t border-border">
        <div className="max-w-md mx-auto">
          <p className="text-xs text-muted-foreground text-center">
            Pagamento processado por <span className="font-semibold">PushinPay</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
