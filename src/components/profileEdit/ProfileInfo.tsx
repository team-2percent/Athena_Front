"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, Check, Plus, X } from "lucide-react"
import { TextInput } from "../common/Input"
import { useApi } from "@/hooks/useApi"
import useAuthStore from "@/stores/auth"
import { CancelButton, PrimaryButton, SecondaryButton } from "../common/Button"
import { LINK_URLS_MAX_BYTE, NICKNAME_MAX_LENGTH, SELLER_DESCRIPTION_MAX_LENGTH } from "@/lib/validationConstant"
import TextArea from "../common/TextArea"
import InputInfo from "../common/InputInfo"
import { imageSchema, nicknameSchema, profileEditSchema, profileUrlSchema, sellerDescriptionSchema } from "@/lib/validationSchemas"
import { getByteLength } from "@/lib/utils"
import useErrorToastStore from "@/stores/useErrorToastStore"

interface Profile {
    nickname: string
    email: string
    imageUrl: string | null
    sellerDescription: string
    linkUrl: string
}

interface ProfileEdit {
    nickname: string
    email: string
    image: string | null
    imageFile: File | null
    sellerDescription: string
    linkUrls: string[]
}

interface LoadResponse {
    id: number
    email: string
    nickname: string
    imageUrl: string | null
    sellerDescription: string
    linkUrl: string
}

interface PutResponse {
    nickname: string
    imageUrl: string | null
    sellerDescription: string
    linkUrl: string
}

interface ProfileInfoProps {
  onTo: () => void;
}

export default function ProfileInfo({ onTo }: ProfileInfoProps) {
    const { isLoading, apiCall } = useApi();
    const userId = useAuthStore(s => s.userId)
    const { showErrorToast } = useErrorToastStore();
    const [addingUrl, setAddingUrl] = useState(false)
    const [newUrl, setNewUrl] = useState("")

    const [prevProfile, setPrevProfile] = useState<Profile>({
        nickname: "",
        email: "",
        imageUrl: null,
        sellerDescription: "",
        linkUrl: "",
    })

    const [profile, setProfile] = useState<ProfileEdit>({
        nickname: "",
        email: "",
        image: null,
        imageFile: null,
        sellerDescription: "",
        linkUrls: [],
    })
    
    const fileInputRef = useRef<HTMLInputElement>(null)

    // 저장 가능 여부
    const saveable = (profile.nickname !== prevProfile.nickname || 
        profile.email !== prevProfile.email || 
        profile.sellerDescription !== prevProfile.sellerDescription || 
        profile.linkUrls.join(",") !== prevProfile.linkUrl.split(",").join(","))
        &&
        profileEditSchema.safeParse({
            nickname: profile.nickname,
            sellerDescription: profile.sellerDescription,
            profileImage: profile.imageFile,
            linkUrl: profile.linkUrls.join(","),
        }).success

    const [profileEditError, setProfileEditError] = useState({
        nickname: "",
        sellerDescription: "",
        profileImage: "",
        urls: "",
    })

    const urlAddButtonDisabled = profileEditError.urls !== "" || newUrl.length === 0

    // 정보 조회
    const loadData = () => {
        apiCall<LoadResponse>(`/api/user/${userId}`, "GET").then(({ data }) => {
            if (data) {
                setPrevProfile({
                    nickname: data.nickname,
                    email: data.email,
                    imageUrl: data.imageUrl ? data.imageUrl : "",
                    sellerDescription: data.sellerDescription ? data.sellerDescription : "",
                    linkUrl: data.linkUrl ? data.linkUrl : ""
                })
            }
        })
    }

    // 정보 저장
    const saveData = async () => {
        const formData = new FormData()
        formData.append("request", new Blob([JSON.stringify({
            nickname: profile.nickname,
            sellerIntroduction: profile.sellerDescription,
            linkUrl: profile.linkUrls.join(",")
        })], { type: "application/json" }))
        if (profile.imageFile !== null) formData.append("files", profile.imageFile)

        apiCall<PutResponse>("/api/user", "PUT", formData).then(({ error, data, status }) => {
            if (error && status === 500) {
                showErrorToast("프로필 수정 실패", "다시 시도해주세요.")
            }
            if (!error && data) {
                setPrevProfile(prev => ({
                    ...prev,
                    nickname: data.nickname,
                    imageUrl: data.imageUrl,
                    sellerDescription: data.sellerDescription,
                    linkUrl: data.linkUrl
                }))
            }
        })
    }
    
    // 프로필 이미지 업로드 핸들러
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && validateImage(file)) {
          const reader = new FileReader()
          reader.onload = (e) => {
            if (e.target?.result) {
              setProfile({
                ...profile,
                image: e.target.result as string,
                imageFile: file
              })
            }
          }
          reader.readAsDataURL(file)
        }
    }

    // 프로필 이미지 삭제 핸들러
    const handleRemoveImage = () => {
        setProfile({
            ...profile,
            image: null,
            imageFile: null
        })
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }
    
    // 링크 핸들러
    const toggleAddingUrl = () => {
        setAddingUrl(!addingUrl)
        setNewUrl("")
    }

    const handleUrlAdd = () => {
        if (profileEditError.urls) return;
        setProfile(prev => ({
            ...prev,
            linkUrls: [...prev.linkUrls, newUrl]
        }))
        setNewUrl("")
        setAddingUrl(false)
    }

    const handleUrlRemove = (index: number) => {
        setProfile(prev => ({
            ...prev,
            linkUrls: prev.linkUrls.filter((_, i) => i !== index)
        }))
    }

    // 유효성 검사
    const validateNickname = (nickname: string) => {
        const result = nicknameSchema.safeParse(nickname)
        setProfileEditError(prev => ({
            ...prev,
            nickname: result.success ? "" : result.error.issues[0].message
        }))

        return nickname.slice(0, NICKNAME_MAX_LENGTH)
    }

    const validateImage = (image: File) => {
        const result = imageSchema.safeParse(image)
        if (!result.success) {
            setProfileEditError(prev => ({
                ...prev,
                profileImage: result.error.issues[0].message
            }))
            return false
        } 
        return true
    }

    const validateSellerDescription = (sellerDescription: string) => {
        const result = sellerDescriptionSchema.safeParse(sellerDescription)

        setProfileEditError(prev => ({
            ...prev,
            sellerDescription: result.error?.issues[0].message || ""
        }))

        return sellerDescription.slice(0, SELLER_DESCRIPTION_MAX_LENGTH)
    }

    const validateUrl = (url: string) => {
        const result = profileUrlSchema.safeParse({
            url: url,
            linkUrl: profile.linkUrls.join(",")
        })
        return result.success ? "" : result.error?.issues[0].message || ""
    }

    const handleChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nickname = validateNickname(e.target.value)
        setProfile(prev => ({
            ...prev,
            nickname: nickname
        }))
    }

    const handleChangeSellerDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const sellerDescription = validateSellerDescription(e.target.value)
        setProfile(prev => ({
            ...prev,
            sellerDescription: sellerDescription
        }))
    }

    const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        const message = validateUrl(e.target.value)
        setProfileEditError(prev => ({
            ...prev,
            urls: message
        }))
        
        const currentUrlsBytes = getByteLength(profile.linkUrls.join(","))
        const newUrlBytes = getByteLength(e.target.value)
        
        if (newUrlBytes + currentUrlsBytes > LINK_URLS_MAX_BYTE - 1) {
            // 바이트 제한을 초과하지 않는 최대 길이 찾기
            let slicedUrl = e.target.value
            while (getByteLength(slicedUrl) + currentUrlsBytes > LINK_URLS_MAX_BYTE - 1) {
                slicedUrl = slicedUrl.slice(0, -1)
            }
            setNewUrl(slicedUrl)
        } else {
            setNewUrl(e.target.value)
        }
    }
    
    // 전체 저장 핸들러
    const handleSave = () => {
        saveData();
    }

    useEffect(() => {
        if (userId) loadData();
    }, [userId])

    useEffect(() => {
        setProfile(prev => ({
            ...prev,
            nickname: prevProfile.nickname,
            email: prevProfile.email,
            image: prevProfile.imageUrl,
            sellerDescription: prevProfile.sellerDescription,
            linkUrls: prevProfile.linkUrl === "" ? [] : prevProfile.linkUrl.split(",")
        }))
    }, [prevProfile])

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-5 flex-wrap justify-center">
                {/* 프로필 이미지 섹션 */}
                <div className="flex flex-col items-center bg-white rounded-lg shadow py-6 px-10 space-y-4">
                    <h3 className="text-lg font-medium">프로필 이미지</h3>                            
                    <div className="relative w-fit">
                        <button
                            type="button"
                            className="bg-red-500 p-1 rounded-full absolute top-0 right-0"
                            onClick={handleRemoveImage}
                        >
                            <X className="h-3 w-3 text-white"/>
                        </button>
                        <div className="relative w-32 h-32 overflow-hidden rounded-full mb-4">
                            {profile.image ? (
                            <img
                            src={profile.image}
                            alt="프로필 이미지"
                            className="w-full h-full object-cover"
                            />
                            ) : (
                            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                                <Camera className="w-10 h-10 text-sub-gray" />
                            </div>
                            )}
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="profile-image"
                    />
                    <label
                        htmlFor="profile-image"
                        className="cursor-pointer text-main-color font-medium hover:text-secondary-color-dark"
                        data-cy="profile-image-upload-button"
                    >
                        프로필 사진 {profile.image ? "변경" : "업로드"}
                    </label>
                </div>
                
                {/* 이름, 이메일 란 */}
                <div className="flex-1 flex flex-col justify-start bg-white rounded-lg shadow p-6 gap-8">
                    <h3 className="text-lg font-medium">프로필 정보</h3>
                    <div className="flex justify-start w-full gap-8 items-center">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-sub-gray w-12 whitespace-nowrap">이름</span>
                        <TextInput
                            placeholder="이름"
                            designType="outline-rect"
                            value={profile.nickname}
                            onChange={handleChangeNickname}
                            dataCy="nickname-input"
                        />
                        <InputInfo errorMessage={profileEditError.nickname} errorMessageDataCy="nickname-error-message"/>
                    </div>
                    </div>
                    <div className="flex justify-start w-full gap-4 items-center">
                        <span className="text-sm font-medium text-sub-gray w-10 whitespace-nowrap">이메일</span>
                        <span className="text-sm font-medium">{profile.email}</span>
                    </div>
                    <PrimaryButton
                        onClick={onTo}
                        className="w-fit"
                        dataCy="password-change-button"
                    >
                        비밀번호 변경
                    </PrimaryButton>
                </div>   
            </div>

            {/* 소개, 링크 란 */}
            <div className="flex-1 flex flex-col justify-start bg-white rounded-lg shadow p-6 gap-6">
                <div>
                    <h3 className="text-lg font-medium mb-2">소개</h3>  
                    {/* 소개란 */}
                    <TextArea
                        className="h-[150px] w-full"
                        placeholder="소개를 입력하세요"
                        value={profile.sellerDescription}
                        onChange={handleChangeSellerDescription}
                        dataCy="seller-description-input"
                    />
                    <InputInfo
                        errorMessage={profileEditError.sellerDescription}
                        showLength
                        length={profile.sellerDescription.length}
                        maxLength={SELLER_DESCRIPTION_MAX_LENGTH}
                        errorMessageDataCy="seller-description-error-message"
                    />
                </div>
                {/* 링크란 */}
                <div>
                <h3 className="text-lg font-medium mb-2">링크</h3>
                <div className="flex gap-4 items-start flex-wrap">
                    <SecondaryButton
                        className="w-fit rounded-full p-2"
                        onClick={toggleAddingUrl} 
                        dataCy="toggle-link-url-add-form-button"
                    >
                        <Plus className="w-4 h-4" />
                    </SecondaryButton>
                    {
                        addingUrl &&
                        <div className="flex gap-2 items-start">
                            <div>
                                <TextInput
                                    designType="outline-rect"
                                    placeholder="링크를 입력하세요"
                                    value={newUrl}
                                    onChange={handleChangeUrl}
                                    dataCy="link-url-input"
                                />
                                <InputInfo errorMessage={profileEditError.urls} errorMessageDataCy="link-url-error-message"/>
                            </div>
                            <PrimaryButton
                                className="w-fit rounded-full p-2"
                                onClick={handleUrlAdd}
                                disabled={urlAddButtonDisabled}
                                dataCy="link-url-add-button"
                            >
                                <Check className="w-4 h-4" />
                            </PrimaryButton>
                        </div>
                    }
                    {profile.linkUrls.map((url, index) => {
                        return (
                            <div key={index} className="flex gap-2 items-center rounded-full bg-gray-100 pl-4 pr-2 py-1" data-cy="link">
                                <span>{url}</span>
                                <CancelButton 
                                    onClick={() => handleUrlRemove(index)}
                                    className="p-0.5 rounded-full"
                                    dataCy="link-url-remove-button"
                                >
                                    <X className="w-3 h-3" />
                                </CancelButton>
                            </div>
                        )
                    })}
                </div>
                </div>
            </div> 
            <div className="flex gap-2 justify-end items-end flex-wrap">
                <p className="text-sm font-medium text-sub-gray">※ 저장하지 않고 페이지를 나갈 시 변경사항이 저장되지 않습니다.</p>
                <PrimaryButton
                    disabled={!saveable}
                    onClick={handleSave}
                    dataCy="save-button"
                >
                저장
                </PrimaryButton>
            </div>  
        </div>
    )
}