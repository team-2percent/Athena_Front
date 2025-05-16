import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.pathname.split("/");
    const id = params[params.length - 1]; // Extract the coupon ID from the URL

    // 쿠폰 데이터 예시 (실제로는 DB에서 조회)
    const coupon = {
      "id": id,
      "title": "쿠폰명",
      "content": "쿠폰 내용",
      "price": 10000,
      "startAt": "2025-05-14T00:00:00.000Z",
      "endAt": "2025-05-14T11:00:00.000Z",
      "expiresAt": "2025-05-16T11:00:00.000Z",
      "stock": 100,
      "status": "PREVIOUS",
    };

    return NextResponse.json({
      success: true,
      data: coupon
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "쿠폰 조회에 실패했습니다."
    }, { status: 500 });
  }
}
