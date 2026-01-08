import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: string;
  expiresAt: Date;
}

export const RewardModal = ({ isOpen, onClose, balance, expiresAt }: RewardModalProps) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = expiresAt.getTime() - now.getTime();
      
      if (diff <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-card rounded-2xl p-6 max-w-sm w-full shadow-xl animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <div className="text-4xl mb-4">🏆</div>
          <h2 className="text-xl font-bold text-foreground mb-2">Gol de Prêmios</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Parabéns! Como parte de uma campanha de recompensas exclusiva.
          </p>
          
          <p className="text-3xl font-bold text-primary mb-4">
            R$ {balance}
          </p>
          
          <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm mb-6">
            <span>Expira em</span>
            <div className="flex items-center gap-1 font-mono">
              <span className="bg-secondary px-2 py-1 rounded text-foreground font-medium">
                {timeLeft.hours.toString().padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-secondary px-2 py-1 rounded text-foreground font-medium">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-secondary px-2 py-1 rounded text-foreground font-medium">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </span>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Obrigado
          </button>
        </div>
      </div>
    </div>
  );
};
