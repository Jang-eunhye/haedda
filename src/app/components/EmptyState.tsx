interface Props {
  icon: string;
  tagline: string;
  title: string;
  description: string;
}

export default function EmptyState({ icon, tagline, title, description }: Props) {
  return (
    <div className="flex flex-col items-center text-center py-12 sm:py-16 px-2">
      <div className="w-[72px] h-[72px] rounded-3xl bg-gradient-to-b from-accent-soft to-background border border-accent-muted/50 flex items-center justify-center text-[2rem] leading-none mb-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        {icon}
      </div>
      <p className="text-sm text-muted leading-relaxed max-w-[280px]">{tagline}</p>
      <p className="text-base font-bold text-foreground mt-5">{title}</p>
      <p className="text-xs text-muted mt-2 max-w-[260px] leading-relaxed">{description}</p>
    </div>
  );
}
