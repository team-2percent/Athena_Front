import { loginSchema } from '../../lib/validationSchemas';

describe('loginSchema', () => {
    it('이메일이 빈 문자열이면 에러를 반환해야 함', () => {
      const result = loginSchema.safeParse({ email: '', password: 'Abcdefg1!' });
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('1자 이상 입력해주세요.');
    });

    it('이메일 형식 오류면 에러를 반환해야 함', () => {
        const result = loginSchema.safeParse({ email: 'test', password: 'Abcdefg1!' });
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('올바른 이메일 형식이 아닙니다.');
    });

    it('비밀번호가 빈 문자열이면 에러를 반환해야 함', () => {
        const result = loginSchema.safeParse({ email: 'test@example.com', password: '' });
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('비밀번호를 입력해주세요.');
    });

    it('모든 필드가 유효하면 성공해야 함', () => {
        const result = loginSchema.safeParse({ email: 'test@example.com', password: 'Abcdefg1!' });
        expect(result.success).toBe(true);
    });
});