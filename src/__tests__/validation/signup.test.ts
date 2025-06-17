import { signupSchema, passwordMatchSchema } from '../../lib/validationSchemas';

describe('passwordMatchSchema', () => {
    it('비밀번호가 일치하면 성공해야 함', () => {
      const result = passwordMatchSchema.safeParse({
        password: 'abcd1234!',
        passwordConfirm: 'abcd1234!'
      });
      expect(result.success).toBe(true);
    });

    it('비밀번호가 일치하지 않으면 에러를 반환해야 함', () => {
      const result = passwordMatchSchema.safeParse({
        password: 'abcd1234!',
        passwordConfirm: 'different123!'
      });
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('비밀번호가 일치하지 않습니다.');
    });
});

describe('signupSchema', () => {
    it('모든 필드가 유효하면 성공해야 함', () => {
      const result = signupSchema.safeParse({
        nickname: 'testuser',
        email: 'test@example.com',
        password: 'Abcdefg1!',
        passwordConfirm: 'Abcdefg1!',
        passwordMatch: {
          password: 'Abcdefg1!',
          passwordConfirm: 'Abcdefg1!'
        }
      });
      expect(result.success).toBe(true);
    });

    it('닉네임을 입력하지 않으면 에러를 반환해야 함', () => {
      const result = signupSchema.safeParse({
        nickname: '',
        email: 'test@example.com',
        password: 'Abcdefg1!',
        passwordConfirm: 'Abcdefg1!'
      });
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('닉네임을 입력해주세요.');
    });

    it('이메일을 입력하지 않으면 에러를 반환해야 함', () => {
      const result = signupSchema.safeParse({
        nickname: 'testuser',
        email: '',
        password: 'Abcdefg1!',
        passwordConfirm: 'Abcdefg1!'
      });
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('1자 이상 입력해주세요.');
    });

    it('이메일 형식 오류면 에러를 반환해야 함', () => {
      const result = signupSchema.safeParse({
        nickname: 'testuser',
        email: 'test',
        password: 'Abcdefg1!',
        passwordConfirm: 'Abcdefg1!'
      });
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('올바른 이메일 형식이 아닙니다.');
    });

    it('비밀번호를 입력하지 않으면 에러를 반환해야 함', () => {
      const result = signupSchema.safeParse({
        nickname: 'testuser',
        email: 'test@example.com',
        password: '',
        passwordConfirm: 'Abcdefg1!'
      });
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('8자 이상 입력해주세요.');
    });

    it('비밀번호를 입력하지 않으면 에러를 반환해야 함', () => {
        const result = signupSchema.safeParse({
          nickname: 'testuser',
          email: 'test@example.com',
          password: 'abc',
          passwordConfirm: 'Abcdefg1!'
        });
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('8자 이상 입력해주세요.');
      });

    it('비밀번호 형식 오류면 에러를 반환해야 함(대문자 미포함)', () => {
      const result = signupSchema.safeParse({
        nickname: 'testuser',
        email: 'test@example.com',
        password: 'abc1234!',
        passwordConfirm: 'abc1234!'
      });
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('대문자를 포함해주세요.');
    });

    it('비밀번호 형식 오류면 에러를 반환해야 함(소문자 미포함)', () => {
      const result = signupSchema.safeParse({
        nickname: 'testuser',
        email: 'test@example.com',
        password: 'ABC1234!',
        passwordConfirm: 'ABC1234!'
      });
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('소문자를 포함해주세요.');
    });

    it('비밀번호 형식 오류면 에러를 반환해야 함(숫자 미포함)', () => {
      const result = signupSchema.safeParse({
        nickname: 'testuser',
        email: 'test@example.com',
        password: 'Abcdefg!',
        passwordConfirm: 'Abcdefg!'
      });
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('숫자를 포함해주세요.');
    });

    it('비밀번호 형식 오류면 에러를 반환해야 함(특수문자 미포함)', () => {
      const result = signupSchema.safeParse({
        nickname: 'testuser',
        email: 'test@example.com',
        password: 'Abcdefg1',
        passwordConfirm: 'Abcdefg1'
      });
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('특수문자를 포함해주세요.');
    });

    it('비밀번호가 일치하지 않으면 에러를 반환해야 함', () => {
      const result = signupSchema.safeParse({
        nickname: 'testuser',
        email: 'test@example.com',
        password: 'Abcdefg1!',
        passwordConfirm: 'different123!',
        passwordMatch: {
          password: 'Abcdefg1!',
          passwordConfirm: 'different123!'
        }
      });
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('비밀번호가 일치하지 않습니다.');
    });
});