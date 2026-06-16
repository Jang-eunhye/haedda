import { Reward } from '../types';

interface Props {
  reward: Reward;
  totalStickers: number;
  onClaim: (id: string) => void;
}

export default function RewardCard({ reward, totalStickers, onClaim }: Props) {
  const canClaim = totalStickers >= reward.stickerCost;

  return (
    <article
      className={`bg-surface rounded-2xl p-4 border border-border transition-all duration-200 ${
        canClaim ? 'hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]' : ''
      }`}
    >
      <div className="flex justify-between items-start gap-3">
        <p className="font-medium text-[15px] leading-snug flex-1 break-words text-foreground">
          {reward.content}
        </p>
        <div className="flex items-center gap-1 shrink-0 bg-accent-soft px-2.5 py-1 rounded-full border border-accent-muted/50">
          <span className="text-sm leading-none">⭐</span>
          <span className="text-xs font-bold text-accent">×{reward.stickerCost}</span>
        </div>
      </div>

      {canClaim ? (
        <button
          type="button"
          onClick={() => onClaim(reward.id)}
          className="mt-3.5 w-full py-2.5 rounded-xl text-sm font-semibold bg-foreground text-white hover:bg-foreground/90 active:scale-[0.98] transition-all duration-150"
        >
          받기
        </button>
      ) : (
        <div className="mt-3.5 w-full py-2.5 rounded-xl text-sm text-center text-muted bg-background border border-border select-none">
          스티커가 부족해요
        </div>
      )}
    </article>
  );
}
