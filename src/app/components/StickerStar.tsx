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
  crossedOut?: boolean;
}

export default function StickerStar({ className = '', size = 'md', crossedOut = false }: Props) {
  return (
    <span
      className={`inline-block leading-none relative ${SIZE_CLASS[size]} ${className}`}
      aria-hidden
    >
      <span className={crossedOut ? 'opacity-40' : undefined}>{STICKER_STAR}</span>
      {crossedOut && (
        <span
          className="pointer-events-none absolute top-1/2 h-0.5 -translate-y-1/2 bg-foreground/45 left-[calc(var(--sticker-gap,0.125rem)/-2)] right-[calc(var(--sticker-gap,0.125rem)/-2)]"
          aria-hidden
        />
      )}
    </span>
  );
}
