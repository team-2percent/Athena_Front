import { NextResponse } from 'next/server';

export async function GET() {
    const response = {
        sellerIntroduction: "Welcome to our store! We offer the best products.",
        linkUrl: "https://example.com/store"
    };

    return NextResponse.json(response);
}