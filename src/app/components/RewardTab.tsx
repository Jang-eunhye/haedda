interface Props {
  totalStickers: number;
}

export default function RewardTab({ totalStickers }: Props) {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-base font-bold text-foreground">보상</h2>
        <p className="text-xs text-muted mt-0.5">모은 스티커로 보상을 받아보세요</p>
      </div>

      <div className="bg-surface rounded-2xl p-8 border border-border text-center">
        <p className="text-xs font-medium text-muted mb-3">내가 모은 스티커</p>
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-soft border border-accent-muted/50 mb-3 text-3xl">
          ⭐
        </div>
        <p className="text-5xl font-bold text-foreground tabular-nums tracking-tight">
          {totalStickers}
        </p>
        <p className="text-sm text-muted mt-1">개</p>
      </div>

      <div className="mt-6 text-center py-10 rounded-2xl border border-dashed border-border bg-background/50">
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-surface border border-border flex items-center justify-center text-2xl">
          🎁
        </div>
        <p className="text-sm font-medium text-muted">보상 기능은 곧 추가될 예정이에요</p>
      </div>
    </div>
  );
}
