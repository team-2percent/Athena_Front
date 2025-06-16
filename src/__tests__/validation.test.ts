import { z } from 'zod';
import { 
  emailSchema, 
  passwordSchema, 
  newPasswordSchema,
  nicknameSchema,
  searchSchema,
  reviewContentSchema,
  loginSchema,
  signupSchema,
  passwordMatchSchema,
  sellerDescriptionSchema,
  linkUrlsSchema,
  profileUrlSchema,
  profileEditSchema,
  passwordEditSchema,
  accountHolderSchema,
  bankNameSchema,
  bankAccountSchema,
  accountAddSchema,
  addressSchema,
  addressDetailSchema,
  addressAddSchema,
  couponNameSchema,
  couponContentSchema,
  couponPriceSchema,
  couponStockSchema,
  couponPeriodSchema,
  couponExpireSchema,
  couponAddSchema
} from '../lib/validationSchemas';

describe('Validation Schemas', () => {
  describe('emailSchema', () => {
    it('빈 문자열은 에러를 반환해야 함', () => {
      const result = emailSchema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('잘못된 이메일 형식은 에러를 반환해야 함', () => {
      const result = emailSchema.safeParse('test');
      expect(result.success).toBe(false);
    });

    it('올바른 이메일 형식은 성공해야 함', () => {
      const result = emailSchema.safeParse('test@example.com');
      expect(result.success).toBe(true);
    });
  });

  describe('passwordSchema', () => {
    it('빈 문자열은 에러를 반환해야 함', () => {
      const result = passwordSchema.safeParse('');
      expect(result.success).toBe(false);
    });
  });

  describe('newPasswordSchema', () => {
    it('8자 미만은 에러를 반환해야 함', () => {
      const result = newPasswordSchema.safeParse('abc');
      expect(result.success).toBe(false);
    });

    it('대문자가 없으면 에러를 반환해야 함', () => {
      const result = newPasswordSchema.safeParse('abcdefgh');
      expect(result.success).toBe(false);
    });

    it('소문자가 없으면 에러를 반환해야 함', () => {
      const result = newPasswordSchema.safeParse('ABCDEFGH');
      expect(result.success).toBe(false);
    });

    it('숫자가 없으면 에러를 반환해야 함', () => {
      const result = newPasswordSchema.safeParse('Abcdefgh');
      expect(result.success).toBe(false);
    });

    it('특수문자가 없으면 에러를 반환해야 함', () => {
      const result = newPasswordSchema.safeParse('Abcdefg1');
      expect(result.success).toBe(false);
    });

    it('올바른 비밀번호는 성공해야 함', () => {
      const result = newPasswordSchema.safeParse('Abcdefg1!');
      expect(result.success).toBe(true);
    });
  });

  describe('nicknameSchema', () => {
    it('빈 문자열은 에러를 반환해야 함', () => {
      const result = nicknameSchema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('20자를 초과하면 에러를 반환해야 함', () => {
      const result = nicknameSchema.safeParse('a'.repeat(21));
      expect(result.success).toBe(false);
    });
  });

  describe('searchSchema', () => {
    it('빈 문자열은 에러를 반환해야 함', () => {
      const result = searchSchema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('50자를 초과하면 에러를 반환해야 함', () => {
      const result = searchSchema.safeParse('a'.repeat(51));
      expect(result.success).toBe(false);
    });
  });

  describe('reviewContentSchema', () => {
    it('10자 미만은 에러를 반환해야 함', () => {
      const result = reviewContentSchema.safeParse('좋아요');
      expect(result.success).toBe(false);
    });

    it('500자를 초과하면 에러를 반환해야 함', () => {
      const result = reviewContentSchema.safeParse('a'.repeat(501));
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('이메일이 빈 문자열이면 에러를 반환해야 함', () => {
      const result = loginSchema.safeParse({ email: '', password: 'Abcdefg1!' });
      expect(result.success).toBe(false);
    });

    it('비밀번호가 빈 문자열이면 에러를 반환해야 함', () => {
      const result = loginSchema.safeParse({ email: 'test@example.com', password: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('signupSchema', () => {
    it('모든 필드가 유효하면 성공해야 함', () => {
      const result = signupSchema.safeParse({
        nickname: 'testuser',
        email: 'test@example.com',
        password: 'Abcdefg1!',
        passwordConfirm: 'Abcdefg1!'
      });
      expect(result.success).toBe(true);
    });

    it('비밀번호가 일치하지 않으면 에러를 반환해야 함', () => {
      const result = signupSchema.safeParse({
        nickname: 'testuser',
        email: 'test@example.com',
        password: 'Abcdefg1!',
        passwordConfirm: 'different123!'
      });
      expect(result.success).toBe(false);
    });
  });

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
    });
  });

  describe('sellerDescriptionSchema', () => {
    it('500자를 초과하면 에러를 반환해야 함', () => {
      const result = sellerDescriptionSchema.safeParse('a'.repeat(501));
      expect(result.success).toBe(false);
    });
  });

  describe('linkUrlsSchema', () => {
    it('1000자를 초과하면 에러를 반환해야 함', () => {
      const result = linkUrlsSchema.safeParse('a'.repeat(1001));
      expect(result.success).toBe(false);
    });
  });

  describe('profileUrlSchema', () => {
    it('잘못된 URL 형식은 에러를 반환해야 함', () => {
      const result = profileUrlSchema.safeParse({ url: 'not-a-url' });
      expect(result.success).toBe(false);
    });
  });

  describe('profileEditSchema', () => {
    it('닉네임이 빈 문자열이면 에러를 반환해야 함', () => {
      const result = profileEditSchema.safeParse({
        nickname: '',
        sellerDescription: '설명',
        linkUrl: 'https://example.com'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('passwordEditSchema', () => {
    it('비밀번호 확인이 false면 에러를 반환해야 함', () => {
      const result = passwordEditSchema.safeParse({
        passwordConfirmed: false
      });
      expect(result.success).toBe(false);
    });
  });

  describe('accountHolderSchema', () => {
    it('빈 문자열은 에러를 반환해야 함', () => {
      const result = accountHolderSchema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('20자를 초과하면 에러를 반환해야 함', () => {
      const result = accountHolderSchema.safeParse('a'.repeat(21));
      expect(result.success).toBe(false);
    });
  });

  describe('bankNameSchema', () => {
    it('빈 문자열은 에러를 반환해야 함', () => {
      const result = bankNameSchema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('20자를 초과하면 에러를 반환해야 함', () => {
      const result = bankNameSchema.safeParse('a'.repeat(21));
      expect(result.success).toBe(false);
    });
  });

  describe('bankAccountSchema', () => {
    it('빈 문자열은 에러를 반환해야 함', () => {
      const result = bankAccountSchema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('숫자가 아닌 문자가 포함되면 에러를 반환해야 함', () => {
      const result = bankAccountSchema.safeParse('1234-5678');
      expect(result.success).toBe(false);
    });
  });

  describe('addressSchema', () => {
    it('빈 문자열은 에러를 반환해야 함', () => {
      const result = addressSchema.safeParse('');
      expect(result.success).toBe(false);
    });
  });

  describe('addressDetailSchema', () => {
    it('빈 문자열은 에러를 반환해야 함', () => {
      const result = addressDetailSchema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('50자를 초과하면 에러를 반환해야 함', () => {
      const result = addressDetailSchema.safeParse('a'.repeat(51));
      expect(result.success).toBe(false);
    });
  });

  describe('couponNameSchema', () => {
    it('빈 문자열은 에러를 반환해야 함', () => {
      const result = couponNameSchema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('25자를 초과하면 에러를 반환해야 함', () => {
      const result = couponNameSchema.safeParse('a'.repeat(26));
      expect(result.success).toBe(false);
    });
  });

  describe('couponContentSchema', () => {
    it('10자 미만은 에러를 반환해야 함', () => {
      const result = couponContentSchema.safeParse('a'.repeat(9));
      expect(result.success).toBe(false);
    });

    it('50자를 초과하면 에러를 반환해야 함', () => {
      const result = couponContentSchema.safeParse('a'.repeat(51));
      expect(result.success).toBe(false);
    });
  });

  describe('couponPriceSchema', () => {
    it('0원은 에러를 반환해야 함', () => {
      const result = couponPriceSchema.safeParse(0);
      expect(result.success).toBe(false);
    });

    it('10000000원을 초과하면 에러를 반환해야 함', () => {
      const result = couponPriceSchema.safeParse(10000001);
      expect(result.success).toBe(false);
    });
  });

  describe('couponStockSchema', () => {
    it('0개는 에러를 반환해야 함', () => {
      const result = couponStockSchema.safeParse(0);
      expect(result.success).toBe(false);
    });

    it('10000개를 초과하면 에러를 반환해야 함', () => {
      const result = couponStockSchema.safeParse(10001);
      expect(result.success).toBe(false);
    });
  });

  describe('couponPeriodSchema', () => {
    it('시작일이 없으면 에러를 반환해야 함', () => {
      const result = couponPeriodSchema.safeParse({ eventStart: null });
      expect(result.success).toBe(false);
    });

    it('종료일이 시작일보다 이전이면 에러를 반환해야 함', () => {
      const result = couponPeriodSchema.safeParse({
        eventStart: '2024-07-10',
        eventEnd: '2024-07-09'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('couponExpireSchema', () => {
    it('발급 종료일이 없으면 에러를 반환해야 함', () => {
      const result = couponExpireSchema.safeParse({ eventEnd: null });
      expect(result.success).toBe(false);
    });

    it('만료일이 발급 종료일보다 이전이면 에러를 반환해야 함', () => {
      const result = couponExpireSchema.safeParse({
        eventEnd: '2024-07-10',
        expire: '2024-07-09'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('couponAddSchema', () => {
    it('제목이 빈 문자열이면 에러를 반환해야 함', () => {
      const result = couponAddSchema.safeParse({
        title: '',
        content: '쿠폰 설명',
        price: 1000,
        period: { eventStart: '2024-07-01', eventEnd: '2024-07-31' },
        expire: { eventEnd: '2024-07-31', expire: '2024-08-31' },
        stock: 100
      });
      expect(result.success).toBe(false);
    });
  });
}); 