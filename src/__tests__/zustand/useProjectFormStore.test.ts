import { useProjectFormStore } from '@/stores/useProjectFormStore';

describe('useProjectFormStore 상태 및 액션 테스트', () => {
  beforeEach(() => {
    useProjectFormStore.getState().resetForm();
  });

  it('setCurrentStep: 현재 단계 설정', () => {
    useProjectFormStore.getState().setCurrentStep(2);
    expect(useProjectFormStore.getState().currentStep).toBe(2);
  });

  it('updateFormData: projectId, currentStep, targetAmount 등 단일 필드 업데이트', () => {
    useProjectFormStore.getState().updateFormData({ projectId: 1 });
    expect(useProjectFormStore.getState().projectId).toBe(1);
    useProjectFormStore.getState().updateFormData({ currentStep: 2 });
    expect(useProjectFormStore.getState().currentStep).toBe(2);
    useProjectFormStore.getState().updateFormData({ targetAmount: '1000000000' });
    expect(useProjectFormStore.getState().targetAmount).toBe('1000000000');
  });

  it('updateFormData: category, categoryId, title, description 등 텍스트/숫자 필드', () => {
    useProjectFormStore.getState().updateFormData({ category: '디지털' });
    expect(useProjectFormStore.getState().category).toBe('디지털');
    useProjectFormStore.getState().updateFormData({ categoryId: 5 });
    expect(useProjectFormStore.getState().categoryId).toBe(5);
    useProjectFormStore.getState().updateFormData({ title: '멋진 프로젝트' });
    expect(useProjectFormStore.getState().title).toBe('멋진 프로젝트');
    useProjectFormStore.getState().updateFormData({ description: '상세 설명' });
    expect(useProjectFormStore.getState().description).toBe('상세 설명');
  });

  it('updateFormData: 날짜, 이미지, 마크다운 등 객체/배열 필드', () => {
    const now = new Date();
    useProjectFormStore.getState().updateFormData({ startDate: now });
    expect(useProjectFormStore.getState().startDate).toEqual(now);
    useProjectFormStore.getState().updateFormData({ endDate: now });
    expect(useProjectFormStore.getState().endDate).toEqual(now);
    useProjectFormStore.getState().updateFormData({ deliveryDate: now });
    expect(useProjectFormStore.getState().deliveryDate).toEqual(now);
    const imageMock = { id: 'img1', preview: 'preview1' };
    const imageMock2 = { id: 'img2', preview: 'preview2' };
    useProjectFormStore.getState().updateFormData({ images: [imageMock, imageMock2] });
    expect(useProjectFormStore.getState().images).toEqual([imageMock, imageMock2]);
    useProjectFormStore.getState().updateFormData({ markdown: '# 소개' });
    expect(useProjectFormStore.getState().markdown).toBe('# 소개');
    useProjectFormStore.getState().updateFormData({ markdownImages: [] });
    expect(useProjectFormStore.getState().markdownImages).toEqual([]);
    useProjectFormStore.getState().updateFormData({ supportOptions: [] });
    expect(useProjectFormStore.getState().supportOptions).toEqual([]);
  });

  it('updateFormData: platformPlan, bankAccountId 등 기타 필드', () => {
    useProjectFormStore.getState().updateFormData({ platformPlan: 'BASIC' });
    expect(useProjectFormStore.getState().platformPlan).toBe('BASIC');
    useProjectFormStore.getState().updateFormData({ bankAccountId: 123 });
    expect(useProjectFormStore.getState().bankAccountId).toBe(123);
    useProjectFormStore.getState().updateFormData({ validationErrors: {} });
    expect(useProjectFormStore.getState().validationErrors).toEqual({});
    useProjectFormStore.getState().updateFormData({ isLoading: true });
    expect(useProjectFormStore.getState().isLoading).toBe(true);
    useProjectFormStore.getState().updateFormData({ isSubmitting: true });
    expect(useProjectFormStore.getState().isSubmitting).toBe(true);
    useProjectFormStore.getState().updateFormData({ error: '에러 발생' });
    expect(useProjectFormStore.getState().error).toBe('에러 발생');
  });

  it('resetForm: 폼 초기화', () => {
    useProjectFormStore.getState().updateFormData({
      projectId: 1,
      currentStep: 2,
      targetAmount: '100',
      category: '디지털',
      categoryId: 5,
      title: '테스트',
      description: '테스트 설명',
      startDate: new Date(),
      endDate: new Date(),
      deliveryDate: new Date(),
      images: [{ id: 'img', preview: 'preview' }],
      markdown: 'test',
      markdownImages: [{ id: 'mid', file: new File([''], 'f'), preview: 'p' }],
      supportOptions: [{ id: 1, name: 'n', price: '1', description: 'd', stock: '1' }],
      platformPlan: 'BASIC',
      bankAccountId: 123,
      validationErrors: { test: ['err'] },
      isLoading: true,
      isSubmitting: true,
      error: 'err',
    });
    useProjectFormStore.getState().resetForm();
    const state = useProjectFormStore.getState();
    expect(state.projectId).toBeNull();
    expect(state.currentStep).toBe(1);
    expect(state.targetAmount).toBe('');
    expect(state.category).toBe('');
    expect(state.categoryId).toBeNull();
    expect(state.title).toBe('');
    expect(state.description).toBe('');
    expect(state.startDate).toBeNull();
    expect(state.endDate).toBeNull();
    expect(state.deliveryDate).toBeNull();
    expect(state.images).toEqual([]);
    expect(state.markdown).toContain('# 상품 상세 설명');
    expect(state.markdownImages).toEqual([]);
    expect(state.supportOptions).toEqual([]);
    expect(state.platformPlan).toBeNull();
    expect(state.bankAccountId).toBeNull();
    expect(state.validationErrors).toEqual({});
    expect(state.isLoading).toBe(false);
    expect(state.isSubmitting).toBe(false);
    expect(state.error).toBeNull();
  });

  it('setProjectId: 프로젝트 ID 설정', () => {
    useProjectFormStore.getState().setProjectId(1);
    expect(useProjectFormStore.getState().projectId).toBe(1);
  });

  it('setError: 에러 설정', () => {
    useProjectFormStore.getState().setError('error');
    expect(useProjectFormStore.getState().error).toBe('error');
    useProjectFormStore.getState().setError(null);
    expect(useProjectFormStore.getState().error).toBeNull();
  });

  it('setLoading: 로딩 상태 설정', () => {
    useProjectFormStore.getState().setLoading(true);
    expect(useProjectFormStore.getState().isLoading).toBe(true);
    useProjectFormStore.getState().setLoading(false);
    expect(useProjectFormStore.getState().isLoading).toBe(false);
  });

  it('setSubmitting: 제출 상태 설정', () => {
    useProjectFormStore.getState().setSubmitting(true);
    expect(useProjectFormStore.getState().isSubmitting).toBe(true);
    useProjectFormStore.getState().setSubmitting(false);
    expect(useProjectFormStore.getState().isSubmitting).toBe(false);
  });

  it('validateStepOne: 모든 값이 유효할 때 TRUE 반환', () => {
    useProjectFormStore.getState().updateFormData({
      targetAmount: '1000000000',
      categoryId: 5,
      title: '멋진 프로젝트',
      description: '이 프로젝트는 혁신적인 아이디어를 담고 있습니다.',
      startDate: new Date('2025-07-01'),
      endDate: new Date('2025-08-01'),
      deliveryDate: new Date('2025-09-01'),
      images: [{ id: 'img1', preview: 'preview1' }],
    });
    expect(useProjectFormStore.getState().validateStepOne()).toBe(true);
  });

  it('validateStepOne: 필수값 누락(제목 없음) 시 FALSE 반환', () => {
    useProjectFormStore.getState().updateFormData({
      targetAmount: '1000000000',
      categoryId: 5,
      title: '',
      description: '이 프로젝트는 혁신적인 아이디어를 담고 있습니다.',
      startDate: new Date('2025-07-01'),
      endDate: new Date('2025-08-01'),
      deliveryDate: new Date('2025-09-01'),
      images: [{ id: 'img1', preview: 'preview1' }],
    });
    expect(useProjectFormStore.getState().validateStepOne()).toBe(false);
  });

  it('validateStepThree: 모든 값이 유효할 때 TRUE 반환', () => {
    useProjectFormStore.getState().updateFormData({
      supportOptions: [
        {
          id: 1,
          name: '기본 후원',
          price: '10000',
          description: '감사의 인사 이메일',
          stock: '10',
          composition: [
            { id: 1, content: '기본 후원' },
          ],
        },
      ],
      platformPlan: 'BASIC',
      bankAccountId: 123,
    });
    expect(useProjectFormStore.getState().validateStepThree()).toBe(true);
  });

  it('validateStepThree: 필수값 누락(플랜 없음) 시 FALSE 반환', () => {
    useProjectFormStore.getState().updateFormData({
      supportOptions: [
        {
          id: 1,
          name: '기본 후원',
          price: '10000',
          description: '감사의 인사 이메일',
          stock: '10',
          composition: [
            { id: 1, content: '기본 후원' },
          ],
        },
      ],
      platformPlan: null,
      bankAccountId: 123,
    });
    expect(useProjectFormStore.getState().validateStepThree()).toBe(false);
  });

  it('setValidationErrors: 유효성 검사 에러 설정', () => {
    const errors = {
      title: ['제목을 입력해주세요.'],
      startDate: ['시작일 필수 입력'],
    };
    useProjectFormStore.getState().setValidationErrors(errors);
    expect(useProjectFormStore.getState().validationErrors).toEqual(errors);
  });
}); 