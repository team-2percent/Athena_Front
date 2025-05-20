import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
    const { approve } = await request.json();
    console.log(approve);
    return NextResponse.json({});
}