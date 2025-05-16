import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const params = request.nextUrl.pathname.split("/");
    const settlementId = params[params.length - 1];
    console.log(settlementId)

    return NextResponse.json({
        "items": [
          {
            "productName": "상품1",
            "totalQuantity": 10,
            "totalPrice": 550000,
            "platformFee": 55000,
            "payoutAmount": 495000
          }
        ],
        "total": {
          "totalQuantity": 10,
          "totalPrice": 550000,
          "platformFee": 55000,
          "payoutAmount": 495000
        }
    })
}