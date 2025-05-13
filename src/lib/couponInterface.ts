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

export type { CouponEvent };