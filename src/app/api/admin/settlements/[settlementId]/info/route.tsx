import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const params = request.nextUrl.pathname.split("/"); 
    const settlementId = params[params.length - 1]; // Extract the settlementId from the URL
    console.log(settlementId)

    return NextResponse.json({
        "projectTitle": "테스트 프로젝트 1",
        "sellerNickname": "User1",
        "userId": 1,
        "targetAmount": 100000,
        "totalSales": 550000,
        "payoutAmount": 495000,
        "platformFee": 55000,
        "totalCount": 10,
        "settledAt": null,
        "status": "COMPLETED",
        "bankAccount": {
          "bankName": "은행1",
          "accountNumber": "0000000001"
        },
        "fundingStartDate": "2025-01-01T00:00:00",
        "fundingEndDate": "2025-01-21T00:00:00"
      })
}