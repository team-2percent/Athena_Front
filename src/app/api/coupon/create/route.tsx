import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { 
        title,
        content,
        price,
        startAt,
        endAt,
        expiresAt,
        stock,
    } = await request.json()
    
    return NextResponse.json({
        "id": 9007199254740991,
        "code": 9007199254740991,
        "title": title,
        "content": content,
        "price": price,
        "startAt": startAt,
        "endAt": endAt,
        "expiresAt": expiresAt,
        "stock": stock,
        "status": "PREVIOUS"
    })
}