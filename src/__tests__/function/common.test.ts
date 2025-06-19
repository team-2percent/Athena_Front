import {
  formatDateInAdmin,
  getByteLength,
  formatNumberWithComma,
  parseNumberInput,
  removeLeadingZeros,
  limitNumber,
  formatDate
} from '@/lib/utils';

describe('유틸 함수 동작 테스트', () => {
  it('formatDateInAdmin: 날짜 포매팅', () => {
    expect(formatDateInAdmin('2025-06-15T10:30:00Z')).toBe('2025.06.15.19:30');
  });

  describe('getByteLength: 문자열 Byte 계산', () => {
    it('영문', () => {
      expect(getByteLength('abc')).toBe(3);
    });
    it('한글', () => {
      expect(getByteLength('한글')).toBe(6);
    });
    it('이모지', () => {
      expect(getByteLength('😊')).toBe(4);
    });
  });

  it('formatNumberWithComma: 숫자 포매팅', () => {
    expect(formatNumberWithComma('1234567890')).toBe('1,234,567,890');
    expect(formatNumberWithComma('abc')).toBe('abc');
  });

  it('parseNumberInput: 문자열에서 숫자만 반환', () => {
    expect(parseNumberInput('12a3b4c')).toBe('1234');
  });

  it('removeLeadingZeros: 앞의 0 제거', () => {
    expect(removeLeadingZeros('0123400')).toBe('123400');
  });

  it('limitNumber: 최댓값 제한', () => {
    expect(limitNumber(200, 150)).toBe(150);
  });

  it('formatDate: 날짜 YYYY. MM. DD. 포맷', () => {
    expect(formatDate(new Date('2025-06-15T00:00:00Z'))).toBe('2025. 06. 15.');
  });
}); 