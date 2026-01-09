import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { nome, amount } = location.state || {};
  const [copied, setCopied] = useState(false);

  const taxaReembolso = "32,67";
  const pixCode = "00020101021226880014br.gov.bcb.pix2566qrcode.microcashif.com.br/pix/abc7818b-aff6-4822-8cf5-7b5052a162a8520400005303986540532.675802BR5925PICPER PAGAMENTOS LTDA6009SAO PAULO62070503***6304E2CA";

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

  const handleClose = () => {
    navigate("/confirmacao", { state: { nome, amount } });
  };

  const handlePaymentComplete = () => {
    navigate("/sucesso", { state: { nome, amount } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-foreground text-primary-foreground py-4 px-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-10 h-10 bg-[#32BCAD] rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
                <rect x="4" y="4" width="6" height="6" fill="currentColor" opacity="0.7"/>
                <rect x="14" y="4" width="6" height="6" fill="currentColor"/>
                <rect x="4" y="14" width="6" height="6" fill="currentColor"/>
                <rect x="14" y="14" width="6" height="6" fill="currentColor" opacity="0.7"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-lg">PICPER</p>
              <p className="text-primary-foreground/80 text-sm">R$ {taxaReembolso}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-md mx-auto w-full px-4 py-6">
        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-xl shadow-lg">
            {/* QR Code placeholder - in production you'd use a real QR code library */}
            <div className="w-48 h-48 bg-white relative">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* QR Code pattern simulation */}
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
                
                {/* Random pattern to simulate QR data */}
                {Array.from({ length: 15 }).map((_, i) =>
                  Array.from({ length: 15 }).map((_, j) => {
                    const show = (i + j) % 3 === 0 || (i * j) % 5 === 0;
                    if (!show) return null;
                    const x = 70 + j * 6;
                    const y = 70 + i * 6;
                    if (x > 130 || y > 130) return null;
                    return (
                      <rect
                        key={`${i}-${j}`}
                        x={x}
                        y={y}
                        width="5"
                        height="5"
                        fill="black"
                      />
                    );
                  })
                )}
                
                {/* Additional random squares */}
                <rect x="70" y="15" width="5" height="5" fill="black"/>
                <rect x="80" y="15" width="5" height="5" fill="black"/>
                <rect x="95" y="20" width="5" height="5" fill="black"/>
                <rect x="110" y="25" width="5" height="5" fill="black"/>
                <rect x="125" y="15" width="5" height="5" fill="black"/>
                
                <rect x="15" y="70" width="5" height="5" fill="black"/>
                <rect x="25" y="80" width="5" height="5" fill="black"/>
                <rect x="35" y="90" width="5" height="5" fill="black"/>
                <rect x="45" y="100" width="5" height="5" fill="black"/>
                <rect x="30" y="110" width="5" height="5" fill="black"/>
                <rect x="50" y="120" width="5" height="5" fill="black"/>
                
                <rect x="150" y="70" width="5" height="5" fill="black"/>
                <rect x="160" y="85" width="5" height="5" fill="black"/>
                <rect x="175" y="95" width="5" height="5" fill="black"/>
                <rect x="165" y="110" width="5" height="5" fill="black"/>
                <rect x="155" y="125" width="5" height="5" fill="black"/>
                
                <rect x="70" y="150" width="5" height="5" fill="black"/>
                <rect x="85" y="160" width="5" height="5" fill="black"/>
                <rect x="100" y="155" width="5" height="5" fill="black"/>
                <rect x="115" y="165" width="5" height="5" fill="black"/>
                <rect x="130" y="150" width="5" height="5" fill="black"/>
                <rect x="145" y="160" width="5" height="5" fill="black"/>
                <rect x="160" y="155" width="5" height="5" fill="black"/>
                <rect x="175" y="165" width="5" height="5" fill="black"/>
              </svg>
              {/* Copy icon overlay */}
              <button 
                onClick={handleCopy}
                className="absolute top-2 right-2 w-8 h-8 bg-muted rounded-md flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-card rounded-xl p-5 shadow-md mb-4">
          <p className="font-semibold text-foreground mb-3">Como pagar:</p>
          <ol className="space-y-2 text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-foreground">1.</span>
              <span>Abra o app do seu banco</span>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground">2.</span>
              <span>Escolha pagar via PIX</span>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground">3.</span>
              <span>Escaneie o QR Code ou copie o código</span>
            </li>
          </ol>
        </div>

        {/* PIX Code */}
        <div className="bg-card rounded-xl p-5 shadow-md mb-6">
          <p className="text-xs text-muted-foreground mb-3">PIX COPIA E COLA</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-secondary/50 rounded-lg p-3 overflow-hidden">
              <p className="text-sm text-muted-foreground font-mono truncate">
                {pixCode.slice(0, 50)}...
              </p>
            </div>
            <button
              onClick={handleCopy}
              className={`p-3 rounded-lg transition-all ${
                copied 
                  ? "bg-success text-success-foreground" 
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-muted-foreground text-sm">Aguardando a conta...</span>
        </div>

        {/* Simulate payment button - for demo purposes */}
        <button
          onClick={handlePaymentComplete}
          className="w-full bg-success text-success-foreground py-4 rounded-xl font-semibold text-lg transition-all hover:bg-success/90"
        >
          Simular Pagamento Concluído
        </button>
      </div>
    </div>
  );
};

export default Checkout;
