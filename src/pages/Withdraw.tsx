import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, ChevronDown } from "lucide-react";
import coinIcon from "@/assets/coin-icon.png";

type PixKeyType = "cpf" | "phone" | "email" | "random" | null;
type Step = "amount" | "method" | "vincular";

// Animated digit component
const AnimatedDigit = ({ digit }: { digit: string }) => {
  const [animating, setAnimating] = useState(false);
  const [prevDigit, setPrevDigit] = useState(digit);

  useEffect(() => {
    if (prevDigit !== digit) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setPrevDigit(digit);
        setAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [digit, prevDigit]);

  return (
    <span className="relative inline-block w-[0.6em] text-center overflow-hidden">
      <span
        className={`inline-block transition-all duration-150 ${
          animating ? "opacity-0 -translate-y-full" : "opacity-100 translate-y-0"
        }`}
      >
        {prevDigit}
      </span>
      <span
        className={`absolute inset-0 transition-all duration-150 ${
          animating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
        }`}
      >
        {digit}
      </span>
    </span>
  );
};

const Withdraw = () => {
  const navigate = useNavigate();
  const balance = "2.834,72";
  const [step, setStep] = useState<Step>("amount");
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ minutes: 10, seconds: 0 });
  
  // Vincular PIX form states
  const [nome, setNome] = useState("");
  const [nomeError, setNomeError] = useState("");
  const [pixKeyType, setPixKeyType] = useState<PixKeyType>(null);
  const [pixKey, setPixKey] = useState("");
  const [pixKeyError, setPixKeyError] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const pixKeyTypes: { value: PixKeyType; label: string; placeholder: string }[] = [
    { value: "cpf", label: "CPF", placeholder: "000.000.000-00" },
    { value: "phone", label: "Celular", placeholder: "+55 11 99999-9999" },
    { value: "email", label: "E-mail", placeholder: "seu@email.com" },
    { value: "random", label: "Chave aleatória", placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" },
  ];

  const amountOptions = ["1,5", "5", "10"];

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

  const validateNome = (value: string): boolean => {
    const trimmed = value.trim();
    if (!trimmed) {
      setNomeError("Digite seu nome completo");
      return false;
    }
    if (trimmed.length < 3) {
      setNomeError("Nome muito curto");
      return false;
    }
    if (trimmed.length > 100) {
      setNomeError("Nome muito longo");
      return false;
    }
    setNomeError("");
    return true;
  };

  // Validate CPF with algorithm check
  const validateCPF = (cpf: string): boolean => {
    const cleaned = cpf.replace(/\D/g, "");
    
    if (cleaned.length !== 11) return false;
    
    // Check for known invalid CPFs (all same digits)
    if (/^(\d)\1{10}$/.test(cleaned)) return false;
    
    // Validate first digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned[i]) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned[9])) return false;
    
    // Validate second digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned[i]) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned[10])) return false;
    
    return true;
  };

  const validatePixKey = (key: string, type: PixKeyType): boolean => {
    if (!type) {
      setPixKeyError("Selecione o tipo de chave primeiro");
      return false;
    }

    const trimmedKey = key.trim();
    
    if (!trimmedKey) {
      setPixKeyError("Digite sua chave PIX");
      return false;
    }

    if (trimmedKey.length > 100) {
      setPixKeyError("Chave PIX muito longa");
      return false;
    }

    switch (type) {
      case "cpf":
        const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
        if (!cpfRegex.test(trimmedKey)) {
          setPixKeyError("CPF inválido. Use o formato: 000.000.000-00");
          return false;
        }
        if (!validateCPF(trimmedKey)) {
          setPixKeyError("CPF inválido. Verifique os dígitos");
          return false;
        }
        break;
      case "phone":
        const phoneRegex = /^\+?55?\s?\d{2}\s?\d{4,5}-?\d{4}$/;
        if (!phoneRegex.test(trimmedKey)) {
          setPixKeyError("Celular inválido. Use o formato: +55 11 99999-9999");
          return false;
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedKey)) {
          setPixKeyError("E-mail inválido");
          return false;
        }
        break;
      case "random":
        const uuidRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
        if (!uuidRegex.test(trimmedKey)) {
          setPixKeyError("Chave aleatória inválida");
          return false;
        }
        break;
    }

    setPixKeyError("");
    return true;
  };

  const handleSubmit = () => {
    const isNomeValid = validateNome(nome);
    const isPixValid = validatePixKey(pixKey, pixKeyType);
    
    if (isNomeValid && isPixValid) {
      navigate("/confirmacao", {
        state: {
          nome,
          pixKeyType,
          pixKey,
          amount: selectedAmount || balance
        }
      });
    }
  };

  const handleBack = () => {
    if (step === "vincular") {
      setStep("method");
      setShowTypeDropdown(false);
    } else if (step === "method") {
      setStep("amount");
    } else {
      navigate("/");
    }
  };

  const getHeaderTitle = () => {
    return "Reembolsos de reservas";
  };

  // PIX Icon Component
  const PixIcon = ({ size = 32 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none">
      <path d="M112.57 391.19c20.056 0 38.928-7.808 53.12-22l76.693-76.692c5.385-5.404 14.765-5.384 20.15 0l76.989 76.989c14.191 14.172 33.045 21.98 53.12 21.98h15.098l-97.138 97.139c-30.326 30.344-79.505 30.344-109.85 0l-97.415-97.416h9.232z" fill="#32BCAD"/>
      <path d="M401.76 120.81c-20.056 0-38.928 7.808-53.12 22l-76.693 76.692c-5.385 5.404-14.765 5.384-20.15 0L174.808 142.513c-14.191-14.172-33.045-21.98-53.12-21.98h-15.098l97.138-97.139c30.326-30.344 79.505-30.344 109.85 0l97.415 97.416h-9.232z" fill="#32BCAD"/>
      <path d="M486.36 256l-74.68-74.68a53.34 53.34 0 01-8.83-10.11h-49.73a29.05 29.05 0 00-20.54 8.51l-76.55 76.55a44.17 44.17 0 01-62.54 0l-76.55-76.55a29.05 29.05 0 00-20.54-8.51H50.51a53.34 53.34 0 01-8.83 10.11L25.64 256l74.68 74.68a53.34 53.34 0 018.83 10.11h45.85a29.05 29.05 0 0020.54-8.51l76.55-76.55a44.17 44.17 0 0162.54 0l76.55 76.55a29.05 29.05 0 0020.54 8.51h49.73a53.34 53.34 0 018.83-10.11z" fill="#32BCAD"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Dark Header */}
      <header className="bg-foreground text-primary-foreground py-4 px-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={handleBack} className="p-1">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold flex-1 text-center pr-6">
              {getHeaderTitle()}
            </h1>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            SEU SALDO EXPIRA EM{" "}
            <span className="text-primary-foreground font-mono inline-flex">
              <AnimatedDigit digit="0" />
              <AnimatedDigit digit="0" />
              <span>:</span>
              <AnimatedDigit digit={timeLeft.minutes.toString().padStart(2, "0")[0]} />
              <AnimatedDigit digit={timeLeft.minutes.toString().padStart(2, "0")[1]} />
              <span>:</span>
              <AnimatedDigit digit={timeLeft.seconds.toString().padStart(2, "0")[0]} />
              <AnimatedDigit digit={timeLeft.seconds.toString().padStart(2, "0")[1]} />
            </span>
          </p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-4">
        {/* Step 1: Amount Selection - Always visible */}
        <div className="animate-fade-in">
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

          {/* Amount Selection Card */}
          <div className="bg-card rounded-xl p-5 shadow-md">
            <h2 className="text-lg font-bold text-foreground mb-3">Sacar dinheiro</h2>
            
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span className="text-sm">Transferência via /</span>
              <PixIcon size={24} />
            </div>

            {/* Amount Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {amountOptions.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  className={`py-3 rounded-lg border-2 font-semibold transition-all ${
                    selectedAmount === amount
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-foreground hover:border-primary/50"
                  }`}
                >
                  R$ {amount}
                </button>
              ))}
            </div>

            {/* Full Balance Option */}
            <button
              onClick={() => setSelectedAmount(balance)}
              className={`w-full py-3 rounded-lg border-2 font-semibold mb-4 transition-all ${
                selectedAmount === balance
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-foreground hover:border-primary/50"
              }`}
            >
              R$ {balance}
            </button>

            {/* Sacar Button */}
            <button
              onClick={() => setStep("method")}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg transition-all hover:bg-primary/90"
            >
              Sacar dinheiro
            </button>

            {/* Info Text */}
            <p className="text-sm text-muted-foreground text-center mt-4">
              Para sacar dinheiro, você precisa de um saldo mínimo de{" "}
              <span className="text-primary">R$ 1,5</span>.
              <br />
              Os limites de saque para transações individuais e mensais podem variar de acordo com o país ou região.
            </p>
          </div>
        </div>

        {/* Step 2: Method Selection - Slides up from bottom */}
        <div
          className={`fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out z-50 ${
            step === "method" || step === "vincular" ? "translate-y-0" : "translate-y-full"
          }`}
          style={{ maxHeight: "40vh" }}
        >
          <div className="p-4">
            {/* Handle bar */}
            <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4" />
            
            <h2 className="text-lg font-bold text-foreground mb-4">Método de saque</h2>
            
            {/* PIX Method Option */}
            <button
              onClick={() => setStep("vincular")}
              className="w-full bg-secondary/30 rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform duration-150"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#32BCAD]/10 rounded-xl flex items-center justify-center">
                  <PixIcon size={28} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground text-base">PIX</p>
                  <p className="text-sm text-[#32BCAD]">Recebimento imediato</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Backdrop when method panel is open */}
        {(step === "method" || step === "vincular") && (
          <div 
            className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
            onClick={() => setStep("amount")}
          />
        )}

        {/* Step 3: Vincular PIX Form - Slides up as second level */}
        <div
          className={`fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out z-[60] ${
            step === "vincular" ? "translate-y-0" : "translate-y-full"
          }`}
          style={{ maxHeight: "85vh" }}
        >
          <div className="p-4 max-h-[85vh] overflow-y-auto">
            {/* Handle bar */}
            <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4" />
            
            <h2 className="text-lg font-bold text-foreground mb-6">Vincular PIX</h2>
            
            {/* Nome Input */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-foreground block mb-2">
                Nome
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  if (nomeError) setNomeError("");
                }}
                placeholder="Nome completo"
                maxLength={100}
                className={`w-full py-3 border-b-2 bg-transparent text-foreground placeholder:text-muted-foreground outline-none transition-all ${
                  nomeError ? "border-destructive" : "border-border focus:border-primary"
                }`}
              />
              {nomeError && (
                <p className="text-destructive text-sm mt-1">{nomeError}</p>
              )}
            </div>

            {/* Tipo de Chave PIX Dropdown */}
            <div className="mb-6 relative">
              <label className="text-sm font-semibold text-foreground block mb-2">
                Tipo de Chave PIX
              </label>
              <button
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="w-full py-3 border-b-2 border-border bg-transparent text-left flex items-center justify-between hover:border-primary transition-all"
              >
                <span className={pixKeyType ? "text-foreground" : "text-muted-foreground"}>
                  {pixKeyType 
                    ? pixKeyTypes.find(t => t.value === pixKeyType)?.label 
                    : "Escolha o tipo de chave PIX"}
                </span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${showTypeDropdown ? "rotate-180" : ""}`} />
              </button>
              
              {showTypeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-[70] overflow-hidden">
                  {pixKeyTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        setPixKeyType(type.value);
                        setPixKey("");
                        setPixKeyError("");
                        setShowTypeDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-secondary transition-colors ${
                        pixKeyType === type.value ? "bg-primary/10 text-primary" : "text-foreground"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chave PIX Input */}
            <div className="mb-8">
              <label className="text-sm font-semibold text-foreground block mb-2">
                Chave PIX
              </label>
              <input
                type="text"
                value={pixKey}
                onChange={(e) => {
                  let value = e.target.value;
                  
                  // Auto-format based on key type
                  if (pixKeyType === "cpf") {
                    // Remove non-digits and format CPF
                    value = value.replace(/\D/g, "").slice(0, 11);
                    if (value.length > 9) {
                      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
                    } else if (value.length > 6) {
                      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
                    } else if (value.length > 3) {
                      value = `${value.slice(0, 3)}.${value.slice(3)}`;
                    }
                  } else if (pixKeyType === "phone") {
                    // Remove non-digits and format phone
                    value = value.replace(/\D/g, "").slice(0, 11);
                    if (value.length > 7) {
                      value = `+55 ${value.slice(0, 2)} ${value.slice(2, 7)}-${value.slice(7)}`;
                    } else if (value.length > 2) {
                      value = `+55 ${value.slice(0, 2)} ${value.slice(2)}`;
                    } else if (value.length > 0) {
                      value = `+55 ${value}`;
                    }
                  }
                  
                  setPixKey(value);
                  if (pixKeyError) setPixKeyError("");
                }}
                placeholder={pixKeyType 
                  ? pixKeyTypes.find(t => t.value === pixKeyType)?.placeholder 
                  : "Selecione o tipo de chave primeiro"}
                disabled={!pixKeyType}
                maxLength={pixKeyType === "cpf" ? 14 : pixKeyType === "phone" ? 17 : 100}
                className={`w-full py-3 border-b-2 bg-transparent text-foreground placeholder:text-muted-foreground outline-none transition-all ${
                  pixKeyError 
                    ? "border-destructive" 
                    : "border-border focus:border-primary disabled:opacity-50"
                }`}
              />
              {pixKeyError && (
                <p className="text-destructive text-sm mt-1">{pixKeyError}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!nome || !pixKeyType || !pixKey}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 mb-4"
            >
              Confirmar
            </button>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
};

export default Withdraw;
