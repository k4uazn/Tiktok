import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, Check, Clock, Shield, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AwaitingPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { nome, amount, transactionId, pixCode } = location.state || {};
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "paid">("pending");
  const [dots, setDots] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);

  // Redirect if no state
  useEffect(() => {
    if (!location.state || !transactionId) {
      navigate("/", { replace: true });
    }
  }, [location.state, transactionId, navigate]);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Elapsed time counter
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check payment status periodically
  useEffect(() => {
    if (!transactionId || paymentStatus === "paid") return;

    const checkStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('pushinpay', {
          body: {
            action: 'status',
            transactionId: transactionId,
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

    // Check immediately
    checkStatus();
    
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [transactionId, paymentStatus, navigate, nome, amount]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const steps = [
    { 
      id: 1, 
      label: "Código PIX copiado", 
      completed: true,
      icon: Check
    },
    { 
      id: 2, 
      label: "Aguardando pagamento", 
      completed: paymentStatus === "paid",
      active: paymentStatus === "pending",
      icon: Clock
    },
    { 
      id: 3, 
      label: "Confirmação automática", 
      completed: paymentStatus === "paid",
      icon: Shield
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border py-4 px-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
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
            <p className="font-bold text-xl text-foreground">R$ 32,67</p>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-md mx-auto w-full px-4 py-8">
        {/* Main Status Card */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border mb-6">
          {paymentStatus === "paid" ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Pagamento Confirmado!
              </h2>
              <p className="text-muted-foreground">
                Redirecionando para a página de sucesso...
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-6">
                {/* Outer spinning ring */}
                <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                
                {/* Inner content */}
                <div className="absolute inset-2 bg-card rounded-full flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-primary" />
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-foreground mb-2">
                Aguardando Pagamento{dots}
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                Abra o app do seu banco e cole o código PIX para pagar
              </p>
              
              {/* Timer */}
              <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Tempo: {formatTime(elapsedTime)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-6">
          <p className="font-semibold text-foreground mb-4">Status do Pagamento</p>
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      step.completed
                        ? "bg-success text-success-foreground"
                        : step.active
                        ? "bg-primary/20 text-primary border-2 border-primary"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {step.completed ? (
                      <Check className="w-5 h-5" />
                    ) : step.active ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        step.completed
                          ? "text-success"
                          : step.active
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.active && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Verificando a cada 5 segundos...
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Pagamento Seguro
              </p>
              <p className="text-xs text-muted-foreground">
                Assim que o pagamento for confirmado pelo seu banco, você será
                redirecionado automaticamente.
              </p>
            </div>
          </div>
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

export default AwaitingPayment;
