interface Props {
  count: number;
}

export default function StickerBanner({ count }: Props) {
  return (
    <div className="mx-4 sm:mx-6 flex items-center justify-between bg-background rounded-2xl px-4 py-3.5 border border-border">
      <span className="text-sm font-medium text-muted">내 스티커</span>
      <div className="flex items-center gap-2">
        <span className="text-lg leading-none">⭐</span>
        <span className="text-xl font-bold text-foreground tabular-nums">{count}</span>
      </div>
    </div>
  );
}
