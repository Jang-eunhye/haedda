import { MdStorefront, MdOutlineStorefront } from 'react-icons/md';
import StickerStar from './StickerStar';

interface Props {
  count: number;
  isActive: boolean;
  onClick: () => void;
}

export default function RewardNavButton({ count, isActive, onClick }: Props) {
  const StoreIcon = isActive ? MdStorefront : MdOutlineStorefront;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isActive ? '할일로 돌아가기' : `보상, 스티커 ${count}개`}
      aria-current={isActive ? 'page' : undefined}
      className={`shrink-0 inline-flex items-center gap-2 pl-3 pr-3.5 py-2.5 rounded-2xl border shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-colors active:scale-[0.97] ${
        isActive
          ? 'bg-accent-muted/60 border-accent/40 text-foreground'
          : 'bg-accent-soft border-accent-muted/50 text-muted hover:text-foreground'
      }`}
    >
      <StoreIcon size={20} aria-hidden />
      <span className="w-px h-5 bg-accent-muted/50 shrink-0" aria-hidden />
      <span className="flex items-center gap-1">
        <StickerStar size="sm" />
        <span className="text-lg font-bold text-foreground tabular-nums leading-none">
          {count}
        </span>
      </span>
    </button>
  );
}
