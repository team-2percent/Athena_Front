type CouponStatusType = "ALL" | "PREVIOUS" | "IN_PROGRESS" | "COMPLETED" | "ENDED"

interface CouponDetail {
    id: number;
    title: string;
    content: string;
    price: number;
    startAt: string;
    endAt: string;
    expireAt: string;
    stock: number;
    status: CouponStatusType;
}

interface CouponListItem {
    id: number;
    title: string;
    price: number;
    startAt: string;
    endAt: string;
    expireAt: string;
    stock: number;
    status: CouponStatusType;
}

interface CouponListResponse {
    content: CouponListItem[];
    page: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
    }
}

const CouponStatus = {
    ALL: "전체",
    PREVIOUS: "발급 전",
    IN_PROGRESS: "발급 중",
    COMPLETED: "발급 완료",
    ENDED: "종료"
}

const CouponStatusColor = {
    ALL: "bg-gray-500",
    PREVIOUS: "bg-yellow-500",
    IN_PROGRESS: "bg-green-500",
    COMPLETED: "bg-blue-500",
    ENDED: "bg-gray-500",
}

export { CouponStatus, CouponStatusColor };
export type { CouponStatusType, CouponDetail, CouponListItem, CouponListResponse };