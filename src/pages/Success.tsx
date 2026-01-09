import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Clock, ArrowRight } from "lucide-react";
import coinIcon from "@/assets/coin-icon.png";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { nome, amount } = location.state || {};
  const [showCheck, setShowCheck] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const balance = amount || "2.834,72";

  useEffect(() => {
    // Animate check mark
    const checkTimer = setTimeout(() => setShowCheck(true), 300);
    const contentTimer = setTimeout(() => setShowContent(true), 800);
    
    return () => {
      clearTimeout(checkTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Success Header */}
      <div className="bg-gradient-to-b from-success to-emerald-500 pt-12 pb-16 px-4 text-center">
        {/* Animated Check Circle */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div 
            className={`absolute inset-0 bg-white rounded-full flex items-center justify-center transition-all duration-500 ${
              showCheck ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            <Check 
              className={`w-12 h-12 text-success transition-all duration-300 delay-200 ${
                showCheck ? "scale-100 opacity-100" : "scale-0 opacity-0"
              }`} 
              strokeWidth={3}
            />
          </div>
          {/* Pulse rings */}
          <div className={`absolute inset-0 rounded-full border-4 border-white/30 transition-all duration-700 ${
            showCheck ? "scale-150 opacity-0" : "scale-100 opacity-100"
          }`} />
          <div className={`absolute inset-0 rounded-full border-4 border-white/20 transition-all duration-1000 delay-200 ${
            showCheck ? "scale-[2] opacity-0" : "scale-100 opacity-100"
          }`} />
        </div>

        <h1 
          className={`text-2xl font-bold text-white mb-2 transition-all duration-500 ${
            showCheck ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          Pagamento Confirmado!
        </h1>
        <p 
          className={`text-white/90 transition-all duration-500 delay-100 ${
            showCheck ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          Sua taxa foi processada com sucesso
        </p>
      </div>

      {/* Content */}
      <div className={`flex-1 px-4 -mt-8 transition-all duration-500 ${
        showContent ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}>
        <div className="max-w-md mx-auto">
          {/* Status Card */}
          <div className="bg-card rounded-xl p-5 shadow-lg mb-4">
            <div className="flex items-center gap-4 mb-4">
              <img src={coinIcon} alt="Coin" className="w-12 h-12" />
              <div>
                <p className="text-sm text-muted-foreground">Valor liberado</p>
                <p className="text-2xl font-bold text-success">R$ {balance}</p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="w-5 h-5" />
                <div>
                  <p className="text-foreground font-medium">Reembolso em andamento</p>
                  <p className="text-sm">O valor será creditado em até 1 minuto</p>
                </div>
              </div>
            </div>
          </div>

          {/* Process Status */}
          <div className="bg-card rounded-xl p-5 shadow-md mb-4">
            <p className="text-xs text-muted-foreground mb-4">STATUS DO PROCESSO</p>
            
            <div className="space-y-4">
              {/* Step 1 - Complete */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-success text-success-foreground flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Taxa paga</p>
                  <p className="text-sm text-muted-foreground">Verificação de identidade concluída</p>
                </div>
              </div>

              {/* Step 2 - In Progress */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Processando reembolso</p>
                  <p className="text-sm text-muted-foreground">Aguarde até 1 minuto</p>
                </div>
              </div>

              {/* Step 3 - Pending */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-muted-foreground">Saldo disponível</p>
                  <p className="text-sm text-muted-foreground">R$ {balance} liberado para saque</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Info */}
          {nome && (
            <div className="bg-card rounded-xl p-5 shadow-md mb-6">
              <p className="text-xs text-muted-foreground mb-2">DADOS DO BENEFICIÁRIO</p>
              <p className="font-semibold text-foreground">{nome}</p>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => navigate("/")}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg transition-all hover:bg-primary/90 flex items-center justify-center gap-2 mb-6"
          >
            Voltar ao início
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 pb-6">
            {/* BACEN */}
            <div className="flex flex-col items-center">
              <svg viewBox="0 0 40 40" className="w-10 h-10 text-[#32BCAD]">
                <rect x="5" y="5" width="30" height="30" rx="4" fill="currentColor" opacity="0.1"/>
                <text x="20" y="28" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="bold">BC</text>
              </svg>
              <span className="text-xs text-muted-foreground mt-1">BACEN</span>
            </div>
            
            {/* gov.br */}
            <div className="flex flex-col items-center">
              <div className="text-[#1351B4] font-bold text-lg">gov.br</div>
            </div>
            
            {/* Receita Federal */}
            <div className="flex flex-col items-center">
              <svg viewBox="0 0 40 40" className="w-10 h-10 text-destructive">
                <path d="M20 5 L35 15 L35 30 L20 35 L5 30 L5 15 Z" fill="currentColor" opacity="0.1"/>
                <path d="M20 10 L30 17 L30 27 L20 32 L10 27 L10 17 Z" stroke="currentColor" fill="none" strokeWidth="1.5"/>
              </svg>
              <span className="text-xs text-muted-foreground mt-1">Receita Federal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
