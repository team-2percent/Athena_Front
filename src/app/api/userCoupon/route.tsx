import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { couponId } = await request.json()

    return NextResponse.json({
        "id": 9007199254740991,
        "couponId": 9007199254740991,
        "title": "string",
        "content": "string",
        "price": 1073741824,
        "stock": 1073741824,
        "expires": "2025-05-13T05:16:33.918Z",
        "status": "UNUSED"
    })
}