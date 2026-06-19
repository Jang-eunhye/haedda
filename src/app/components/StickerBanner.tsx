import StickerStar from './StickerStar';

interface Props {
  count: number;
}

export default function StickerBanner({ count }: Props) {
  return (
    <div className="shrink-0 inline-flex items-center gap-3 pl-3.5 pr-4 py-2.5 rounded-2xl bg-accent-soft border border-accent-muted/50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <span className="text-xs font-semibold text-muted leading-none whitespace-nowrap">
        내 스티커
      </span>
      <span className="w-px h-6 bg-accent-muted/50 shrink-0" aria-hidden />
      <div className="flex items-center gap-1.5">
        <StickerStar size="md" />
        <span className="text-2xl font-bold text-foreground tabular-nums leading-none">
          {count}
        </span>
      </div>
    </div>
  );
}
