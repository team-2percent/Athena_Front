import useAuthStore from '../stores/auth';
import { useProjectFormStore } from '../stores/useProjectFormStore';
import useToastStore from '../stores/useToastStore';
import useErrorToastStore from '../stores/useErrorToastStore';

describe('Zustand Stores', () => {
  describe('useAuthStore', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('setLoggedIn이 로그인 상태를 변경해야 함', () => {
      const store = useAuthStore.getState();
      store.setLoggedIn(true);
      expect(store.isLoggedIn).toBe(true);
      
      store.setLoggedIn(false);
      expect(store.isLoggedIn).toBe(false);
    });

    it('setRole이 사용자 권한을 변경해야 함', () => {
      const store = useAuthStore.getState();
      
      store.setRole('ROLE_ADMIN');
      expect(store.role).toBe('ROLE_ADMIN');
      
      store.setRole('ROLE_USER');
      expect(store.role).toBe('ROLE_USER');
      
      store.setRole('');
      expect(store.role).toBe('');
      
      store.setRole('ROLE_AMDIA');
      expect(store.isLoggedIn).toBe(false);
      expect(store.role).toBe('');
      expect(store.userId).toBe(null);
    });

    it('setUserId가 사용자 아이디를 변경해야 함', () => {
      const store = useAuthStore.getState();
      
      store.setUserId(1);
      expect(store.userId).toBe(1);
      
      store.setUserId(null);
      expect(store.userId).toBe(null);
    });

    it('setFcmToken이 fcm 토큰을 변경해야 함', () => {
      const store = useAuthStore.getState();
      
      store.setFcmToken('fcmToken');
      expect(store.fcmToken).toBe('fcmToken');
      
      store.setFcmToken(null);
      expect(store.fcmToken).toBe(null);
    });

    it('login이 로그인 처리를 해야 함', () => {
      const store = useAuthStore.getState();
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUk9MRV9BRE1JTiJ9.tR4M2YWhNXhjO52a4RMiQZa3lv_Q5N5FmNccfg0e_I0';
      
      store.login(token, 1);
      
      expect(store.isLoggedIn).toBe(true);
      expect(store.role).toBe('ROLE_ADMIN');
      expect(store.userId).toBe(1);
      expect(localStorage.getItem('accessToken')).toBe(token);
      expect(localStorage.getItem('userId')).toBe('1');
    });

    it('logout이 로그아웃 처리를 해야 함', () => {
      const store = useAuthStore.getState();
      
      store.logout();
      
      expect(store.isLoggedIn).toBe(false);
      expect(store.role).toBe('');
      expect(store.userId).toBe(null);
      expect(localStorage.getItem('accessToken')).toBe(null);
      expect(localStorage.getItem('userId')).toBe(null);
    });
  });

  describe('useProjectFormStore', () => {
    it('setCurrentStep이 현재 단계를 설정해야 함', () => {
      const store = useProjectFormStore.getState();
      store.setCurrentStep(2);
      expect(store.currentStep).toBe(2);
    });

    it('updateFormData가 폼 데이터를 업데이트해야 함', () => {
      const store = useProjectFormStore.getState();
      
      store.updateFormData({ projectId: 1 });
      expect(store.projectId).toBe(1);
      
      store.updateFormData({ currentStep: 2 });
      expect(store.currentStep).toBe(2);
      
      store.updateFormData({ targetAmount: '1000000000' });
      expect(store.targetAmount).toBe('1000000000');
      
      store.updateFormData({ category: '디지털' });
      expect(store.category).toBe('디지털');
      
      store.updateFormData({ categoryId: 5 });
      expect(store.categoryId).toBe(5);
      
      store.updateFormData({ title: '멋진 프로젝트' });
      expect(store.title).toBe('멋진 프로젝트');
      
      store.updateFormData({ description: '상세 설명' });
      expect(store.description).toBe('상세 설명');
      
      const date = new Date();
      store.updateFormData({ startDate: date });
      expect(store.startDate).toBe(date);
      
      store.updateFormData({ endDate: date });
      expect(store.endDate).toBe(date);
      
      store.updateFormData({ deliveryDate: date });
      expect(store.deliveryDate).toBe(date);
      
      const images = [
        {
          id: '1',
          preview: 'preview1',
          file: new File([], 'image1.jpg'),
        },
        {
          id: '2',
          preview: 'preview2',
          file: new File([], 'image2.jpg'),
        },
      ];
      store.updateFormData({ images });
      expect(store.images).toEqual(images);
      
      store.updateFormData({ markdown: '# 소개' });
      expect(store.markdown).toBe('# 소개');
      
      store.updateFormData({ markdownImages: [] });
      expect(store.markdownImages).toEqual([]);
      
      store.updateFormData({ supportOptions: [] });
      expect(store.supportOptions).toEqual([]);
      
      store.updateFormData({ platformPlan: 'BASIC' });
      expect(store.platformPlan).toBe('BASIC');
      
      store.updateFormData({ bankAccountId: 123 });
      expect(store.bankAccountId).toBe(123);
      
      store.updateFormData({ validationErrors: {} });
      expect(store.validationErrors).toEqual({});
      
      store.updateFormData({ isLoading: true });
      expect(store.isLoading).toBe(true);
      
      store.updateFormData({ isSubmitting: true });
      expect(store.isSubmitting).toBe(true);
      
      store.updateFormData({ error: '에러 발생' });
      expect(store.error).toBe('에러 발생');
    });

    it('resetForm이 폼을 초기화해야 함', () => {
      const store = useProjectFormStore.getState();
      store.resetForm();
      
      expect(store.projectId).toBe(null);
      expect(store.currentStep).toBe(1);
      expect(store.targetAmount).toBe('');
      expect(store.category).toBe('');
      expect(store.categoryId).toBe(null);
      expect(store.title).toBe('');
      expect(store.description).toBe('');
      expect(store.startDate).toBe(null);
      expect(store.endDate).toBe(null);
      expect(store.deliveryDate).toBe(null);
      expect(store.images).toEqual([]);
      expect(store.markdown).toBe('# 상품 상세 설명\n\n상품에 대한 자세한 설명을 작성해주세요.\n\n## 특징\n\n- 첫 번째 특징\n- 두 번째 특징\n- 세 번째 특징\n\n## 사용 방법\n\n1. 첫 번째 단계\n2. 두 번째 단계\n3. 세 번째 단계\n\n> 참고: 마크다운 문법을 사용하여 작성할 수 있습니다.');
      expect(store.markdownImages).toEqual([]);
      expect(store.supportOptions).toEqual([]);
      expect(store.platformPlan).toBe(null);
      expect(store.bankAccountId).toBe(null);
      expect(store.validationErrors).toEqual({});
      expect(store.isLoading).toBe(false);
      expect(store.isSubmitting).toBe(false);
      expect(store.error).toBe(null);
    });

    it('setProjectId가 프로젝트 ID를 설정해야 함', () => {
      const store = useProjectFormStore.getState();
      store.setProjectId(1);
      expect(store.projectId).toBe(1);
    });

    it('setError가 에러를 설정해야 함', () => {
      const store = useProjectFormStore.getState();
      
      store.setError('error');
      expect(store.error).toBe('error');
      
      store.setError(null);
      expect(store.error).toBe(null);
    });

    it('setLoading이 로딩 상태를 설정해야 함', () => {
      const store = useProjectFormStore.getState();
      
      store.setLoading(true);
      expect(store.isLoading).toBe(true);
      
      store.setLoading(false);
      expect(store.isLoading).toBe(false);
    });

    it('setSubmitting이 제출 상태를 설정해야 함', () => {
      const store = useProjectFormStore.getState();
      
      store.setSubmitting(true);
      expect(store.isSubmitting).toBe(true);
      
      store.setSubmitting(false);
      expect(store.isSubmitting).toBe(false);
    });

    it('validateStepOne이 1단계 유효성 검사를 해야 함', () => {
      const store = useProjectFormStore.getState();
      
      store.updateFormData({
        targetAmount: '1000000000',
        categoryId: 5,
        title: '멋진 프로젝트',
        description: '이 프로젝트는 혁신적인 아이디어를 담고 있습니다.',
        startDate: new Date('2025-07-01'),
        endDate: new Date('2025-08-01'),
        deliveryDate: new Date('2025-09-01'),
        images: [],
      });
      expect(store.validateStepOne()).toBe(true);
      
      store.updateFormData({
        targetAmount: '1000000000',
        categoryId: 5,
        title: '',
        description: '이 프로젝트는 혁신적인 아이디어를 담고 있습니다.',
        startDate: new Date('2025-07-01'),
        endDate: new Date('2025-08-01'),
        deliveryDate: new Date('2025-09-01'),
        images: [],
      });
      expect(store.validateStepOne()).toBe(false);
    });

    it('validateStepThree이 3단계 유효성 검사를 해야 함', () => {
      const store = useProjectFormStore.getState();
      
      store.updateFormData({
        supportOptions: [
          {
            id: 1,
            name: '기본 후원',
            price: "10000",
            description: '감사의 인사 이메일',
            stock: "0",
            composition: [
                {
                  id: 1,
                  content: '기본 후원',
                },
            ],
          },
        ],
        platformPlan: 'BASIC',
        bankAccountId: 123,
      });
      expect(store.validateStepThree()).toBe(true);
      
      store.updateFormData({
        supportOptions: [
          {
            id: 1,
            name: '기본 후원',
            price: '10000',
            description: '감사의 인사 이메일',
            stock: '0',
            composition: [
              {
                id: 1,
                content: '기본 후원',
              },
            ],
          },
        ],
        platformPlan: null,
        bankAccountId: 123,
      });
      expect(store.validateStepThree()).toBe(false);
    });

    it('setValidationErrors가 유효성 검사 에러를 설정해야 함', () => {
      const store = useProjectFormStore.getState();
      const errors = {
        title: ['제목을 입력해주세요.'],
        startDate: ['시작일 필수 입력'],
      };
      
      store.setValidationErrors(errors);
      expect(store.validationErrors).toEqual(errors);
    });
  });

  describe('useToastStore', () => {
    it('showToast가 토스트를 보여야 함', () => {
      const store = useToastStore.getState();
      store.showToast('title', 'body');
      
      expect(store.isVisible).toBe(true);
      expect(store.title).toBe('title');
      expect(store.body).toBe('body');
    });

    it('hideToast가 토스트를 숨겨야 함', () => {
      const store = useToastStore.getState();
      store.hideToast();
      
      expect(store.isVisible).toBe(false);
      expect(store.title).toBe('');
      expect(store.body).toBe('');
    });
  });

  describe('useErrorToastStore', () => {
    it('showToast가 토스트를 보여야 함', () => {
      const store = useErrorToastStore.getState();
      store.showErrorToast('title', 'body');
      
      expect(store.isVisible).toBe(true);
      expect(store.title).toBe('title');
      expect(store.body).toBe('body');
    });

    it('hideToast가 토스트를 숨겨야 함', () => {
      const store = useErrorToastStore.getState();
      store.hideErrorToast();
      
      expect(store.isVisible).toBe(false);
      expect(store.title).toBe('');
      expect(store.body).toBe('');
    });
  });
}); 