import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return NextResponse.json([
        {
            "id": 9007199354740991,
            "couponId": 9007199254740991,
            "title": "string",
            "content": "string",
            "price": 1073741824,
            "stock": 1073741824,
            "expireAt": "2025-05-13T05:16:33.825Z",
            "userIssued": false
        },
        {
        "id": 9007199254740991,
        "couponId": 9007196254740991,
        "title": "string",
        "content": "string",
        "price": 1073741824,
        "stock": 1073741824,
        "expireAt": "2025-05-13T05:16:33.825Z",
        "userIssued": true
        },
    ]);
}
