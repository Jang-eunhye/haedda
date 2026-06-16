import { Mission } from '../types';

interface Props {
  mission: Mission;
  onComplete: (id: string) => void;
}

function formatDeadline(deadline: string) {
  const date = new Date(deadline);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MissionCard({ mission, onComplete }: Props) {
  const isExpired = new Date(mission.deadline) < new Date();
  const { completed, earnedStickers } = mission;

  return (
    <article
      className={`group bg-surface rounded-2xl p-4 border transition-all duration-200 ${
        completed
          ? 'border-border/60 opacity-60'
          : 'border-border hover:border-border hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
      }`}
    >
      <div className="flex justify-between items-start gap-3">
        <p
          className={`font-medium text-[15px] leading-snug flex-1 break-words ${
            completed ? 'text-muted line-through' : 'text-foreground'
          }`}
        >
          {mission.content}
        </p>
        <div className="flex items-center gap-1 shrink-0 bg-accent-soft px-2.5 py-1 rounded-full border border-accent-muted/50">
          <span className="text-sm leading-none">⭐</span>
          <span className="text-xs font-bold text-accent">×{mission.stickerCount}</span>
        </div>
      </div>

      <div
        className={`mt-2.5 text-xs flex items-center gap-1.5 ${
          isExpired && !completed ? 'text-danger' : 'text-muted'
        }`}
      >
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{formatDeadline(mission.deadline)}</span>
        {isExpired && !completed && (
          <span className="font-semibold text-danger/80">· 기한 초과</span>
        )}
      </div>

      {completed ? (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs bg-success-soft text-success font-semibold px-2.5 py-1 rounded-full">
            ✓ 완료
          </span>
          {earnedStickers != null && earnedStickers > 0 ? (
            <span className="text-xs text-accent font-medium">+{earnedStickers}⭐ 획득</span>
          ) : (
            <span className="text-xs text-muted">스티커 없음 (기한 초과)</span>
          )}
        </div>
      ) : (
        <div className="mt-3.5">
          <button
            onClick={() => onComplete(mission.id)}
            className="w-full py-2.5 rounded-xl text-sm font-semibold bg-foreground text-white hover:bg-foreground/90 active:scale-[0.98] transition-all duration-150"
          >
            완료하기
          </button>
          {isExpired && (
            <p className="text-center text-xs text-muted mt-2">
              기한이 지나 스티커를 받을 수 없어요
            </p>
          )}
        </div>
      )}
    </article>
  );
}
