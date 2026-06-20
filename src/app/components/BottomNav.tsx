import { MdCheckCircle, MdCheckCircleOutline, MdRedeem } from 'react-icons/md';
import { TabType } from '../types';

const TABS: {
  key: TabType;
  label: string;
  Icon: typeof MdCheckCircleOutline;
  ActiveIcon: typeof MdCheckCircle;
}[] = [
  {
    key: 'todo',
    label: '할일',
    Icon: MdCheckCircleOutline,
    ActiveIcon: MdCheckCircle,
  },
  {
    key: 'reward',
    label: '보상',
    Icon: MdRedeem,
    ActiveIcon: MdRedeem,
  },
];

interface Props {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

export default function BottomNav({ activeTab, onChange }: Props) {
  return (
    <nav
      className="shrink-0 border-t border-border bg-surface/95 backdrop-blur-md pb-[env(safe-area-inset-bottom,0px)]"
      aria-label="탭 메뉴"
    >
      <div className="flex h-14">
        {TABS.map(({ key, label, Icon, ActiveIcon }) => {
          const isActive = activeTab === key;
          const TabIcon = isActive ? ActiveIcon : Icon;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors active:scale-[0.97] ${
                isActive ? 'text-foreground' : 'text-muted hover:text-foreground/80'
              }`}
            >
              <TabIcon size={22} aria-hidden />
              <span className={`text-[11px] leading-none ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
