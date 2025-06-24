import { CouponEvent } from "@/lib/couponInterface";
import ServerErrorComponent from "../common/ServerErrorComponent";
import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import EmptyMessage from "../common/EmptyMessage";
import { Percent } from "lucide-react";
import clsx from "clsx";
import { formatDateInAdmin } from "@/lib/utils";
import { PrimaryButton } from "../common/Button";
import useErrorToastStore from "@/stores/useErrorToastStore";

export default function CouponList() {
    const { apiCall, isLoading } = useApi();
    const [coupons, setCoupons] = useState<CouponEvent[]>([]);
    const [serverError, setServerError] = useState<null | {
        message: string,
        onRetry: (...args: any[]) => void
    }>(null);
    const { showErrorToast } = useErrorToastStore();
    const ServerErrorType = {
        GET_COUPON: {
            message: "쿠폰을 발급하는데 실패했습니다.",
            onRetry: (couponId: number) => handleGetCoupon(couponId)
        },
        GET_COUPON_LIST: {
            message: "쿠폰 목록을 불러오는데 실패했습니다.",
            onRetry: () => loadCoupons()
        }
    }

    const handleGetCoupon = (couponId: number) => {
        apiCall("/api/userCoupon", "POST", { couponId }).then(({ error, status }) => {
            if (error && status === 500) {
                showErrorToast("쿠폰 발급 실패", ServerErrorType.GET_COUPON.message);
            } else {
                loadCoupons();
                setServerError(null);
            }
        })
    }

    const loadCoupons = () => {
        apiCall("/api/coupon/getInProgress", "GET").then(({ data, error, status }) => {
            if (error && status === 500) {
                setServerError(ServerErrorType.GET_COUPON_LIST);
            } else if (data) {
                setCoupons(data as CouponEvent[])
                setServerError(null);
            }
        })
    }

    useEffect(() => {
        loadCoupons();
    }, []);

    if (serverError) {
        return <ServerErrorComponent message={serverError.message} onRetry={serverError.onRetry} />
    } else if (isLoading) {
        return (
          <div data-cy="coupon-list-skeleton">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl border p-3 mb-3 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
                      <div>
                        <div className="h-6 w-24 bg-gray-200 rounded mb-1"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="mt-1 h-3 w-48 bg-gray-200 rounded"></div>
                    <div className="mt-1 h-3 w-32 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
                    <div className="mt-1 h-3 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
    } else if (coupons.length === 0) {
        return <EmptyMessage message="발급 가능한 쿠폰이 없습니다." />
    } else {
        return coupons.map((coupon) => (
        <div key={coupon.id} className="rounded-xl border p-3" data-cy="coupon-list-item">
        <div className="flex items-center justify-between">
            <div className="flex flex-col">
            <div className="flex items-center gap-3">
            <div className={clsx("flex h-10 w-10 items-center justify-center rounded-md text-white", coupon.userIssued || coupon.stock === 0 ? "bg-disabled-background" : "bg-main-color")}>
                <Percent className="h-5 w-5" />
            </div>
            <div>
                <div className={clsx("text-lg font-bold", coupon.userIssued || coupon.stock === 0 ? "text-disabled-color" : "text-main-color")}>{coupon.price} 원</div>
                <div className="text-sm font-medium">{coupon.title}</div>
            </div>
            </div>
            <p className="mt-1 text-xs text-sub-gray">{coupon.content}</p>
            <p className="mt-0.5 text-xs text-sub-gray">{formatDateInAdmin(coupon.expireAt) + ' 만료'}</p>
            </div>
            <div className="flex flex-col items-end">
            <PrimaryButton
                className={clsx("rounded-full w-fit px-4 py-1.5 text-sm font-medium", coupon.userIssued || coupon.stock === 0? "pointer-events-none" : "")}
                onClick={() => handleGetCoupon(coupon.couponId)}
                disabled={coupon.userIssued || coupon.stock === 0}
                dataCy="coupon-issue-button"
                isLoading={isLoading}

            >
                {coupon.userIssued ? "발급완료" : coupon.stock === 0 ? "발급종료" : "발급받기"}
            </PrimaryButton>
            <div className="mt-1 text-xs text-sub-gray">
                {coupon.stock}개 남음
            </div>
            </div>
        </div>
        </div>
    ))
    }
}