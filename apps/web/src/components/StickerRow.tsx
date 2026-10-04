import StickerStar from './StickerStar';

type Size = 'sm' | 'md' | 'lg' | 'xl';

interface Props {
  count: number;
  size?: Size;
  crossedOut?: boolean;
  className?: string;
  centered?: boolean;
}

export default function StickerRow({
  count,
  size = 'md',
  crossedOut = false,
  className = '',
  centered = false,
}: Props) {
  return (
    <div
      className={`flex flex-wrap items-center gap-0.5 max-w-full ${
        centered ? 'w-full justify-center' : 'w-fit'
      } ${className}`}
      aria-label={
        crossedOut ? `스티커 ${count}개, 기한 지남` : `스티커 ${count}개`
      }
    >
      {Array.from({ length: count }, (_, i) => (
        <StickerStar key={i} size={size} crossedOut={crossedOut} />
      ))}
    </div>
  );
}
