import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const { id: orderId } = params;

    if (!orderId) {
        return NextResponse.json(
            { error: 'Order ID is required' },
            { status: 400 }
        );
    }

    // Mock response for KakaoPay payment preparation
    const mockResponse = {
        next_redirect_pc_url: `https://mock.kakaopay.com/redirect/${orderId}`,
        tid: `TID${orderId}`,
    };

    return NextResponse.json(mockResponse, { status: 200 });
}