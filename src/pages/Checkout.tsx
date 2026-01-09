import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Copy, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { nome, amount } = location.state || {};
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "confirmed">("pending");

  const valorPagamento = "32,67";
  const pixCode = "00020101021226880014br.gov.bcb.pix2566qrcode.ironpayapp.com.br/pix/abc7818b-aff6-4822-8cf5-7b5052a162a8520400005303986540532.675802BR5925IRONPAY PAGAMENTOS LTDA6009SAO PAULO62070503***6304E2CA";

  // Simulate payment confirmation check (in production, integrate with IronPay webhook)
  useEffect(() => {
    const checkPayment = setInterval(() => {
      // Here you would check with IronPay API for payment status
      // For demo purposes, we'll just keep it pending
    }, 5000);

    return () => clearInterval(checkPayment);
  }, []);

  useEffect(() => {
    if (paymentStatus === "confirmed") {
      navigate("/sucesso", { state: { nome, amount } });
    }
  }, [paymentStatus, navigate, nome, amount]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      toast({
        title: "Código copiado!",
        description: "Cole no seu app do banco para pagar",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Tente copiar manualmente",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border py-4 px-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* IronPay Logo */}
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary-foreground">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-lg text-foreground">IronPay</p>
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
            <div className="w-56 h-56 bg-background relative rounded-lg overflow-hidden">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* QR Code pattern */}
                <rect x="0" y="0" width="200" height="200" fill="white"/>
                {/* Corner patterns */}
                <rect x="10" y="10" width="50" height="50" fill="black"/>
                <rect x="15" y="15" width="40" height="40" fill="white"/>
                <rect x="22" y="22" width="26" height="26" fill="black"/>
                
                <rect x="140" y="10" width="50" height="50" fill="black"/>
                <rect x="145" y="15" width="40" height="40" fill="white"/>
                <rect x="152" y="22" width="26" height="26" fill="black"/>
                
                <rect x="10" y="140" width="50" height="50" fill="black"/>
                <rect x="15" y="145" width="40" height="40" fill="white"/>
                <rect x="22" y="152" width="26" height="26" fill="black"/>
                
                {/* Data pattern */}
                {Array.from({ length: 12 }).map((_, i) =>
                  Array.from({ length: 12 }).map((_, j) => {
                    const show = (i + j) % 2 === 0 || (i * j) % 3 === 0;
                    if (!show) return null;
                    const x = 70 + j * 5;
                    const y = 70 + i * 5;
                    if (x > 125 || y > 125) return null;
                    return (
                      <rect
                        key={`${i}-${j}`}
                        x={x}
                        y={y}
                        width="4"
                        height="4"
                        fill="black"
                      />
                    );
                  })
                )}
                
                {/* Additional squares for authenticity */}
                <rect x="70" y="15" width="4" height="4" fill="black"/>
                <rect x="80" y="18" width="4" height="4" fill="black"/>
                <rect x="95" y="22" width="4" height="4" fill="black"/>
                <rect x="110" y="28" width="4" height="4" fill="black"/>
                <rect x="125" y="18" width="4" height="4" fill="black"/>
                <rect x="15" y="70" width="4" height="4" fill="black"/>
                <rect x="25" y="82" width="4" height="4" fill="black"/>
                <rect x="40" y="95" width="4" height="4" fill="black"/>
                <rect x="50" y="105" width="4" height="4" fill="black"/>
                <rect x="35" y="118" width="4" height="4" fill="black"/>
                <rect x="155" y="72" width="4" height="4" fill="black"/>
                <rect x="165" y="88" width="4" height="4" fill="black"/>
                <rect x="175" y="100" width="4" height="4" fill="black"/>
                <rect x="160" y="115" width="4" height="4" fill="black"/>
                <rect x="72" y="155" width="4" height="4" fill="black"/>
                <rect x="88" y="165" width="4" height="4" fill="black"/>
                <rect x="105" y="158" width="4" height="4" fill="black"/>
                <rect x="120" y="170" width="4" height="4" fill="black"/>
                <rect x="138" y="155" width="4" height="4" fill="black"/>
                <rect x="155" y="168" width="4" height="4" fill="black"/>
                <rect x="172" y="158" width="4" height="4" fill="black"/>
              </svg>
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
            <p className="text-sm text-muted-foreground font-mono break-all leading-relaxed">
              {pixCode}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
              copied 
                ? "bg-success text-success-foreground" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
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
        </div>

        {/* Payment Status */}
        <div className="flex flex-col items-center justify-center gap-3 py-4">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span className="text-muted-foreground font-medium">Aguardando pagamento...</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            O status será atualizado automaticamente após a confirmação
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 px-4 border-t border-border">
        <div className="max-w-md mx-auto">
          <p className="text-xs text-muted-foreground text-center">
            Pagamento processado por <span className="font-semibold">IronPay</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
