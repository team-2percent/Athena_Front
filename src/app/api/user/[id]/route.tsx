import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    // Mock data for demonstration purposes
    const user = {
        id,
        email: `user${id}@example.com`,
        nickname: `user${id}_nickname`,
    };

    return NextResponse.json(user);
}