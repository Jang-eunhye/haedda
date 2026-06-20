import { MdAdd } from 'react-icons/md';

interface Props {
  onClick: () => void;
  label?: string;
}

export default function Fab({ onClick, label = '추가' }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="fixed bottom-6 z-40 w-14 h-14 rounded-full bg-foreground text-white shadow-[0_4px_20px_rgba(0,0,0,0.18)] flex items-center justify-center hover:bg-foreground/90 active:scale-95 transition-all duration-150 right-[max(1.5rem,calc(50%-16rem+1.5rem))] sm:bottom-8"
    >
      <MdAdd size={24} aria-hidden />
    </button>
  );
}
