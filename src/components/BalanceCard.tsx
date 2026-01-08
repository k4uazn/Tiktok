import coinIcon from "@/assets/coin-icon.png";

interface BalanceCardProps {
  balance: string;
  onWithdraw: () => void;
}

export const BalanceCard = ({ balance, onWithdraw }: BalanceCardProps) => {
  return (
    <div className="bg-card rounded-xl p-4 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <span>Seu saldo</span>
            <img src={coinIcon} alt="Coin" className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-foreground">R$ {balance}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <svg width="24" height="24" viewBox="0 0 512 512" fill="none">
              <path d="M112.57 391.19c20.056 0 38.928-7.808 53.12-22l76.693-76.692c5.385-5.404 14.765-5.384 20.15 0l76.989 76.989c14.191 14.172 33.045 21.98 53.12 21.98h15.098l-97.138 97.139c-30.326 30.344-79.505 30.344-109.85 0l-97.415-97.416h9.232z" fill="#32BCAD"/>
              <path d="M401.76 120.81c-20.056 0-38.928 7.808-53.12 22l-76.693 76.692c-5.385 5.404-14.765 5.384-20.15 0L174.808 142.513c-14.191-14.172-33.045-21.98-53.12-21.98h-15.098l97.138-97.139c30.326-30.344 79.505-30.344 109.85 0l97.415 97.416h-9.232z" fill="#32BCAD"/>
              <path d="M486.36 256l-74.68-74.68a53.34 53.34 0 01-8.83-10.11h-49.73a29.05 29.05 0 00-20.54 8.51l-76.55 76.55a44.17 44.17 0 01-62.54 0l-76.55-76.55a29.05 29.05 0 00-20.54-8.51H50.51a53.34 53.34 0 01-8.83 10.11L25.64 256l74.68 74.68a53.34 53.34 0 018.83 10.11h45.85a29.05 29.05 0 0020.54-8.51l76.55-76.55a44.17 44.17 0 0162.54 0l76.55 76.55a29.05 29.05 0 0020.54 8.51h49.73a53.34 53.34 0 018.83-10.11z" fill="#32BCAD"/>
            </svg>
          </div>
          <button
            onClick={onWithdraw}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Sacar
          </button>
        </div>
      </div>
    </div>
  );
};
