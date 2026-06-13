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
    <div className={`bg-white rounded-2xl p-4 shadow-sm border transition-opacity ${completed ? 'border-gray-100 opacity-60' : 'border-amber-100'}`}>
      <div className="flex justify-between items-start gap-2">
        <p className={`font-medium text-sm flex-1 break-words ${completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
          {mission.content}
        </p>
        <div className="flex items-center gap-0.5 shrink-0 bg-amber-50 px-2 py-1 rounded-full">
          <span className="text-base">⭐</span>
          <span className="text-xs font-bold text-amber-600">×{mission.stickerCount}</span>
        </div>
      </div>

      <div className={`mt-2 text-xs flex items-center gap-1 ${isExpired && !completed ? 'text-red-400' : 'text-gray-400'}`}>
        <span>🗓</span>
        <span>{formatDeadline(mission.deadline)}</span>
        {isExpired && !completed && <span className="font-semibold">· 기한 초과</span>}
      </div>

      {completed ? (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs bg-green-100 text-green-600 font-semibold px-2 py-0.5 rounded-full">✓ 완료</span>
          {earnedStickers != null && earnedStickers > 0 ? (
            <span className="text-xs text-amber-500 font-medium">+{earnedStickers}⭐ 획득</span>
          ) : (
            <span className="text-xs text-gray-400">스티커 없음 (기한 초과)</span>
          )}
        </div>
      ) : (
        <div className="mt-3">
          <button
            onClick={() => onComplete(mission.id)}
            className="w-full py-2 rounded-xl text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors"
          >
            완료하기
          </button>
          {isExpired && (
            <p className="text-center text-xs text-gray-400 mt-1.5">
              기한이 지나 스티커를 받을 수 없어요
            </p>
          )}
        </div>
      )}
    </div>
  );
}
