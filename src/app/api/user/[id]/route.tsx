import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const params = request.nextUrl.pathname.split('/');
    const id = params[params.length - 1]; // Extract the user ID from the URL

    // Mock data for demonstration purposes
    const user = {
        id,
        email: `user${id}@example.com`,
        nickname: `user${id}_nickname`,
    };

    return NextResponse.json(user);
}