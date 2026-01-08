import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BalanceCard } from "@/components/BalanceCard";
import { CongratulationsCard } from "@/components/CongratulationsCard";
import { CheckInCard } from "@/components/CheckInCard";
import { TaskCard } from "@/components/TaskCard";
import { RewardModal } from "@/components/RewardModal";

const Index = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);
  const balance = "2.834,72";

  const checkInDays = [
    { day: 1, points: 50, completed: true },
    { day: 2, points: 100, completed: true },
    { day: 3, points: 150, completed: true },
    { day: 4, points: 200, completed: true },
    { day: 5, points: 250, completed: true },
    { day: 6, points: 300, completed: true },
  ];

  const videoSubTasks = [
    { label: "Assista por 10 min", points: 50, completed: true },
    { label: "Assista por 20 min", points: 100, completed: true },
    { label: "Assista por 30 min", points: 150, completed: true },
    { label: "Assista por 60 min", points: 225, completed: true },
  ];

  // Set expiration to 15 minutes from now for demo
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  const handleWithdraw = () => {
    navigate("/sacar");
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-xl font-bold text-foreground">TikTok Bônus</h1>
        </header>

        {/* Cards Stack */}
        <div className="space-y-4">
          <BalanceCard balance={balance} onWithdraw={handleWithdraw} />
          
          <CongratulationsCard balance={balance} />
          
          <CheckInCard 
            days={checkInDays}
            totalPoints={8414}
            dateRange="12 de nov - 25 de nov"
            allCompleted={true}
          />
          
          <TaskCard 
            title="Vê anúncios direcionados diariamente para ganhares até"
            totalPoints={2730}
            progress={{ current: 30, total: 30 }}
            description="anúncios assistidos"
            completed={true}
          />
          
          <TaskCard 
            title="Assistir vídeos"
            totalPoints={500}
            completed={true}
            subTasks={videoSubTasks}
          />
          
          <TaskCard 
            title="Resgate suas recompensas e ganhe"
            totalPoints={640}
            progress={{ current: 8, total: 8 }}
            description="resgatados"
            completed={true}
          />
          
          <TaskCard 
            title="Faça 60 pesquisas diárias para ganhar até"
            totalPoints={996}
            progress={{ current: 60, total: 60 }}
            description="pesquisas feitas hoje"
            completed={true}
          />
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
          <div className="max-w-md mx-auto flex justify-around py-3">
            <button className="flex flex-col items-center text-primary">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs mt-1">Início</span>
            </button>
            <button className="flex flex-col items-center text-muted-foreground">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs mt-1">Ganhar</span>
            </button>
            <button className="flex flex-col items-center text-muted-foreground">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs mt-1">Perfil</span>
            </button>
          </div>
        </nav>
        
        {/* Spacer for fixed nav */}
        <div className="h-20" />
      </div>

      <RewardModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        balance={balance}
        expiresAt={expiresAt}
      />
    </div>
  );
};

export default Index;
