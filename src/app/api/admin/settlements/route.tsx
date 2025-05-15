import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "ALL";
    const year = searchParams.get("year") || "ALL";
    const month = searchParams.get("month") || "ALL";
    const page = searchParams.get("page") || "0";
    console.log(status, year, month, page)
    
    return NextResponse.json({
        "content": [
          {
            "settlementId": 9007199254740991,
            "projectTitle": "string",
            "totalSales": 9007199254740991,
            "platformFee": 9007199254740991,
            "payOutAmount": 9007199254740991,
            "sellerName": "string",
            "requestedAt": "2025-05-15T09:04:18.461Z",
            "status": "PENDING"
          }
        ],
        "pageInfo": {
          "currentPage": page,
          "totalPages": 1073741824
        }
      })
}