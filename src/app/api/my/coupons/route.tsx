import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sortType = searchParams.get("sortType");
    const cursorValue = searchParams.get("cursorValue");
    console.log(sortType, cursorValue);

    try {
        // 더미 데이터 생성
//   "content": [
//     {
//       "id": 9007199254740991,
//       "couponId": 9007199254740991,
//       "title": "string",
//       "content": "string",
//       "price": 1073741824,
//       "stock": 1073741824,
//       "expires": "2025-05-15T12:07:56.403Z",
//       "status": "UNUSED"
//     }
//   ],
//   "nextCouponId": 9007199254740991,
//   "total": 9007199254740991
// }
        const coupons = Array.from({ length: 10 }, (_, index) => ({
            id: index + 1,
            couponId: index + 1,
            title: `쿠폰${index + 1}`,
            content: `쿠폰 내용${index + 1}`,
            price: 10000 + index * 1000,
            stock: 100 - index,
            expires: `2025-07-${String(11 + index).padStart(2, "0")}T00:00:00`,
            status: index % 2 === 0 ? "UNUSED" : "USED"
        }));

        return NextResponse.json({
            content: coupons,
            nextCouponId: 1343241,
        });

        // 더 페이지가 없는 버전
        return NextResponse.json({
            success: true,
            data: coupons,
            nextCursorValue: null,
            nextProjectId: null,
            total: coupons.length,
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "프로젝트 조회에 실패했습니다."
        }, { status: 500 });
    }
}
