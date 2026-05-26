import { Mission } from '../types';

interface Props {
  mission: Mission;
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

export default function MissionCard({ mission }: Props) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100">
      <div className="flex justify-between items-start gap-2">
        <p className="text-gray-800 font-medium text-sm flex-1 break-words">{mission.content}</p>
        <div className="flex items-center gap-0.5 shrink-0 bg-amber-50 px-2 py-1 rounded-full">
          <span className="text-base">⭐</span>
          <span className="text-xs font-bold text-amber-600">×{mission.stickerCount}</span>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
        <span>🗓</span>
        <span>{formatDeadline(mission.deadline)}</span>
      </div>
    </div>
  );
}
