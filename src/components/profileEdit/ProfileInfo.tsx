"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, Check, Plus, X } from "lucide-react"
import { TextInput } from "../common/Input"
import { useApi } from "@/hooks/useApi"
import useAuthStore from "@/stores/auth"
import { CancelButton, PrimaryButton, SecondaryButton } from "../common/Button"
import { LINK_URLS_MAX_BYTE, NICKNAME_MAX_LENGTH, SELLER_DESCRIPTION_MAX_LENGTH } from "@/lib/ValidationConstants"
import TextArea from "../common/TextArea"
import InputInfo from "../common/InputInfo"
import { imageSchema, nicknameSchema, profileEditSchema, profileUrlSchema, sellerDescriptionSchema } from "@/lib/validationSchemas"
import { getByteLength } from "@/lib/utils"

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

interface ProfileInfoProps {
  onTo: () => void;
}

export default function ProfileInfo({ onTo }: ProfileInfoProps) {
    const { isLoading, apiCall } = useApi();
    const userId = useAuthStore(s => s.userId)

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

        apiCall("/api/user", "PUT", formData).then(({ error }) => {
            console.log(error);
            if (!error) {
                window.location.reload();
            }
        })
    }
    
    // 프로필 이미지 업로드 핸들러
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && validateImage(file)) {
            setProfile({
                ...profile,
                imageFile: file
            })
          const reader = new FileReader()
          reader.onload = (e) => {
            if (e.target?.result) {
              setProfile({
                ...profile,
                image: e.target.result as string
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
        setProfile({
            ...profile,
            linkUrls: [...profile.linkUrls, newUrl]
        })
        setNewUrl("")
        setAddingUrl(false)
    }

    const handleUrlRemove = (index: number) => {
        if (profile.linkUrls) setProfile({
            ...profile,
            linkUrls: profile.linkUrls.filter((_, i) => i !== index)
        })
    }

    // 유효성 검사
    const validateNickname = (nickname: string) => {
        const result = nicknameSchema.safeParse(nickname)
        if (nickname.length > NICKNAME_MAX_LENGTH) {
            setProfile({
                ...profile,
                nickname: nickname.slice(0, NICKNAME_MAX_LENGTH)
            })
        }
        setProfileEditError({
            ...profileEditError,
            nickname: result.success ? "" : result.error.issues[0].message
        })
    }

    const validateImage = (image: File) => {
        const result = imageSchema.safeParse(image)
        if (!result.success) {
            setProfileEditError({
                ...profileEditError,
                profileImage: result.error.issues[0].message
            })
            return false
        } 
        return true
    }

    const validateSellerDescription = (sellerDescription: string) => {
        const result = sellerDescriptionSchema.safeParse(sellerDescription)

        if (!result.success) {
            if (sellerDescription.length > SELLER_DESCRIPTION_MAX_LENGTH) {
                setProfile({
                    ...profile,
                    sellerDescription: sellerDescription.slice(0, SELLER_DESCRIPTION_MAX_LENGTH)
                })
            }
            setProfileEditError({
                ...profileEditError,
                sellerDescription: result.error.issues[0].message
            })
        }
    }

    const validateUrl = (url: string) => {
        const result = profileUrlSchema.safeParse({
            url: url,
            linkUrl: profile.linkUrls.join(",")
        })
        return result.success ? "" : result.error?.issues[0].message || ""
    }

    const handleChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
        validateNickname(e.target.value)
        if (e.target.value.length <= NICKNAME_MAX_LENGTH) {
            setProfile({
                ...profile,
                nickname: e.target.value
            })
        }
    }

    const handleChangeSellerDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        validateSellerDescription(e.target.value)
        if (e.target.value.length <= SELLER_DESCRIPTION_MAX_LENGTH) {
            setProfile({
                ...profile,
                sellerDescription: e.target.value
            })
        }
    }

    const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        const message = validateUrl(e.target.value)
        setProfileEditError({
            ...profileEditError,
            urls: message
        })
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
        setProfile({
            ...profile,
            nickname: prevProfile.nickname,
            email: prevProfile.email,
            image: prevProfile.imageUrl,
            sellerDescription: prevProfile.sellerDescription,
            linkUrls: prevProfile.linkUrl === "" ? [] : prevProfile.linkUrl.split(",")
        })
    }, [prevProfile])

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-5 flex-wrap justify-center">
                {/* 프로필 이미지 섹션 */}
                <div className="flex flex-col items-center bg-white rounded-lg shadow py-6 px-10 space-y-4">
                    <h3 className="text-lg font-medium">프로필 이미지</h3>                            
                    <div className="relative w-fit">
                        <button className="bg-red-500 p-1 rounded-full absolute top-0 right-0">
                            <X className="h-3 w-3 text-white" onClick={handleRemoveImage} />
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
                    <label htmlFor="profile-image" className="cursor-pointer text-main-color font-medium hover:text-secondary-color-dark">
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
                        />
                        <InputInfo errorMessage={profileEditError.nickname} />
                    </div>
                    </div>
                    <div className="flex justify-start w-full gap-4 items-center">
                        <span className="text-sm font-medium text-sub-gray w-10 whitespace-nowrap">이메일</span>
                        <span className="text-sm font-medium">{profile.email}</span>
                    </div>
                    <PrimaryButton
                        onClick={onTo}
                        className="w-fit"
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
                    />
                    <InputInfo errorMessage={profileEditError.sellerDescription} showLength length={profile.sellerDescription.length} maxLength={SELLER_DESCRIPTION_MAX_LENGTH} />
                </div>
                {/* 링크란 */}
                <div>
                <h3 className="text-lg font-medium mb-2">링크</h3>
                <div className="flex gap-4 items-start flex-wrap">
                    <SecondaryButton className="w-fit rounded-full p-2" onClick={toggleAddingUrl}>
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
                                />
                                <InputInfo errorMessage={profileEditError.urls} />
                            </div>
                            <PrimaryButton
                                className="w-fit rounded-full p-2"
                                onClick={handleUrlAdd}
                                disabled={urlAddButtonDisabled}
                            >
                                <Check className="w-4 h-4" />
                            </PrimaryButton>
                        </div>
                    }
                    {profile.linkUrls.map((url, index) => {
                        return (
                            <div key={index} className="flex gap-2 items-center rounded-full bg-gray-100 pl-4 pr-2 py-1">
                                <span>{url}</span>
                                <CancelButton 
                                    onClick={() => handleUrlRemove(index)}
                                    className="p-0.5 rounded-full"
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
                >
                저장
                </PrimaryButton>
            </div>  
        </div>
    )
}