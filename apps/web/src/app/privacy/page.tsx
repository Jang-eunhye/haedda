import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import SettingsShell from '@/components/SettingsShell';

export const metadata: Metadata = {
  title: '개인정보처리방침 - 해따',
};

/** 문의 이메일. 정해지면 이 값만 바꾸면 된다 */
const CONTACT_EMAIL = '';
const EFFECTIVE_DATE = '2026년 11월 14일';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="pt-6">
      <h2 className="text-base font-bold text-foreground mb-2">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-foreground/80">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <SettingsShell title="개인정보처리방침" backHref="/settings">
      <article className="pb-8">
        <p className="pt-2 text-sm leading-relaxed text-foreground/80">
          해따(이하 &lsquo;서비스&rsquo;)는 웹과 안드로이드·iOS 앱으로 제공되는 할일 관리
          서비스입니다. 서비스는 이용자의 개인정보를 수집하지 않으며, 이 방침은 서비스가
          데이터를 어떻게 다루는지 설명합니다.
        </p>

        <Section title="1. 수집하는 개인정보">
          <p>
            서비스는 회원가입이나 로그인이 없으며, 이름·이메일·전화번호 등 이용자를 식별할 수
            있는 개인정보를 수집하지 않습니다.
          </p>
        </Section>

        <Section title="2. 기기에 저장되는 정보">
          <p>
            이용자가 입력한 할일, 메모, 마감일, 반복 설정, 카테고리, 보상, 스티커 개수는
            이용자의 기기 안(웹은 브라우저 저장소, 앱은 기기 내부 저장소)에만 저장됩니다.
          </p>
          <p>
            이 정보는 서비스 운영자의 서버로 전송되지 않으며, 운영자를 포함한 누구도 열람할 수
            없습니다.
          </p>
        </Section>

        <Section title="3. 제3자 제공 및 처리 위탁">
          <p>
            서비스는 이용자의 정보를 제3자에게 제공하거나 판매하지 않으며, 광고·분석 도구를
            사용하지 않습니다.
          </p>
          <p>
            웹 서비스는 Vercel을 통해 제공되며, 웹 접속 시 호스팅 업체가 서비스 운영을 위해 IP
            주소 등 접속 기록을 일시적으로 처리할 수 있습니다. 앱은 이러한 접속 기록을 남기지
            않습니다.
          </p>
        </Section>

        <Section title="4. 보관 기간 및 삭제">
          <p>
            기기에 저장된 정보는 이용자가 직접 삭제하거나, 앱을 삭제하거나, 브라우저의 사이트
            데이터를 지울 때 함께 삭제됩니다. 운영자는 별도로 보관하지 않습니다.
          </p>
        </Section>

        <Section title="5. 아동의 개인정보">
          <p>서비스는 어떤 이용자의 개인정보도 수집하지 않으며, 만 14세 미만 아동도 같습니다.</p>
        </Section>

        <Section title="6. 방침의 변경">
          <p>
            이 방침이 바뀌면 이 페이지에 변경 내용과 시행일을 알립니다.
          </p>
        </Section>

        <Section title="7. 문의">
          <p>
            개인정보와 관련한 문의는{' '}
            {CONTACT_EMAIL ? (
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent underline">
                {CONTACT_EMAIL}
              </a>
            ) : (
              '운영자'
            )}
            로 보내 주세요.
          </p>
        </Section>

        <p className="pt-8 text-xs text-muted">시행일: {EFFECTIVE_DATE}</p>
      </article>
    </SettingsShell>
  );
}
