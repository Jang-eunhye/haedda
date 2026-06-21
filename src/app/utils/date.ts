/** deadline을 YYYY-MM-DD 형식으로 정규화 */
export function normalizeDeadline(deadline: string): string {
  return deadline.slice(0, 10);
}

export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTodayISO(): string {
  return formatDateISO(new Date());
}

export function getTomorrowISO(ref: Date = new Date()): string {
  const next = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  next.setDate(next.getDate() + 1);
  return formatDateISO(next);
}

export function getWeekEndISO(ref: Date = new Date()): string {
  return getWeekRangeISO(ref).end;
}

export function getMonthEndISO(ref: Date = new Date()): string {
  const year = ref.getFullYear();
  const month = ref.getMonth() + 1;
  const lastDay = getDaysInMonth(year, month);
  return formatDateISO(new Date(year, month - 1, lastDay));
}

export function formatDeadlineDisplay(deadline?: string): string {
  if (!deadline) return '나중에';
  return formatDeadlineLabel(deadline);
}

/** 기한 당일까지 유효, 다음 날부터 만료. 기한 없음은 만료되지 않음 */
export function isDeadlineExpired(deadline?: string): boolean {
  if (!deadline) return false;
  return getTodayISO() > normalizeDeadline(deadline);
}

export function formatDeadlineCountdown(deadline?: string): string | null {
  if (!deadline) return null;
  const normalized = normalizeDeadline(deadline);
  const today = getTodayISO();
  if (today > normalized) return null;

  const [y, m, d] = normalized.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((target.getTime() - todayStart.getTime()) / 86_400_000);
  return `D-${diff}`;
}

export function formatDeadlineLabel(deadline: string): string {
  const [y, m, d] = normalizeDeadline(deadline).split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function parseDateParts(iso: string): { year: number; month: number; day: number } {
  const normalized = normalizeDeadline(iso);
  const [year, month, day] = normalized.split('-').map(Number);
  return { year, month, day };
}

/** 월요일~일요일 (오늘 포함) */
export function getWeekRangeISO(ref: Date = new Date()): { start: string; end: string } {
  const monday = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  const day = monday.getDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  monday.setDate(monday.getDate() - daysSinceMonday);
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  return { start: formatDateISO(monday), end: formatDateISO(sunday) };
}

export function isDeadlineInRange(deadline: string | undefined, start: string, end: string): boolean {
  if (!deadline) return false;
  const d = normalizeDeadline(deadline);
  return d >= start && d <= end;
}

export function isDeadlineToday(deadline?: string): boolean {
  if (!deadline) return false;
  return normalizeDeadline(deadline) === getTodayISO();
}

export function isDeadlineTomorrow(deadline: string | undefined, ref: Date = new Date()): boolean {
  if (!deadline) return false;
  return normalizeDeadline(deadline) === getTomorrowISO(ref);
}

export function isDeadlineThisMonth(deadline: string | undefined, ref: Date = new Date()): boolean {
  if (!deadline) return false;
  const { year, month } = parseDateParts(deadline);
  return year === ref.getFullYear() && month === ref.getMonth() + 1;
}
