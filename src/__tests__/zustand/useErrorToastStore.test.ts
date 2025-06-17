import useErrorToastStore from "@/stores/useErrorToastStore";
import { act } from "@testing-library/react";

describe('useErrorToastStore', () => {
    it('showToast가 토스트를 보여야 함', () => {
      const store = useErrorToastStore.getState();
      act(() => {
        store.showErrorToast('title', 'body');
      });
      
      const updatedStore = useErrorToastStore.getState();
      expect(updatedStore.isVisible).toBe(true);
      expect(updatedStore.title).toBe('title');
      expect(updatedStore.body).toBe('body');
    });

    it('hideToast가 토스트를 숨겨야 함', () => {
      const store = useErrorToastStore.getState();
      act(() => {
        store.hideErrorToast();
      });
      
      const updatedStore = useErrorToastStore.getState();
      expect(updatedStore.isVisible).toBe(false);
      expect(updatedStore.title).toBe('');
      expect(updatedStore.body).toBe('');
    });
  });