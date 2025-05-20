import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const Params = request.nextUrl.pathname.split('/');
    const orderId = Params[Params.length - 1]; // Extract the order ID from the URL

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