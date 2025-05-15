import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string }}) {
    const settlementId = +params.id
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