import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const pageSize = Number(searchParams.get('size')) || 10;
    const pageNumber = Number(searchParams.get('number')) || 1;

    // 쿠폰 데이터 예시 (실제로는 DB에서 조회)
    const coupons = [
        {
            "id": 1,
            "title": "쿠폰명",
            "price": 10000,
            "startAt": "2025-05-14T00:00:00.000Z",
            "endAt": "2025-05-14T11:00:00.000Z",
            "expiresAt": "2025-05-16T11:00:00.000Z",
            "stock": 100,
            "status": "PREVIOUS",
        },
    {
        "id": 2,
        "title": "신규가입 할인쿠폰",
        "price": 5000,
        "startAt": "2025-05-15T00:00:00.000Z", 
        "endAt": "2025-05-15T11:00:00.000Z",
        "expiresAt": "2025-05-17T11:00:00.000Z",
        "stock": 200,
        "status": "INPROGRESS"
    },
    {
        "id": 3,
        "title": "여름맞이 특별 할인",
        "price": 15000,
        "startAt": "2025-06-01T00:00:00.000Z",
        "endAt": "2025-06-30T11:00:00.000Z", 
        "expiresAt": "2025-07-31T11:00:00.000Z",
        "stock": 150,
        "status": "PREVIOUS"
    },
    {
        "id": 4,
        "title": "주말 한정 할인",
        "price": 8000,
        "startAt": "2025-05-18T00:00:00.000Z",
        "endAt": "2025-05-19T11:00:00.000Z",
        "expiresAt": "2025-05-20T11:00:00.000Z", 
        "stock": 80,
        "status": "INPROGRESS"
    },
    {
        "id": 5,
        "title": "첫 구매 감사 쿠폰",
        "price": 12000,
        "startAt": "2025-05-01T00:00:00.000Z",
        "endAt": "2025-05-10T11:00:00.000Z",
        "expiresAt": "2025-05-12T11:00:00.000Z",
        "stock": 0,
        "status": "COMPLETED"
    },
    {
        "id": 6,
        "title": "가을 시즌 할인",
        "price": 20000,
        "startAt": "2025-09-01T00:00:00.000Z",
        "endAt": "2025-09-30T11:00:00.000Z",
        "expiresAt": "2025-10-31T11:00:00.000Z",
        "stock": 300,
        "status": "PREVIOUS"
    },
    {
        "id": 7,
        "title": "명절 특별 할인",
        "price": 25000,
        "startAt": "2025-05-01T00:00:00.000Z",
        "endAt": "2025-05-05T11:00:00.000Z",
        "expiresAt": "2025-05-07T11:00:00.000Z",
        "stock": 0,
        "status": "ENDED"
    },
    {
        "id": 8,
        "title": "회원 감사 쿠폰",
        "price": 7000,
        "startAt": "2025-05-20T00:00:00.000Z",
        "endAt": "2025-05-25T11:00:00.000Z",
        "expiresAt": "2025-05-27T11:00:00.000Z",
        "stock": 120,
        "status": "PREVIOUS"
    },
    {
        "id": 9,
        "title": "일일 한정 특가",
        "price": 3000,
        "startAt": "2025-05-16T00:00:00.000Z",
        "endAt": "2025-05-16T23:59:59.000Z",
        "expiresAt": "2025-05-17T23:59:59.000Z",
        "stock": 50,
        "status": "INPROGRESS"
    },
    {
        "id": 10,
        "title": "VIP 전용 쿠폰",
        "price": 30000,
        "startAt": "2025-05-01T00:00:00.000Z",
        "endAt": "2025-05-03T11:00:00.000Z",
        "expiresAt": "2025-05-05T11:00:00.000Z",
        "stock": 0,
        "status": "COMPLETED"
    },
    {
        "id": 11,
        "title": "봄맞이 할인",
        "price": 10000,
        "startAt": "2025-04-01T00:00:00.000Z",
        "endAt": "2025-04-30T11:00:00.000Z",
        "expiresAt": "2025-05-31T11:00:00.000Z",
        "stock": 0,
        "status": "ENDED"
    }
    ];

    // status 필터링
    let filteredCoupons = coupons;
    if (status) {
      filteredCoupons = coupons.filter(coupon => coupon.status === status);
    }

    // 페이지네이션
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCoupons = filteredCoupons.slice(startIndex, endIndex);

    return NextResponse.json({
        data: paginatedCoupons,
        page: {
            "size": pageSize,
            "number": pageNumber,
            "totalElements": filteredCoupons.length,
            "totalPages": Math.ceil(filteredCoupons.length / pageSize)
        }
      }
    );

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "쿠폰 목록 조회에 실패했습니다."
    }, { status: 500 });
  }
}

