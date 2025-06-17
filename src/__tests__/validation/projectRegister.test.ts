import { stepOneSchema, stepThreeSchema } from '@/lib/validationSchemas';
import { VALIDATION_MESSAGES } from '@/lib/validationMessages';

// TODO: 실제 프로젝트 등록 validation 스키마/함수 import 예정

describe('프로젝트 등록 1단계 입력값 검증', () => {
  const baseValid = {
    categoryId: 1,
    title: '정상 제목',
    description: '정상 설명입니다.',
    images: [1],
    targetAmount: '1000',
    startDate: new Date('2024-07-10'),
    endDate: new Date('2024-07-20'),
    deliveryDate: new Date('2024-07-28'),
  };

  it('카테고리 미선택 시 에러 메시지', () => {
    const input = { ...baseValid, categoryId: 0 };
    const result = stepOneSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === VALIDATION_MESSAGES.REQUIRED_CATEGORY)).toBe(true);
  });

  it('프로젝트 제목 미입력 시 에러 메시지', () => {
    const input = { ...baseValid, title: '' };
    const result = stepOneSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === VALIDATION_MESSAGES.REQUIRED_TITLE)).toBe(true);
  });

  it('프로젝트 제목 25자 초과 시 에러 메시지', () => {
    const input = { ...baseValid, title: 'a'.repeat(26) };
    const result = stepOneSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === VALIDATION_MESSAGES.TITLE_MAX)).toBe(true);
  });

  it('프로젝트 설명 미입력 시 에러 메시지', () => {
    const input = { ...baseValid, description: '' };
    const result = stepOneSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === VALIDATION_MESSAGES.DESCRIPTION_MIN)).toBe(true);
  });

  it('프로젝트 설명 10자 미만 시 에러 메시지', () => {
    const input = { ...baseValid, description: '짧음' };
    const result = stepOneSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === VALIDATION_MESSAGES.DESCRIPTION_MIN)).toBe(true);
  });

  it('프로젝트 설명 50자 초과 시 에러 메시지', () => {
    const input = { ...baseValid, description: 'a'.repeat(51) };
    const result = stepOneSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === VALIDATION_MESSAGES.DESCRIPTION_MAX)).toBe(true);
  });

  it('대표 이미지 미등록 시 에러 메시지', () => {
    const input = { ...baseValid, images: [] };
    const result = stepOneSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === VALIDATION_MESSAGES.REQUIRED_IMAGE)).toBe(true);
  });

  it('대표 이미지 5개 초과 시 에러 메시지', () => {
    const input = { ...baseValid, images: [1,2,3,4,5,6] };
    const result = stepOneSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === VALIDATION_MESSAGES.IMAGE_MAX)).toBe(true);
  });

  it('목표 금액 미입력 시 에러 메시지', () => {
    const input = { ...baseValid, targetAmount: '' };
    const result = stepOneSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === VALIDATION_MESSAGES.REQUIRED_TARGET_AMOUNT)).toBe(true);
  });

  it('목표 금액 10억원 초과 시 에러 메시지', () => {
    const input = { ...baseValid, targetAmount: '2000000000' };
    const result = stepOneSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === VALIDATION_MESSAGES.TARGET_AMOUNT_MAX)).toBe(true);
  });

  it('목표 금액 숫자 아님 시 에러 메시지', () => {
    const input = { ...baseValid, targetAmount: 'abc' };
    const result = stepOneSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === VALIDATION_MESSAGES.TARGET_AMOUNT_INVALID)).toBe(true);
  });

  it('펀딩 시작일 미입력 시 에러 메시지', () => {
    const input = { ...baseValid, startDate: null };
    const result = stepOneSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === "펀딩 시작일은 오늘부터 일주일 뒤부터 선택 가능합니다.")).toBe(true);
  });

  it('펀딩 종료일 미입력 시 에러 메시지', () => {
    const input = { ...baseValid, endDate: null };
    const result = stepOneSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === '펀딩 종료일을 선택해주세요.')).toBe(true);
  });

  it('펀딩 종료일이 시작일보다 빠를 때 에러 메시지', () => {
    const input = { ...baseValid, startDate: new Date('2024-07-10'), endDate: new Date('2024-07-05') };
    const result = stepOneSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === '펀딩 종료일은 시작일과 같거나 이후여야 합니다.')).toBe(true);
  });

  it('배송 예정일 미입력 시 에러 메시지', () => {
    const input = { ...baseValid, deliveryDate: null };
    const result = stepOneSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === '배송 예정일을 선택해주세요.')).toBe(true);
  });

  it('배송 예정일이 펀딩 종료일+7일 이전일 때 에러 메시지', () => {
    const input = { ...baseValid, endDate: new Date('2024-07-20'), deliveryDate: new Date('2024-07-25') };
    const result = stepOneSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === '배송 예정일은 펀딩 종료일로부터 일주일 뒤부터 선택 가능합니다.')).toBe(true);
  });
});

describe('프로젝트 등록 3단계 입력값 검증', () => {
  const baseValid = {
    supportOptions: [
      {
        id: 1,
        name: '후원 상품',
        description: '후원 상품 설명',
        price: '10000',
        stock: '10',
        composition: [
          { id: 1, content: '구성 항목' },
        ],
      },
    ],
    platformPlan: 'BASIC',
    bankAccountId: 1,
  };

  it('후원 상품 미입력 시 에러 메시지', () => {
    const input = { ...baseValid, supportOptions: [] };
    const result = stepThreeSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === '후원 상품을 최소 1개 이상 추가해주세요.')).toBe(true);
  });

  it('후원 상품 이름 미입력 시 에러 메시지', () => {
    const input = { ...baseValid, supportOptions: [{ ...baseValid.supportOptions[0], name: '' }] };
    const result = stepThreeSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === VALIDATION_MESSAGES.REQUIRED_SUPPORT_NAME)).toBe(true);
  });

  it('후원 상품 이름 25자 초과 시 에러 메시지', () => {
    const input = { ...baseValid, supportOptions: [{ ...baseValid.supportOptions[0], name: 'a'.repeat(26) }] };
    const result = stepThreeSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === VALIDATION_MESSAGES.SUPPORT_NAME_MAX)).toBe(true);
  });

  it('후원 상품 설명 50자 초과 시 에러 메시지', () => {
    const input = { ...baseValid, supportOptions: [{ ...baseValid.supportOptions[0], description: 'a'.repeat(51) }] };
    const result = stepThreeSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === VALIDATION_MESSAGES.SUPPORT_DESC_MAX)).toBe(true);
  });

  it('후원 상품 가격 미입력 시 에러 메시지', () => {
    const input = { ...baseValid, supportOptions: [{ ...baseValid.supportOptions[0], price: '' }] };
    const result = stepThreeSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === VALIDATION_MESSAGES.REQUIRED_SUPPORT_PRICE)).toBe(true);
  });

  it('후원 상품 가격 숫자 아님 시 에러 메시지', () => {
    const input = { ...baseValid, supportOptions: [{ ...baseValid.supportOptions[0], price: 'abc' }] };
    const result = stepThreeSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === VALIDATION_MESSAGES.SUPPORT_PRICE_INVALID)).toBe(true);
  });

  it('후원 상품 가격 10억원 초과 시 에러 메시지', () => {
    const input = { ...baseValid, supportOptions: [{ ...baseValid.supportOptions[0], price: '2000000000' }] };
    const result = stepThreeSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === VALIDATION_MESSAGES.SUPPORT_PRICE_MAX)).toBe(true);
  });

  it('후원 상품 수량 미입력 시 에러 메시지', () => {
    const input = { ...baseValid, supportOptions: [{ ...baseValid.supportOptions[0], stock: '' }] };
    const result = stepThreeSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === '후원 상품 수량을 입력해주세요.')).toBe(true);
  });

  it('후원 상품 수량 1 미만 시 에러 메시지', () => {
    const input = { ...baseValid, supportOptions: [{ ...baseValid.supportOptions[0], stock: '0' }] };
    const result = stepThreeSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === '후원 상품 수량은 1개 이상이어야 합니다.')).toBe(true);
  });

  it('후원 상품 수량 1만 초과 시 에러 메시지', () => {
    const input = { ...baseValid, supportOptions: [{ ...baseValid.supportOptions[0], stock: '10001' }] };
    const result = stepThreeSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === '후원 상품 수량은 1만 개 이하로 설정해주세요.')).toBe(true);
  });

  it('구성 항목 100자 초과 시 에러 메시지', () => {
    const input = { ...baseValid, supportOptions: [{ ...baseValid.supportOptions[0], composition: [{ id: 1, content: 'a'.repeat(101) }] }] };
    const result = stepThreeSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === '구성 항목은 100자 이하로 입력해주세요.')).toBe(true);
  });

  it('후원 플랜 미선택 시 에러 메시지', () => {
    const input = { ...baseValid, platformPlan: undefined };
    const result = stepThreeSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === '후원 플랜을 선택해주세요.')).toBe(true);
  });

  it('후원 받을 계좌 미선택 시 에러 메시지', () => {
    const input = { ...baseValid, bankAccountId: 0 };
    const result = stepThreeSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.errors.some(e => e.message === '후원 받을 계좌를 선택해주세요.')).toBe(true);
  });
}); 