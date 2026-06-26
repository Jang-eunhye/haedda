'use client';

import { useEffect, useState } from 'react';

const EMBEDDED_BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID ?? '';

export default function AppVersionGuard({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState(
    () => process.env.NODE_ENV === 'development'
  );

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') return;

    let cancelled = false;

    async function verify() {
      try {
        const res = await fetch(`/version.json?_=${Date.now()}`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('version fetch failed');

        const data = (await res.json()) as { buildId?: string };
        const serverBuildId = data.buildId ?? '';

        if (
          serverBuildId &&
          EMBEDDED_BUILD_ID &&
          serverBuildId !== EMBEDDED_BUILD_ID
        ) {
          window.location.reload();
          return;
        }
      } catch {
        // 네트워크 오류 시 캐시된 앱으로 진행 (오프라인)
      }

      if (!cancelled) setVerified(true);
    }

    verify();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!verified) {
    return (
      <div className="h-dvh flex items-center justify-center bg-background text-sm text-muted">
        업데이트 확인 중…
      </div>
    );
  }

  return children;
}
