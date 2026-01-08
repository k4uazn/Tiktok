import { Check } from "lucide-react";
import coinIcon from "@/assets/coin-icon.png";

interface TaskProgress {
  current: number;
  total: number;
}

interface SubTask {
  label: string;
  points: number;
  completed: boolean;
}

interface TaskCardProps {
  title: string;
  totalPoints: number;
  progress?: TaskProgress;
  completed: boolean;
  subTasks?: SubTask[];
  description?: string;
}

export const TaskCard = ({ 
  title, 
  totalPoints, 
  progress, 
  completed, 
  subTasks,
  description 
}: TaskCardProps) => {
  return (
    <div className="bg-card rounded-xl p-5 shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-foreground font-medium">
            {title} <span className="text-primary font-bold">{totalPoints.toLocaleString()} pontos</span>
          </p>
          {progress && (
            <p className="text-primary text-sm mt-1">
              • {progress.current}/{progress.total} {description || 'concluídos'}
            </p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          completed 
            ? 'bg-secondary text-secondary-foreground' 
            : 'bg-primary/10 text-primary'
        }`}>
          {completed ? 'Concluído' : 'Pendente'}
        </span>
      </div>
      
      {subTasks && subTasks.length > 0 && (
        <div className="mt-4">
          {subTasks[0] && (
            <div className="mb-3">
              <span className="inline-block px-3 py-1.5 bg-secondary rounded-full text-sm text-secondary-foreground">
                {subTasks[0].label}
              </span>
            </div>
          )}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {subTasks.map((task, index) => (
              <div 
                key={index}
                className={`flex flex-col items-center p-3 rounded-lg min-w-[70px] transition-all ${
                  task.completed 
                    ? 'bg-primary/10' 
                    : 'bg-secondary'
                }`}
              >
                <div className="relative mb-1">
                  <img src={coinIcon} alt="Coin" className="w-6 h-6" />
                  {task.completed && (
                    <div className="absolute -bottom-1 -right-1 bg-success rounded-full p-0.5">
                      <Check className="w-2.5 h-2.5 text-success-foreground" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-foreground">{task.points} pontos</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
