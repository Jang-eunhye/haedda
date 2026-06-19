export const STICKER_STAR = '⭐' as const;

const SIZE_CLASS = {
  sm: 'text-sm',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
} as const;

type Size = keyof typeof SIZE_CLASS;

interface Props {
  className?: string;
  size?: Size;
}

export default function StickerStar({ className = '', size = 'md' }: Props) {
  return (
    <span className={`inline-block leading-none ${SIZE_CLASS[size]} ${className}`} aria-hidden>
      {STICKER_STAR}
    </span>
  );
}
