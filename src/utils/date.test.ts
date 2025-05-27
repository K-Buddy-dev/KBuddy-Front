import { formatDate, formatRelativeDate } from './date';

describe('formatDate', () => {
  it('"2025-05-27T10:50:50.183962" 문자열을 넘기면 "05/27/2025"가 출력된다', () => {
    const result = formatDate('2025-05-27T10:50:50.183962');
    expect(result).toEqual('05/27/2025');
  });
});

describe('formatRelativeDate', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-05-27T09:00:00'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('3초 전 날짜를 인자로 넘기면 "3s ago"를 출력한다', () => {
    const result = formatRelativeDate('2025-05-27T08:59:57.000000', '2025-05-27T08:59:57.000000');
    expect(result).toBe('3s ago');
  });

  it('30분 전 날짜를 인자로 넘기면 "30m ago"를 출력한다', () => {
    const result = formatRelativeDate('2025-05-27T08:30:00.000000', '2025-05-27T08:30:00.000000');
    expect(result).toBe('30m ago');
  });

  it('3시간 전 날짜를 인자로 넘기면 "3h ago"를 출력한다', () => {
    const result = formatRelativeDate('2025-05-27T06:00:00.000000', '2025-05-27T06:00:00.000000');
    expect(result).toBe('3h ago');
  });

  it('3일 전 날짜를 인자로 넘기면 "3d ago"를 출력한다', () => {
    const result = formatRelativeDate('2025-05-24T09:00:00.000000', '2025-05-24T09:00:00.000000');
    expect(result).toBe('3d ago');
  });

  it('생성일과 수정일 중 더 최신 날짜를 기준으로 결과가 출력된다.', () => {
    const createdAt = '2025-05-24T09:00:00.000000';
    const modifiedAt = '2025-05-27T08:59:57.000000';
    const result = formatRelativeDate(createdAt, modifiedAt);
    expect(result).toBe('3s ago');
  });
});
