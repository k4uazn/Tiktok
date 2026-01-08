import rewardsComplete from "@/assets/rewards-complete.png";

interface CongratulationsCardProps {
  balance: string;
}

export const CongratulationsCard = ({ balance }: CongratulationsCardProps) => {
  return (
    <div className="bg-card rounded-xl p-5 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Parabéns!</h2>
          <p className="text-foreground">
            Você concluiu<br />
            <span className="font-semibold">todas as tarefas</span>
          </p>
          <p className="text-primary text-xl font-bold mt-2">R$ {balance}</p>
        </div>
        <img 
          src={rewardsComplete} 
          alt="Rewards complete" 
          className="w-28 h-28 object-contain"
        />
      </div>
    </div>
  );
};
