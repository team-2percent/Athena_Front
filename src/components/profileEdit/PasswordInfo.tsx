"use client"

import { useApi } from "@/hooks/useApi";
import { PasswordInput } from "../common/Input";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { PrimaryButton, CancelButton } from "../common/Button";
import { newPasswordSchema, passwordEditSchema, passwordMatchSchema, passwordSchema } from "@/lib/validationSchemas";
import InputInfo from "../common/InputInfo";
import { PASSWORD_MAX_LENGTH } from "@/lib/validationConstant";
import useErrorToastStore from "@/stores/useErrorToastStore";

interface PasswordInfoProps {
  onBack: () => void;
}

export default function PasswordInfo({ onBack }: PasswordInfoProps) {
    const { isLoading, apiCall } = useApi();
    const { showErrorToast } = useErrorToastStore();
    // 비밀번호 관련 상태
    const [password, setPassword] = useState("")
    const [passwordConfirmed, setPasswordConfirmed] = useState(false);
    const [passwordConfirmError, setPasswordConfirmError] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("")
    const [successEditPassword, setSuccessEditPassword] = useState(false);
    const [passwordEditError, setPasswordEditError] = useState({
        password: "",
        newPassword: "",
        passwordConfirm: "",
    })

    const disabled = passwordEditSchema.safeParse({
        passwordConfirmed: passwordConfirmed,
        newPassword: newPassword,
        newPasswordConfirm: newPasswordConfirm,
        newPasswordMatch: {
            password: newPassword,
            passwordConfirm: newPasswordConfirm,
        }
    })

    const initPasswords = () => {
        setPassword("")
        setNewPassword("")
        setNewPasswordConfirm("")
        setPasswordConfirmed(false)
    }
    
    const validatePassword = (value: string) => {
        const result = passwordSchema.safeParse(value)
        
        setPasswordEditError({
            ...passwordEditError,
            password: result.success ? "" : result.error.issues[0].message,
        })

        return value.slice(0, PASSWORD_MAX_LENGTH)
    }

    const validateNewPassword = (value: string) => {
        const result = newPasswordSchema.safeParse(value)
        
        setPasswordEditError({
            ...passwordEditError,
            newPassword: result.success ? "" : result.error.issues[0].message,
        })

        return value.slice(0, PASSWORD_MAX_LENGTH)
    }

    const validateConfirmPassword = (value: string) => {
        const result = passwordSchema.safeParse(value)
        const matchResult = passwordMatchSchema.safeParse({password: newPassword, passwordConfirm: value})
        setPasswordEditError({
            ...passwordEditError,
            passwordConfirm: result.success && matchResult.success ? "" : result.error?.issues[0].message || matchResult.error?.issues[0].message || "",
        })

        return value.slice(0, PASSWORD_MAX_LENGTH)
    }

    // 비밀번호 입력 핸들러
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const result = validatePassword(e.target.value);
        setPassword(result)
    }

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const result = validateNewPassword(e.target.value);
        setNewPassword(result)
    }

    const handleNewPasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const result = validateConfirmPassword(e.target.value);
        setNewPasswordConfirm(result)
    }

    // 비밀번호 확인 핸들러
    const handlePasswordConfirm = () => {
        // 백엔드 요청 추가
        apiCall("/api/my/checkPassword", "POST", {
            password: password
        }).then(({ data, error, status }) => {
            if (!error && data === "false") {
                setPasswordConfirmError("비밀번호가 일치하지 않습니다.")
            } else if (error && status === 500) {
                showErrorToast("비밀번호 확인 실패", "다시 시도해주세요.")
            } else if (!error && data === "true") {
                setPasswordConfirmed(true)
            }
        })
    }

    // 새 비밀번호 적용 핸들러
    const handleNewPasswordApply = () => {
        // 백엔드 요청 추가
        apiCall("/api/my/updatePassword", "POST", {
            oldPassword: password,
            newPassword: newPassword
        }).then(({ error, status }) => {
            if (!error) {
                initPasswords();
                setSuccessEditPassword(true)
            } else if (error && status === 500) {
                showErrorToast("비밀번호 변경 실패", "다시 시도해주세요.")
            }
        })
    }

    return (
        <div className="flex flex-col gap-4">
            <div
                className="flex flex-col gap-6 bg-white rounded-lg shadow p-6"
            >
                <h3 className="text-lg font-medium" data-cy="password-change-title">비밀번호 변경</h3>
                {/* 비밀번호 확인란 */}
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-sub-gray">비밀번호 확인</p>
                        <div className="flex gap-2 items-center">
                            <PasswordInput
                                value={password}
                                onChange={handlePasswordChange}
                                designType="outline-rect"
                                dataCy="password-input"
                            />
                            <div className="flex items-center">
                            {
                                passwordConfirmed ?
                                <Check className="w-4 h-4 text-green-500" data-cy="password-confirm-success"/>
                                :
                                <div className="flex gap-2 items-center">
                                    <PrimaryButton
                                        type="submit"
                                        onClick={handlePasswordConfirm}
                                        className="px-3 py-2"
                                        dataCy="password-confirm-button"
                                        disabled={!!passwordEditError.password || !password}
                                    >확인</PrimaryButton>
                                </div>
                            }
                            </div>
                            <InputInfo errorMessage={passwordConfirmError ||passwordEditError.password} errorMessageDataCy="password-error-message" />
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-sub-gray">새 비밀번호 입력</p>
                        <div className="flex gap-2 items-center">
                            <PasswordInput
                                value={newPassword}
                                onChange={handleNewPasswordChange}
                                designType="outline-rect"
                                dataCy="new-password-input"
                            />
                            <InputInfo errorMessage={passwordEditError.newPassword} errorMessageDataCy="new-password-error-message" />
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-sub-gray">새 비밀번호 확인</p>
                        <div className="flex gap-2 items-center">
                            <PasswordInput
                                value={newPasswordConfirm}
                                onChange={handleNewPasswordConfirmChange}
                                designType="outline-rect"
                                dataCy="new-password-confirm-input"
                            />
                            <InputInfo errorMessage={passwordEditError.passwordConfirm} errorMessageDataCy="new-password-confirm-error-message" />
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 justify-end items-center">
                    {successEditPassword && <p className="text-sm text-sub-gray" data-cy="password-save-success-message">비밀번호 변경이 완료되었습니다.</p>}
                    <PrimaryButton
                        className="w-fit"
                        onClick={handleNewPasswordApply}
                        dataCy="password-save-button"
                        disabled={!disabled.success}
                    >
                        저장
                    </PrimaryButton>
                    <CancelButton
                        className="w-fit"
                        onClick={onBack}
                        dataCy="password-cancel-button"
                    >
                        취소
                    </CancelButton>
                </div>
            </div>
        </div>
    )
}