"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, Check, Pencil, Plus, X } from "lucide-react"
import PasswordInput from "../common/PasswordInput"
import clsx from "clsx"
import { useApi } from "@/hooks/useApi"
import useAuthStore from "@/stores/auth"
import { CancelButton, PrimaryButton } from "../common/Button"

interface Profile {
    name: string
    email: string
    imageUrl: string | null
}

interface Intro {
    intro: string
    urls: string[]
}

interface LoadResponse {
    id: number
    email: string
    nickname: string
    imageUrl: string | null
    sellerDescription: string
    linkUrl: string
}

export default function ProfileInfo() {
    const { isLoading, apiCall } = useApi();
    const userId = useAuthStore(s => s.userId)
    // 비밀번호 수정 모드
    const [editingPassword, setEditingPassword] = useState(false);

    const [addingUrl, setAddingUrl] = useState(false)
    // 불러온 프로필
    const [profile, setProfile] = useState<Profile>({
        name: "",
        email: "",
        imageUrl: null,
    })
    // 불러온 소개
    const [intro, setIntro] = useState<Intro>({
        intro: "",
        urls: [],
    })
    // 프로필 이미지 관련 상태
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null)

    // 이름 수정 관련 상태
    const [newName, setNewName] = useState(profile.name)

    // 소개 관련 상태
    const [newIntroduction, setNewIntroduction] = useState(intro.intro)

    // 링크 관련 상태
    const [newUrls, setNewUrls] = useState<string[]>(intro.urls)
    const [newUrl, setNewUrl] = useState("");

    // 저장 가능 여부
    const saveable = newName !== profile.name || 
        profileImage !== profile.imageUrl || 
        newIntroduction !== intro.intro || 
        newUrls.join(",") !== intro.urls.join(",")

    // 비밀번호 관련 상태
    const [password, setPassword] = useState("")
    const [passwordConfirmed, setPasswordConfirmed] = useState(false);
    const [passwordConfirmError, setPasswordConfirmError] = useState(false);
    const [newPassword, setNewPassword] = useState("")
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("")
    const [passwordConfirmNeedError, setPasswordConfirmNeedError] = useState(false);
    const isMatchNewPassword = newPassword === newPasswordConfirm
    const [successEditPassword, setSuccessEditPassword] = useState(false);

    // 정보 조회
    const loadData = () => {
        apiCall<LoadResponse>(`/api/user/${userId}`, "GET").then(({ data }) => {
            if (data) {
                setProfile({
                    name: data.nickname,
                    email: data.email,
                    imageUrl: data.imageUrl ? data.imageUrl : ""
                })

                setIntro({
                    intro: data.sellerDescription ? data.sellerDescription : "",
                    urls: data.linkUrl ? data.linkUrl.split(",") : []
                })
            }
        })
    }

    // 정보 저장
    const saveData = async () => {
        const formData = new FormData()
        formData.append("request", new Blob([JSON.stringify({
            nickname: newName,
            sellerIntroduction: newIntroduction,
            linkUrl: newUrls ? newUrls.join(",") : ""
        })], { type: "application/json" }))
        if (profileImageFile !== null) formData.append("files", new Blob([profileImageFile]))

        apiCall("/api/user", "PUT", formData).then(({ error }) => {
            console.log(error);
        })
    }
    
    // 프로필 이미지 업로드 핸들러
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setProfileImageFile(file)
          const reader = new FileReader()
          reader.onload = (e) => {
            if (e.target?.result) {
              setProfileImage(e.target.result as string)
            }
          }
          reader.readAsDataURL(file)
        }
    }
    // 프로필 이미지 삭제 핸들러
    const handleRemoveImage = () => {
        setProfileImage(null)
        if (fileInputRef.current) {
        fileInputRef.current.value = ""
        }
    }
    
    // 링크 핸들러
    // 링크 추가 핸들러
    const toggleAddingUrl = () => {
        setAddingUrl(!addingUrl)
        setNewUrl("")
    }

    const handleUrlAdd = () => {
        setNewUrls([...newUrls, newUrl])
        setNewUrl("")
        setAddingUrl(false)
    }

    const handleUrlRemove = (index: number) => {
        if (newUrls) setNewUrls(newUrls.filter((_, i) => i !== index))
    }
    
    // 전체 저장 핸들러
    const handleSave = () => {
        saveData();
    }

    // 비밀번호 입력 핸들러
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
        setPasswordConfirmError(false)
    }

    // 비밀번호 변경 상태 초기화
    const initPasswords = () => {
        setPassword("")
        setNewPassword("")
        setNewPasswordConfirm("")
        setPasswordConfirmed(false)
    }

    // 비밀번호 확인 핸들러
    const handlePasswordConfirm = () => {
        // 백엔드 요청 추가
        apiCall("/api/my/checkPassword", "POST", {
            password: password
        }).then(({ data, error }) => {
            if (error || !data) {
                setPasswordConfirmError(true)
                console.log(`${password} not confirmed`)
            } else {
                setPasswordConfirmed(true)
                console.log(`${password} confirmed`)
            }
        })
    }

    // 새 비밀번호 입력 핸들러
    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value)
    }

    // 새 비밀번호 확인 입력 핸들러
    const handleNewPasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPasswordConfirm(e.target.value)
    }

    // 새 비밀번호 적용 핸들러
    const handleNewPasswordApply = () => {
        //비밀번호 확인 여부 체크
        if (!passwordConfirmed) {
            setPasswordConfirmNeedError(true)
            return
        }
        // 백엔드 요청 추가
        else {
            apiCall("/api/my/updatePassword", "POST", {
                oldPassword: password,
                newPassword: newPassword
            }).then(({ error }) => {
                if (!error) {
                    initPasswords();
                    setSuccessEditPassword(true)
                }
            })
        }
    }

    useEffect(() => {
        if (userId) loadData();
    }, [userId])

    useEffect(() => {
        initPasswords();
        setSuccessEditPassword(false)
    }, [editingPassword])

    useEffect(() => {
        setNewName(profile.name)
        setProfileImage(profile.imageUrl)
    }, [profile])

    useEffect(() => {
        setNewIntroduction(intro.intro)
        setNewUrls(intro.urls)
    }, [intro])

    return (
        <>
            {!editingPassword ? (
                <div className="flex flex-col gap-4">
                    <div className="flex gap-5 flex-wrap justify-center">
                        {/* 프로필 이미지 섹션 */}
                        <div className="flex flex-col items-center bg-white rounded-lg shadow py-6 px-10 space-y-4">
                            <h3 className="text-lg font-medium">프로필 이미지</h3>
                            <div className="relative w-32 h-32 overflow-hidden rounded-full mb-4">
                                {profileImage ? (
                                <>
                                    <img
                                    src={profileImage || "/placeholder.svg"}
                                    alt="프로필 이미지"
                                    className="w-full h-full object-cover"
                                    />
                                    <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                    >
                                    <X className="w-4 h-4" />
                                    </button>
                                </>
                                ) : (
                                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                                    <Camera className="w-10 h-10 text-sub-gray" />
                                </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="profile-image"
                            />
                            <label htmlFor="profile-image" className="cursor-pointer text-main-color font-medium hover:text-secondary-color-dark">
                                프로필 사진 {profileImage ? "변경" : "업로드"}
                            </label>
                        </div>
                        
                        {/* 이름, 이메일 란 */}
                        <div className="flex-1 flex flex-col justify-start bg-white rounded-lg shadow p-6 gap-8">
                            <h3 className="text-lg font-medium">프로필 정보</h3>
                            <div className="flex justify-start w-full gap-8 items-center">
                            <div className="flex items-center gap-2">
                                <input
                                    className="w-full px-3 py-2 border border-gray-border rounded-md focus:outline-none focus:ring-2 focus:ring-main-color text-sm"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                /> 
                            </div>
                            </div>
                            <div className="flex justify-start w-full gap-8 items-center">
                                <span className="text-sm font-medium text-sub-gray">이메일</span>
                                <span className="text-sm font-medium">{profile.email}</span>
                            </div>
                            <PrimaryButton
                                onClick={() => setEditingPassword(true)}
                                className="w-fit"
                            >
                                비밀번호 변경
                            </PrimaryButton>
                        </div>   
                    </div>

                    {/* 소개, 링크 란 */}
                    <div className="flex-1 flex flex-col justify-start bg-white rounded-lg shadow p-6 gap-2">
                        <h3 className="text-lg font-medium">소개</h3>  
                        {/* 소개란 */}
                        <textarea
                            className="w-full h-[150px] px-3 py-2 border border-gray-border rounded-md focus:outline-none focus:border-2 focus:border-main-color text-sm resize-none"
                            value={newIntroduction ? newIntroduction : ""}
                            onChange={(e) => setNewIntroduction(e.target.value)}
                        />
                        {/* 링크란 */}
                        <div className="flex gap-4 items-center flex-wrap">
                            <button onClick={toggleAddingUrl}>
                                <Plus className="w-4 h-4" />
                            </button>
                            {
                                addingUrl &&
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="url"
                                        className="w-full px-2 py-1 border border-gray-border rounded-md focus:outline-none focus:ring-2 focus:ring-main-color text-sm"
                                        value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
                                    <button onClick={handleUrlAdd}>
                                        <Check className="w-4 h-4" />
                                    </button>
                                </div>
                            }
                            {newUrls.map((url, index) => {
                                return (
                                    <div key={index} className="flex gap-2 items-center rounded-full bg-gray-100 px-4 py-1">
                                        <span>{url}</span>
                                        <button 
                                            onClick={() => handleUrlRemove(index)}
                                            className="text-sub-gray rounded-md text-sm"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div> 
                    <div className="flex gap-2 justify-end items-end flex-wrap">
                        <p className="text-sm font-medium text-sub-gray">※ 저장하지 않고 페이지를 나갈 시 변경사항이 저장되지 않습니다.</p>
                        <PrimaryButton
                            disabled={!saveable}
                            onClick={handleSave}
                        >
                            저장
                        </PrimaryButton>
                    </div>  
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                <div
                    className="flex flex-col gap-6 bg-white rounded-lg shadow p-6"
                >
                    
                    <h3 className="text-lg font-medium">비밀번호 변경</h3>
                    {/* 비밀번호 확인란 */}
                    <div className="flex flex-col gap-6 w-full">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-sub-gray">비밀번호 확인</p>
                            <div className="flex gap-2">
                                <PasswordInput
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                <div className="flex items-center">
                                {
                                    passwordConfirmed ?
                                    <Check className="w-4 h-4 text-green-500" />
                                    :
                                    <div className="flex gap-2 items-center">
                                        <PrimaryButton
                                            type="submit"
                                            onClick={handlePasswordConfirm}
                                            className="px-3 py-2"
                                        >확인</PrimaryButton>
                                        {passwordConfirmError && <p className="text-red-500 text-sm">비밀번호가 일치하지 않습니다.</p>}
                                        {passwordConfirmNeedError && <p className="text-red-500 text-sm">비밀번호 확인이 필요합니다.</p>}
                                    </div>
                                }
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-sub-gray">새 비밀번호 입력</p>
                            <div className="flex gap-2">
                                <PasswordInput
                                    value={newPassword}
                                    onChange={handleNewPasswordChange}
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-sub-gray">새 비밀번호 확인</p>
                            <div className="flex gap-2">
                                <PasswordInput
                                    value={newPasswordConfirm}
                                    onChange={handleNewPasswordConfirmChange}
                                />
                            </div>
                            {!isMatchNewPassword &&
                            <div className="flex gap-2 items-center text-red-500">
                                <X className="w-4 h-4 " />
                                <p className="text-red-500 text-sm">새 비밀번호가 일치하지 않습니다.</p>
                            </div>}
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end items-center">
                        {successEditPassword && <p className="text-sm text-sub-gray">비밀번호 변경이 완료되었습니다.</p>}
                        <PrimaryButton
                            className="w-fit"
                            onClick={handleNewPasswordApply}
                        >
                            저장
                        </PrimaryButton>
                        <CancelButton
                            className="w-fit"
                            onClick={() => setEditingPassword(false)}
                        >
                            취소
                        </CancelButton>
                    </div>
                </div>
                </div>
            )}
        </>
    )
}