import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const params = request.nextUrl.pathname.split("/");
    const settlementId = params[params.length - 1];
    console.log(settlementId)

    return NextResponse.json({
        "content": [
          {
            "productName": "상품1",
            "quantity": 1,
            "totalPrice": 100000,
            "fee": 10000,
            "amount": 90000,
            "orderedAt": "2025-01-10T00:00:00"
          },
          {
            "productName": "상품1",
            "quantity": 1,
            "totalPrice": 90000,
            "fee": 9000,
            "amount": 81000,
            "orderedAt": "2025-01-09T00:00:00"
          }
        ],
        "pageInfo": {
          "currentPage": 0,
          "totalPages": 1
        }
      })
}
