import { Check } from "lucide-react";
import coinIcon from "@/assets/coin-icon.png";

interface CheckInDay {
  day: number;
  points: number;
  completed: boolean;
}

interface CheckInCardProps {
  days: CheckInDay[];
  totalPoints: number;
  dateRange: string;
  allCompleted: boolean;
}

export const CheckInCard = ({ days, totalPoints, dateRange, allCompleted }: CheckInCardProps) => {
  return (
    <div className="bg-card rounded-xl p-5 shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-foreground font-medium">
            Entre por 14 dias para ganhar
          </p>
          <p className="text-primary font-bold text-lg">{totalPoints.toLocaleString()} pontos</p>
          <p className="text-muted-foreground text-sm mt-1">• {dateRange}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          allCompleted 
            ? 'bg-secondary text-secondary-foreground' 
            : 'bg-primary/10 text-primary'
        }`}>
          {allCompleted ? 'Concluído' : 'Em andamento'}
        </span>
      </div>
      
      {allCompleted && (
        <p className="text-success text-sm mb-4 flex items-center gap-1">
          <Check className="w-4 h-4" />
          Você concluiu todos os dias de check-in.
        </p>
      )}
      
      <div className="grid grid-cols-6 gap-2">
        {days.map((day) => (
          <div 
            key={day.day}
            className={`flex flex-col items-center p-2 rounded-lg transition-all ${
              day.completed 
                ? 'bg-primary/10' 
                : 'bg-secondary'
            }`}
          >
            <div className="relative mb-1">
              <img src={coinIcon} alt="Coin" className="w-6 h-6" />
              {day.completed && (
                <div className="absolute -bottom-1 -right-1 bg-success rounded-full p-0.5">
                  <Check className="w-2.5 h-2.5 text-success-foreground" />
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-foreground">{day.points}</span>
            <span className="text-xs text-muted-foreground">Dia {day.day.toString().padStart(2, '0')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
