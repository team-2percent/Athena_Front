import useToastStore from "@/stores/useToastStore";
import { act } from "@testing-library/react";

describe('useToastStore', () => {
    it('showToast가 토스트를 보여야 함', () => {
      const store = useToastStore.getState();
      act(() => {
        store.showToast('title', 'body');
      });
      
      const updatedStore = useToastStore.getState();
      expect(updatedStore.isVisible).toBe(true);
      expect(updatedStore.title).toBe('title');
      expect(updatedStore.body).toBe('body');
    });

    it('hideToast가 토스트를 숨겨야 함', () => {
      const store = useToastStore.getState();
      act(() => {
        store.hideToast();
      });
      
      const updatedStore = useToastStore.getState();
      expect(updatedStore.isVisible).toBe(false);
      expect(updatedStore.title).toBe('');
      expect(updatedStore.body).toBe('');
    });
  });