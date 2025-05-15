interface listProject {
    id: number
    imageUrl: string
    sellerName: string
    title: string
    achievementRate: number
    description: string
    daysLeft: number
    views: number
    createdAt: string | null
    endAt: string
}

export type { listProject }