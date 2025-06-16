import {
    validate,
    getValidatedString,
    getValidatedStringByte,
    getValidatedNumber,
    getValidatedDateHour,
    getValidatedDate
} from '../lib/validationUtil';
import { 
  formatDateInAdmin,
  getByteLength,
  formatNumberWithComma,
  parseNumberInput,
  removeLeadingZeros,
  limitNumber,
  formatDate
} from '../lib/utils';
import { emailSchema } from '../lib/validationSchemas';

describe('Utility Functions', () => {
  describe('validate', () => {
    it('잘못된 이메일 형식은 에러를 반환해야 함', () => {
      const result = validate('string', emailSchema);
      expect(result.error).toBe(true);
      expect(result.message).toBe('올바른 이메일 형식이 아닙니다.');
    });

    it('올바른 이메일 형식은 성공해야 함', () => {
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
      
      expect(getValidatedDateHour(date1, baseDate, 2)).toEqual(new Date('2025-06-16T12:00:00'));
      expect(getValidatedDateHour(date2, baseDate, 2)).toEqual(new Date('2025-06-16T12:00:00'));
    });
  });

  describe('getValidatedDate', () => {
    it('기준 날짜에서 일정 일자 이상으로 맞춘 날짜를 반환해야 함', () => {
      const baseDate = new Date('2025-06-15T00:00:00');
      const date1 = new Date('2025-06-16T00:00:00');
      const date2 = new Date('2025-06-20T00:00:00');
      
      expect(getValidatedDate(date1, baseDate, 3)).toEqual(new Date('2025-06-18T00:00:00'));
      expect(getValidatedDate(date2, baseDate, 3)).toEqual(new Date('2025-06-18T00:00:00'));
    });
  });

  describe('formatDateInAdmin', () => {
    it('날짜를 포매팅된 문자열로 반환해야 함', () => {
      expect(formatDateInAdmin('2025-06-15T10:30:00Z')).toBe('2025.06.15. 19:30');
    });
  });

  describe('getByteLength', () => {
    it('문자열의 Byte 길이를 반환해야 함', () => {
      expect(getByteLength('abc')).toBe(3);
      expect(getByteLength('한글')).toBe(6);
      expect(getByteLength('😊')).toBe(4);
    });
  });

  describe('formatNumberWithComma', () => {
    it('숫자를 콤마가 포함된 문자열로 반환해야 함', () => {
      expect(formatNumberWithComma('1234567890')).toBe('1,234,567,890');
      expect(formatNumberWithComma('abc')).toBe('abc');
    });
  });

  describe('parseNumberInput', () => {
    it('문자열에서 숫자만 반환해야 함', () => {
      expect(parseNumberInput('12a3b4c')).toBe('1234');
    });
  });

  describe('removeLeadingZeros', () => {
    it('문자열에서 앞의 0을 제거한 문자열을 반환해야 함', () => {
      expect(removeLeadingZeros('0123400')).toBe('123400');
    });
  });

  describe('limitNumber', () => {
    it('최댓값을 제한한 숫자를 반환해야 함', () => {
      expect(limitNumber(200, 150)).toBe(150);
    });
  });

  describe('formatDate', () => {
    it('날짜를 YYYY. MM. DD. 형식으로 포맷팅해야 함', () => {
      expect(formatDate(new Date('2025-06-15T00:00:00Z'))).toBe('2025. 06. 15.');
    });
  });
}); 