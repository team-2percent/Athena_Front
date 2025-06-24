import { emailSchema } from "@/lib/validationSchemas";
import { validate, getValidatedString, getValidatedStringByte, getValidatedNumber, getValidatedDateHour, getValidatedDate } from "@/lib/validationUtil";

describe('validate', () => {
    it('스키마에 잘못된 값이 들어갈 때 에러와 에러메시지를 반환해야 함', () => {
      const result = validate('string', emailSchema);
      expect(result.error).toBe(true);
      expect(result.message).toBe('올바른 이메일 형식이 아닙니다.');
    });

    it('스키마에 올바른 값이 들어갈 때 빈 에러와 빈 에러메시지를 반환해야 함', () => {
      const result = validate('admin@example.com', emailSchema);
      expect(result.error).toBe(false);
      expect(result.message).toBe('');
    });
});

describe('getValidatedString', () => {
    it('제한 길이만큼 자른 문자열을 반환해야 함', () => {
      expect(getValidatedString('안녕하세요.', 2)).toBe('안녕');
      expect(getValidatedString('안녕하세요.', 10)).toBe('안녕하세요.');
    });
});

describe('getValidatedStringByte', () => {
    it('제한 Byte만큼 자른 문자열을 반환해야 함', () => {
      expect(getValidatedStringByte('abc', 3)).toBe('abc');
      expect(getValidatedStringByte('가나다', 6)).toBe('가나');
      expect(getValidatedStringByte('가나다', 7)).toBe('가나');
    });
});

describe('getValidatedNumber', () => {
    it('제한 숫자 이하로 맞춘 값을 반환해야 함', () => {
      expect(getValidatedNumber(10000, 9000)).toBe(9000);
      expect(getValidatedNumber(10000, 11000)).toBe(10000);
    });
});

describe('getValidatedDateHour', () => {
    it('기준 날짜에서 일정 시간 이상으로 맞춘 날짜를 반환해야 함', () => {
      const baseDate = new Date('2025-06-16T09:00:00');
      const date1 = new Date('2025-06-16T10:00:00');
      const date2 = new Date('2025-06-16T12:00:00');
      
      expect(getValidatedDateHour(date1, baseDate, 2)).toEqual(new Date('2025-06-16T11:00:00'));
      expect(getValidatedDateHour(date2, baseDate, 2)).toEqual(new Date('2025-06-16T12:00:00'));
    });
});

describe('getValidatedDate', () => {
    it('기준 날짜에서 일정 일자 이상으로 맞춘 날짜를 반환해야 함', () => {
      const baseDate = new Date('2025-06-15T00:00:00');
      const date1 = new Date('2025-06-16T00:00:00');
      const date2 = new Date('2025-06-20T00:00:00');
      
      expect(getValidatedDate(date1, baseDate, 3)).toEqual(new Date('2025-06-18T00:00:00'));
      expect(getValidatedDate(date2, baseDate, 3)).toEqual(new Date('2025-06-20T00:00:00'));
    });
});