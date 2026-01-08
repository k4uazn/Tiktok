import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import coinIcon from "@/assets/coin-icon.png";

const Withdraw = () => {
  const navigate = useNavigate();
  const balance = "2.834,72";
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ minutes: 10, seconds: 0 });

  const amounts = ["1,5", "5", "10"];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes === 0 && prev.seconds === 0) {
          return prev;
        }
        if (prev.seconds === 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleWithdraw = () => {
    // Handle withdrawal logic
    console.log("Withdrawing:", selectedAmount || balance);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dark Header */}
      <header className="bg-foreground text-primary-foreground py-4 px-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => navigate("/")} className="p-1">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">Reembolsos de reservas</h1>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            SEU SALDO EXPIRA EM{" "}
            <span className="text-primary-foreground font-mono">
              00:{timeLeft.minutes.toString().padStart(2, "0")}:{timeLeft.seconds.toString().padStart(2, "0")}
            </span>
          </p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Balance Card - Green gradient */}
        <div className="bg-gradient-to-r from-success to-emerald-500 rounded-xl p-5 text-success-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">SALDO DISPONÍVEL</p>
              <p className="text-3xl font-bold">R$ 2.831,12</p>
              <p className="text-sm opacity-80 mt-2">Aguardando confirmação para saque</p>
            </div>
            <img src={coinIcon} alt="Coin" className="w-16 h-16" />
          </div>
        </div>

        {/* Withdraw Money Card */}
        <div className="bg-card rounded-xl p-5 shadow-md">
          <h2 className="text-lg font-semibold text-foreground mb-4">Sacar dinheiro</h2>
          
          {/* PIX Transfer */}
          <div className="flex items-center gap-2 mb-5 text-muted-foreground">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">Transferência via /</span>
            <svg width="50" height="20" viewBox="0 0 512 512" fill="none">
              <path d="M112.57 391.19c20.056 0 38.928-7.808 53.12-22l76.693-76.692c5.385-5.404 14.765-5.384 20.15 0l76.989 76.989c14.191 14.172 33.045 21.98 53.12 21.98h15.098l-97.138 97.139c-30.326 30.344-79.505 30.344-109.85 0l-97.415-97.416h9.232z" fill="#32BCAD"/>
              <path d="M401.76 120.81c-20.056 0-38.928 7.808-53.12 22l-76.693 76.692c-5.385 5.404-14.765 5.384-20.15 0L174.808 142.513c-14.191-14.172-33.045-21.98-53.12-21.98h-15.098l97.138-97.139c30.326-30.344 79.505-30.344 109.85 0l97.415 97.416h-9.232z" fill="#32BCAD"/>
              <path d="M486.36 256l-74.68-74.68a53.34 53.34 0 01-8.83-10.11h-49.73a29.05 29.05 0 00-20.54 8.51l-76.55 76.55a44.17 44.17 0 01-62.54 0l-76.55-76.55a29.05 29.05 0 00-20.54-8.51H50.51a53.34 53.34 0 01-8.83 10.11L25.64 256l74.68 74.68a53.34 53.34 0 018.83 10.11h45.85a29.05 29.05 0 0020.54-8.51l76.55-76.55a44.17 44.17 0 0162.54 0l76.55 76.55a29.05 29.05 0 0020.54 8.51h49.73a53.34 53.34 0 018.83-10.11z" fill="#32BCAD"/>
            </svg>
          </div>

          {/* Amount Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {amounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                className={`py-3 px-4 rounded-lg border-2 font-semibold text-lg transition-all ${
                  selectedAmount === amount
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                R$ {amount}
              </button>
            ))}
          </div>

          {/* Full Balance Button */}
          <button
            onClick={() => setSelectedAmount(balance)}
            className={`w-full py-3 px-4 rounded-lg border-2 font-semibold text-lg mb-5 transition-all ${
              selectedAmount === balance
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-foreground hover:border-primary/50"
            }`}
          >
            R$ {balance}
          </button>

          {/* Withdraw Button */}
          <button
            onClick={handleWithdraw}
            className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            Sacar dinheiro
          </button>

          {/* Info Text */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            Para sacar dinheiro, você precisa de um saldo mínimo de{" "}
            <span className="text-primary">R$ 1,5</span>.<br />
            Os limites de saque para transações individuais e mensais podem variar de acordo com o país ou região.
          </p>
        </div>

        {/* Live Coins Card */}
        <div className="bg-card rounded-xl p-5 shadow-md">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground">Obtenha Moedas para uma LIVE</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Use Moedas para enviar presentes virtuais para seus hosts de live Favoritos.
              </p>
            </div>
            <span className="text-2xl">🌹</span>
          </div>
          <button className="w-full py-2.5 rounded-lg bg-secondary text-muted-foreground font-medium">
            Indisponível
          </button>
        </div>

        {/* Mobile Recharge Card */}
        <div className="bg-card rounded-xl p-5 shadow-md">
          <h3 className="font-semibold text-foreground mb-4">Recarga móvel</h3>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-muted-foreground">+55</span>
            <div className="h-6 w-px bg-border" />
            <input
              type="text"
              placeholder="12345678901"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
              disabled
            />
          </div>
          
          <button className="w-full py-2.5 rounded-lg bg-secondary text-muted-foreground font-medium mb-3">
            Indisponível
          </button>
          
          <p className="text-sm text-muted-foreground">
            Você precisa de um saldo mínimo de{" "}
            <span className="text-primary">R$ 10</span> para recarga de celular
          </p>
        </div>

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
};

export default Withdraw;
