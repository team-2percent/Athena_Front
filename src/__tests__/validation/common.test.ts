import { imageSchema, emailSchema, passwordSchema, newPasswordSchema, nicknameSchema, searchSchema, reviewContentSchema } from '@/lib/validationSchemas';

// File 객체 mock을 위한 헬퍼
function createFile(name: string, type: string, size: number) {
  const file = new File([''], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

describe('공통 입력값 검증 스키마', () => {
  describe('imageSchema', () => {
    it('이미지 타입이 아닌 경우 에러', () => {
      const file = createFile('test.txt', 'text/plain', 1000);
      const result = imageSchema.safeParse(file);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('jpg, jpeg, png, webp 형식의 이미지만 업로드 가능합니다.');
    });
    it('이미지 크기 초과 시 에러', () => {
      const file = createFile('test.jpg', 'image/jpeg', 11 * 1024 * 1024);
      const result = imageSchema.safeParse(file);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('이미지 크기는 10MB 이하여야 합니다.');
    });
  });

  describe('emailSchema', () => {
    it('빈 문자열 에러', () => {
      const result = emailSchema.safeParse('');
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('1자 이상 입력해주세요.');
    });
    it('51자 초과 에러', () => {
      const input = 'a'.repeat(51) + '@a.com';
      const result = emailSchema.safeParse(input);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('50자 이내로 입력해주세요.');
    });
    it('이메일 형식 아님 에러', () => {
      const result = emailSchema.safeParse('test');
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('올바른 이메일 형식이 아닙니다.');
    });
  });

  describe('passwordSchema', () => {
    it('빈 문자열 에러', () => {
      const result = passwordSchema.safeParse('');
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('비밀번호를 입력해주세요.');
    });
  });

  describe('newPasswordSchema', () => {
    it('8자 미만 에러', () => {
      const result = newPasswordSchema.safeParse('abc');
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('8자 이상 입력해주세요.');
    });
    it('대문자 미포함 에러', () => {
      const result = newPasswordSchema.safeParse('abcdefgh');
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('대문자를 포함해주세요.');
    });
    it('소문자 미포함 에러', () => {
      const result = newPasswordSchema.safeParse('ABCDEFGH');
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('소문자를 포함해주세요.');
    });
    it('숫자 미포함 에러', () => {
      const result = newPasswordSchema.safeParse('Abcdefgh');
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('숫자를 포함해주세요.');
    });
    it('특수문자 미포함 에러', () => {
      const result = newPasswordSchema.safeParse('Abcdefg1');
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('특수문자를 포함해주세요.');
    });
    it('정상 비밀번호 성공', () => {
      const result = newPasswordSchema.safeParse('Abcdefg1!');
      expect(result.success).toBe(true);
    });
  });

  describe('nicknameSchema', () => {
    it('빈 문자열 에러', () => {
      const result = nicknameSchema.safeParse('');
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('닉네임을 입력해주세요.');
    });
    it('50자 초과 에러', () => {
      const result = nicknameSchema.safeParse('a'.repeat(51));
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('닉네임은 50자 이내로 입력해주세요.');
    });
  });

  describe('searchSchema', () => {
    it('빈 문자열 에러', () => {
      const result = searchSchema.safeParse('');
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('검색어를 입력해주세요.');
    });
    it('50자 초과 에러', () => {
      const result = searchSchema.safeParse('a'.repeat(21));
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('검색어는 20자 이내로 입력해주세요.');
    });
  });

  describe('reviewContentSchema', () => {
    it('10자 미만 에러', () => {
      const result = reviewContentSchema.safeParse('');
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('후기를 입력해주세요.');
    });
    it('500자 초과 에러', () => {
      const result = reviewContentSchema.safeParse('a'.repeat(1001));
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('후기는 1000자 이내로 입력해주세요.');
    });
  });
}); 