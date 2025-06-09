import { create } from "zustand";

interface ErrorToastState {
  isVisible: boolean;
  title: string;
  body: string;
  showErrorToast: (title: string, body: string) => void;
  hideErrorToast: () => void;
}

const useErrorToastStore = create<ErrorToastState>((set) => ({
  isVisible: false,
  title: '',
  body: '',
  showErrorToast: (title, body) => set({ isVisible: true, title, body }),
  hideErrorToast: () => set({ isVisible: false, title: '', body: '' }),
}));

export default useErrorToastStore;