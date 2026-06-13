interface Props {
  totalStickers: number;
}

export default function RewardTab({ totalStickers }: Props) {
  return (
    <div>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-amber-100 text-center">
        <p className="text-sm font-medium text-gray-400 mb-2">내가 모은 스티커</p>
        <div className="text-6xl mb-2">⭐</div>
        <p className="text-5xl font-bold text-amber-500">{totalStickers}</p>
        <p className="text-sm text-gray-400 mt-2">개</p>
      </div>

      <div className="mt-6 text-center text-gray-300">
        <p className="text-xs">보상 기능은 곧 추가될 예정이에요!</p>
      </div>
    </div>
  );
}
