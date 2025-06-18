interface CouponEvent {
    id: number;
    couponId: number;
    title: string;
    content: string;
    price: number;
    stock: number;
    expireAt: string;
    userIssued: boolean;
}

interface UserCoupon {
    id: number,
    couponId: number,
    title: string,
    content: string,
    price: number,
    stock: number,
    expires: string,
    status: string,
}

export type { CouponEvent, UserCoupon };