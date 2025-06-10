/// <reference types="jest" />

import { newPasswordSchema } from '@/lib/validationSchemas'
import useAuthStore from '@/stores/auth'


describe('비밀번호 스키마 테스트', () => {
    it('8자 이상', () => {
        const result = newPasswordSchema.safeParse('unvalid')
        expect(result.success).toBe(false)
        expect(result.error?.errors[0].message).toBe('8자 이상 입력해주세요.')
    })
})

describe('Auth Store 테스트', () => {
    beforeEach(() => {
        useAuthStore.setState({
            isLoggedIn: false,
            role: "",
            userId: null,
            hydrated: false,
            fcmToken: null
        })
    })

    it('로그인 상태 변경', () => {
        useAuthStore.getState().setLoggedIn(true)
        expect(useAuthStore.getState().isLoggedIn).toBe(true)
    })

    it('역할 변경', () => {
        useAuthStore.getState().setRole("ROLE_USER")
        expect(useAuthStore.getState().role).toBe("ROLE_USER")
    })

    it('유저 ID 변경', () => {
        useAuthStore.getState().setUserId(1)
        expect(useAuthStore.getState().userId).toBe(1)
    })

    it('FCM 토큰 변경', () => {
        const testToken = "test-fcm-token"
        useAuthStore.getState().setFcmToken(testToken)
        expect(useAuthStore.getState().fcmToken).toBe(testToken)
    })

    it('로그인 처리', () => {
        const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUk9MRV9VU0VSIn0.1234"
        const testUserId = 1

        useAuthStore.getState().login(testToken, testUserId)
        
        expect(useAuthStore.getState().isLoggedIn).toBe(true)
        expect(useAuthStore.getState().role).toBe("ROLE_USER")
        expect(useAuthStore.getState().userId).toBe(testUserId)
    })

    it('로그아웃 처리', () => {
        useAuthStore.getState().setLoggedIn(true)
        useAuthStore.getState().setRole("ROLE_USER")
        useAuthStore.getState().setUserId(1)
        useAuthStore.getState().setFcmToken("test-token")

        useAuthStore.getState().logout()

        expect(useAuthStore.getState().isLoggedIn).toBe(false)
        expect(useAuthStore.getState().role).toBe("")
        expect(useAuthStore.getState().userId).toBe(null)
        expect(useAuthStore.getState().fcmToken).toBe(null)
    })
})
