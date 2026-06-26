const LOGO_ASPECT = 247 / 184;

type Props = {
  className?: string;
  height?: number;
};

export default function HaeddaLogo({ className = '', height = 28 }: Props) {
  const width = Math.round(height * LOGO_ASPECT);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/HAEDDA.svg"
      alt="해따"
      width={width}
      height={height}
      className={className}
      draggable={false}
    />
  );
}
