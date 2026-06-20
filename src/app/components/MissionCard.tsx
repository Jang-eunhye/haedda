import { MdOutlineAutorenew, MdCalendarToday } from 'react-icons/md';
import { Mission } from "../types";
import { formatDeadlineLabel, isDeadlineExpired } from "../utils/date";
import { formatRecurrenceLabel } from "../utils/recurrence";
import StickerStar from "./StickerStar";

interface Props {
  mission: Mission;
  onComplete: (id: string) => void;
  onOpen: (mission: Mission) => void;
}

export default function MissionCard({ mission, onComplete, onOpen }: Props) {
  const isExpired = isDeadlineExpired(mission.deadline);
  const isRecurring = !!mission.recurrence;
  const missedCount = mission.missedCount ?? 0;
  const streak = mission.consecutiveCompletions ?? 0;
  const showExpiredStyle = isExpired && !isRecurring;
  const showMissedStripe = isRecurring && missedCount > 0;

  return (
    <article className="group flex overflow-hidden bg-surface rounded-2xl border border-border transition-all duration-200 hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      {showMissedStripe && (
        <div className="w-1 shrink-0 bg-danger" aria-hidden />
      )}
      <div className="min-w-0 flex-1 p-4">
        <button
          type="button"
          onClick={() => onOpen(mission)}
          className="w-full text-left cursor-pointer rounded-xl -m-1 p-1 hover:bg-background/60 transition-colors active:scale-[0.995]"
        >
          <div
            className={`inline-flex flex-wrap items-center gap-0.5 ${isExpired ? "opacity-40" : ""}`}
            aria-label={`스티커 ${mission.stickerCount}개`}
          >
            {Array.from({ length: mission.stickerCount }, (_, i) => (
              <StickerStar key={i} size="md" />
            ))}
          </div>

          <p className="mt-2 font-medium text-[15px] leading-snug break-words text-foreground">
            {mission.content}
          </p>

          {isRecurring && missedCount > 0 && (
            <p className="mt-1.5 text-xs text-danger">미완료 {missedCount}회</p>
          )}

          {isRecurring && missedCount === 0 && streak > 0 && (
            <p className="mt-1.5 text-xs text-success">{streak}회 연속 완료</p>
          )}

          <div
            className={`mt-2 text-xs flex items-center gap-1.5 flex-wrap ${
              showExpiredStyle ? "text-danger" : "text-muted"
            }`}
          >
            <MdCalendarToday size={14} className="shrink-0" aria-hidden />
            <span>{formatDeadlineLabel(mission.deadline)}</span>
            {isRecurring && mission.recurrence && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent bg-accent-soft px-2 py-0.5 rounded-full border border-accent-muted/50">
                <MdOutlineAutorenew size={12} className="shrink-0" aria-hidden />
                {formatRecurrenceLabel(mission.recurrence)}
              </span>
            )}
            {showExpiredStyle && (
              <span className="font-semibold text-danger/80">· 기한 초과</span>
            )}
          </div>
        </button>

        <div className="mt-3.5">
          <button
            type="button"
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
      </div>
    </article>
  );
}
