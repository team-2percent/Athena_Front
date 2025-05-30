// src/stores/useToastStore.ts
import { create } from "zustand";

interface ToastState {
  isVisible: boolean;
  title: string;
  body: string;
  showToast: (title: string, body: string) => void;
  hideToast: () => void;
}

const useToastStore = create<ToastState>((set) => ({
  isVisible: false,
  title: '',
  body: '',
  showToast: (title, body) => set({ isVisible: true, title, body }),
  hideToast: () => set({ isVisible: false, title: '', body: '' }),
}));

export default useToastStore;