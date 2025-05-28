interface UserProfile {
    email: string
    nickname: string
    imageUrl: string
}

interface UserInfo {
    sellerDescription: string
    linkUrl: string
}

interface UserResponse {
    id: number,
    email: string,
    nickname: string,
    imageUrl: string,
    sellerDescription: string,
    linkUrl: string
}

export type { UserProfile, UserInfo, UserResponse}