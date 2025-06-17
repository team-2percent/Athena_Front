import useAuthStore from "@/stores/auth";
import { act } from '@testing-library/react';

describe('useAuthStore', () => {
    beforeEach(() => {
        localStorage.clear();
        useAuthStore.setState({
            isLoggedIn: false,
            role: "",
            userId: null,
            fcmToken: null
        });
    });

    it('setLoggedIn이 로그인 상태를 변경해야 함', () => {
        const store = useAuthStore.getState();
      
        act(() => {
            store.setLoggedIn(true);
        });

        expect(useAuthStore.getState().isLoggedIn).toBe(true);
      
        act(() => {
            store.setLoggedIn(false);
        });
      
        expect(useAuthStore.getState().isLoggedIn).toBe(false);
    });

    it('setRole이 사용자 권한을 변경해야 함', () => {
        const store = useAuthStore.getState();
        
        act(() => {
            store.setRole('ROLE_ADMIN');
        });
        expect(useAuthStore.getState().role).toBe('ROLE_ADMIN');
        
        act(() => {
            store.setRole('ROLE_USER');
        });
        expect(useAuthStore.getState().role).toBe('ROLE_USER');
        
        act(() => {
            store.setRole('');
        });
        expect(useAuthStore.getState().role).toBe('');
        
        act(() => {
            store.setRole('ROLE_AMDIA');
        });

        const finalState = useAuthStore.getState();
        expect(finalState.isLoggedIn).toBe(false);
        expect(finalState.role).toBe('');
        expect(finalState.userId).toBe(null);
    });

    it('setUserId가 사용자 아이디를 변경해야 함', () => {
        const store = useAuthStore.getState();
        
        act(() => {
            store.setUserId(1);
        });
        expect(useAuthStore.getState().userId).toBe(1);
        
        act(() => {
            store.setUserId(null);
        });
        expect(useAuthStore.getState().userId).toBe(null);
    });

    it('setFcmToken이 fcm 토큰을 변경해야 함', () => {
        const store = useAuthStore.getState();
        
        act(() => {
            store.setFcmToken('fcmToken');
        });
        expect(useAuthStore.getState().fcmToken).toBe('fcmToken');
        
        act(() => {
            store.setFcmToken(null);
        });
        expect(useAuthStore.getState().fcmToken).toBe(null);
    });

    it('login이 로그인 처리를 해야 함', () => {
        const store = useAuthStore.getState();
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUk9MRV9BRE1JTiJ9.tR4M2YWhNXhjO52a4RMiQZa3lv_Q5N5FmNccfg0e_I0';
        
        act(() => {
            store.login(token, 1);
        });
        
        const finalState = useAuthStore.getState();
        expect(finalState.isLoggedIn).toBe(true);
        expect(finalState.role).toBe('ROLE_ADMIN');
        expect(finalState.userId).toBe(1);
        expect(localStorage.getItem('accessToken')).toBe(token);
        expect(localStorage.getItem('userId')).toBe('1');
    });

    it('logout이 로그아웃 처리를 해야 함', () => {
        const store = useAuthStore.getState();
        
        act(() => {
            store.logout();
        });
        
        const finalState = useAuthStore.getState();
        expect(finalState.isLoggedIn).toBe(false);
        expect(finalState.role).toBe('');
        expect(finalState.userId).toBe(null);
        expect(localStorage.getItem('accessToken')).toBe(null);
        expect(localStorage.getItem('userId')).toBe(null);
    });
});