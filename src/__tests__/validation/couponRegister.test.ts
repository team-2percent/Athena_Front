import { couponNameSchema, couponContentSchema, couponPriceSchema, couponStockSchema, couponPeriodSchema, couponExpireSchema, couponAddSchema } from "@/lib/validationSchemas";

describe('couponNameSchema', () => {
    it('빈 문자열은 에러를 반환해야 함', () => {
      const result = couponNameSchema.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('쿠폰 이름을 입력해주세요.');
      }
    });

    it('25자를 초과하면 에러를 반환해야 함', () => {
      const result = couponNameSchema.safeParse('a'.repeat(26));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('쿠폰 이름은 25자 이내로 입력해주세요.');
      }
    });

    it('25자 이내는 성공해야 함', () => {
      const result = couponNameSchema.safeParse('a'.repeat(25));
      expect(result.success).toBe(true);
    });
  });

  describe('couponContentSchema', () => {
    it('10자 미만은 에러를 반환해야 함', () => {
      const result = couponContentSchema.safeParse('a'.repeat(9));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('쿠폰 설명을 입력해주세요.');
      }
    });

    it('50자를 초과하면 에러를 반환해야 함', () => {
      const result = couponContentSchema.safeParse('a'.repeat(51));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('쿠폰 설명은 50자 이내로 입력해주세요.');
      }
    });

    it('50자 이내는 성공해야 함', () => {
      const result = couponContentSchema.safeParse('a'.repeat(50));
      expect(result.success).toBe(true);
    });
  });

  describe('couponPriceSchema', () => {
    it('1000원 미만은 에러를 반환해야 함', () => {
      const result = couponPriceSchema.safeParse(0);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('쿠폰 가격은 1000원 이상이어야 합니다.');
      }
    });

    it('50000원을 초과하면 에러를 반환해야 함', () => {
      const result = couponPriceSchema.safeParse(50001);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('쿠폰 가격은 50000원 이내로 입력해주세요.');
      }
    });

    it('50000원 이내는 성공해야 함', () => {
      const result = couponPriceSchema.safeParse(50000);
      expect(result.success).toBe(true);
    });
  });

  describe('couponStockSchema', () => {
    it('0개는 에러를 반환해야 함', () => {
      const result = couponStockSchema.safeParse(0);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('쿠폰 수량은 1개 이상이어야 합니다.');
      }
    });

    it('1000000개를 초과하면 에러를 반환해야 함', () => {
      const result = couponStockSchema.safeParse(1000001);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('쿠폰 수량은 1000000개 이내로 입력해주세요.');
      }
    });

    it('1000000개 이내는 성공해야 함', () => {
      const result = couponStockSchema.safeParse(1000000);
      expect(result.success).toBe(true);
    });
  });

  const now = new Date();
  const startAt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0);
  describe('couponPeriodSchema', () => {
    it('발급 기간이 1시간 미만이면 에러를 반환해야 함', () => {
      const result = couponPeriodSchema.safeParse({
        startAt: startAt,
        endAt: new Date(startAt.getTime() + 1000 * 60 * 30)
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('발급 기간은 최소 1시간 이상이어야 합니다.');
    });

    it('발급 기간이 1시간 이상이면 성공해야 함', () => {
      const result = couponPeriodSchema.safeParse({
        startAt: startAt,
        endAt: new Date(startAt.getTime() + 1000 * 60 * 60)
      });
      expect(result.success).toBe(true);
    });
  });

  describe('couponExpireSchema', () => {
    it('만료 시간이 발급 종료일로부터 24시간 미만이면 에러를 반환해야 함', () => {
      const result = couponExpireSchema.safeParse({
        endAt: new Date(startAt.getTime() + 1000 * 60 * 60),
        expireAt: new Date(startAt.getTime() + 1000 * 60 * 60 * 23)
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('만료 기간은 발급 종료일로부터 최소 24시간 이상이어야 합니다.');
    });

    it('만료 시간이 발급 종료일로부터 24시간 이상이면 성공해야 함', () => {
      const result = couponExpireSchema.safeParse({
        endAt: new Date(startAt.getTime() + 1000 * 60 * 60),
        expireAt: new Date(startAt.getTime() + 1000 * 60 * 60 * 25)
      });
      expect(result.success).toBe(true);
    });
  });

  describe('couponAddSchema', () => {
    it('제목이 빈 문자열이면 에러를 반환해야 함', () => {
      const result = couponAddSchema.safeParse({
        title: '',
        content: 'a'.repeat(10),
        price: 1000,
        period: {
        startAt: new Date(now.getTime() + 1000 * 60 * 60),
          endAt: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        },
        expire: {
          endAt: new Date(now.getTime() + 1000 * 60 * 60 * 24),
          expireAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2),
        },
        stock: 100
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('쿠폰 이름을 입력해주세요.');
      }
    });

    it('내용이 빈 문자열이면 에러를 반환해야 함', () => {
      const result = couponAddSchema.safeParse({
        title: '쿠폰 이름',
        content: '',
        price: 1000,
        period: {
          startAt: new Date(now.getTime() + 1000 * 60 * 60),
          endAt: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        },
        expire: {
          endAt: new Date(now.getTime() + 1000 * 60 * 60 * 24),
          expireAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2),
        },
        stock: 100
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('쿠폰 설명을 입력해주세요.');
      }
    });

    it('가격이 1000원 미만이면 에러를 반환해야 함', () => {
      const result = couponAddSchema.safeParse({
        title: '쿠폰 이름',
        content: 'a'.repeat(10),
        price: 0,
        period: {
          startAt: new Date(now.getTime() + 1000 * 60 * 60),
          endAt: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        },
        expire: {
          endAt: new Date(now.getTime() + 1000 * 60 * 60 * 24),
          expireAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2),
        },
        stock: 100
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('쿠폰 가격은 1000원 이상이어야 합니다.');
      }
    });

    it('재고가 0개이면 에러를 반환해야 함', () => {
      const result = couponAddSchema.safeParse({
        title: '쿠폰 이름',
        content: 'a'.repeat(10),
        price: 1000,
        period: {
          startAt: new Date(now.getTime() + 1000 * 60 * 60),
          endAt: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        },
        expire: {
          endAt: new Date(now.getTime() + 1000 * 60 * 60 * 24),
          expireAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2),
        },
        stock: 0
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('쿠폰 수량은 1개 이상이어야 합니다.');
      }
    });

    it('모든 필드가 유효하면 성공해야 함', () => {
      const result = couponAddSchema.safeParse({
        title: '쿠폰 이름입니다',
        content: 'a'.repeat(10),
        price: 10000,
        period: {
          startAt: new Date(now.getTime() + 1000 * 60 * 60),
          endAt: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        },
        expire: {
          endAt: new Date(now.getTime() + 1000 * 60 * 60 * 24),
          expireAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2),
        },
        stock: 10
      });
      expect(result.success).toBe(true);
    });
  });