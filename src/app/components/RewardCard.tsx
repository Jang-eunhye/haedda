import { Reward } from '../types';
import ItemMenu from './ItemMenu';
import StickerStar from './StickerStar';

interface Props {
  reward: Reward;
  totalStickers: number;
  onClaim: (id: string) => void;
  onEdit: (reward: Reward) => void;
  onDelete: (id: string) => void;
}

export default function RewardCard({
  reward,
  totalStickers,
  onClaim,
  onEdit,
  onDelete,
}: Props) {
  const canClaim = totalStickers >= reward.stickerCost;

  return (
    <article
      className={`bg-surface rounded-2xl p-4 border border-border transition-all duration-200 ${
        canClaim ? 'hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]' : ''
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <p className="font-medium text-[15px] leading-snug flex-1 break-words min-w-0 text-foreground">
          {reward.content}
        </p>
        <div className="flex items-center gap-1 shrink-0">
          <div className="flex items-center gap-1 bg-accent-soft px-2.5 py-1 rounded-full border border-accent-muted/50">
            <StickerStar size="sm" />
            <span className="text-xs font-bold text-accent">×{reward.stickerCost}</span>
          </div>
          <ItemMenu onEdit={() => onEdit(reward)} onDelete={() => onDelete(reward.id)} />
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
