type CouponStatusType = "ALL" | "PREVIOUS" | "INPROGRESS" | "COMPLETED" | "ENDED"

interface CouponDetail {
    id: number;
    title: string;
    content: string;
    price: number;
    startAt: string;
    endAt: string;
    expiresAt: string;
    stock: number;
    status: CouponStatusType;
}

interface CouponListItem {
    id: number;
    title: string;
    price: number;
    startAt: string;
    endAt: string;
    expiresAt: string;
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
    INPROGRESS: "발급 중",
    COMPLETED: "발급 완료",
    ENDED: "종료"
}

const CouponStatusColor = {
    ALL: "bg-gray-500",
    PREVIOUS: "bg-yellow-500",
    INPROGRESS: "bg-green-500",
    COMPLETED: "bg-blue-500",
    ENDED: "bg-gray-500",
}

export { CouponStatus, CouponStatusColor };
export type { CouponStatusType, CouponDetail, CouponListItem, CouponListResponse };