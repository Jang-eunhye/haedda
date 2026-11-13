'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useBackup } from '@haedda/hooks';
import { type BackupData, parseBackup } from '@haedda/domain';
import { getTodayISO } from '@haedda/utils';
import SettingsShell from './SettingsShell';
import DeleteConfirmModal from './DeleteConfirmModal';

const BUTTON_CLASS =
  'flex-1 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100';
const PRIMARY_BUTTON_CLASS = `${BUTTON_CLASS} bg-foreground text-white hover:bg-foreground/90`;
const SECONDARY_BUTTON_CLASS = `${BUTTON_CLASS} border border-border text-foreground hover:bg-background`;

function describe(data: { todos: number; rewards: number; totalStickers: number; categories: number }) {
  return `할일 ${data.todos}개, 보상 ${data.rewards}개, 스티커 ${data.totalStickers}개, 카테고리 ${data.categories}개`;
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="pt-6">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="text-xs text-muted mt-1 mb-3 leading-relaxed">{description}</p>
      {children}
    </section>
  );
}

export default function BackupSettingsPage() {
  const router = useRouter();
  const { exportBackup, restore, summary } = useBackup();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pasted, setPasted] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<BackupData | null>(null);
  const [restoring, setRestoring] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([exportBackup()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `haedda-backup-${getTodayISO()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportBackup());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('복사하지 못했어요. 파일로 저장을 이용해 주세요.');
    }
  };

  const check = (text: string) => {
    const result = parseBackup(text);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setPending(result.data);
  };

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    check(await file.text());
  };

  const handleConfirm = async () => {
    if (!pending || restoring) return;
    setRestoring(true);
    try {
      await restore(pending);
      router.replace('/');
    } catch {
      setRestoring(false);
      setPending(null);
      setError('불러오는 중에 문제가 생겼어요. 다시 시도해 주세요.');
    }
  };

  return (
    <SettingsShell title="데이터 백업" backHref="/settings">
      <p className="pt-4 text-sm text-foreground/80 leading-relaxed">
        해따의 데이터는 이 브라우저에만 저장돼요. 기기를 바꾸거나 앱으로 옮길 때 백업을 내보내서
        불러오세요.
      </p>
      <p className="mt-2 text-xs text-muted">지금 데이터: {describe(summary)}</p>

      <Section title="내보내기" description="파일로 저장하거나 복사해서 메모·메신저 등에 보관하세요.">
        <div className="flex gap-2.5">
          <button type="button" onClick={handleDownload} className={PRIMARY_BUTTON_CLASS}>
            파일로 저장
          </button>
          <button type="button" onClick={handleCopy} className={SECONDARY_BUTTON_CLASS}>
            {copied ? '복사했어요' : '복사하기'}
          </button>
        </div>
      </Section>

      <Section
        title="불러오기"
        description="백업 파일을 고르거나, 복사한 백업 내용을 붙여넣으세요. 지금 데이터는 백업 내용으로 바뀌어요."
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json,.txt"
          className="hidden"
          onChange={handleFile}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`${SECONDARY_BUTTON_CLASS} w-full`}
        >
          파일 선택
        </button>
        <textarea
          value={pasted}
          onChange={e => setPasted(e.target.value)}
          placeholder="백업 내용 붙여넣기"
          rows={4}
          className="mt-3 w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground font-mono resize-none focus:outline-none focus:border-foreground/30"
        />
        <button
          type="button"
          onClick={() => check(pasted)}
          disabled={!pasted.trim()}
          className={`${PRIMARY_BUTTON_CLASS} w-full mt-2`}
        >
          붙여넣은 내용 불러오기
        </button>
        {error && (
          <p role="alert" className="mt-3 text-xs text-danger">
            {error}
          </p>
        )}
      </Section>

      {pending && (
        <DeleteConfirmModal
          title="백업을 불러올까요?"
          content={`${describe({
            todos: pending.todos.length,
            rewards: pending.rewards.length,
            totalStickers: pending.totalStickers,
            categories: pending.categories.length,
          })}로 바뀌어요. 지금 데이터는 사라져요.`}
          confirmLabel="불러오기"
          onCancel={() => setPending(null)}
          onConfirm={handleConfirm}
        />
      )}
    </SettingsShell>
  );
}
