import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate the request body
        if (!body.deliveryInfoId || !body.projectId || !Array.isArray(body.orderItems)) {
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }

        // Mock response data
        const response = {
            orderId: body.deliveryInfoId,
            totalPrice: body.deliveryInfoId,
            orderedAt: new Date().toISOString(),
            items: body.orderItems.map((item: any) => ({
                productId: item.productId,
                productName: 'string', // Mock product name
                quantity: item.quantity,
                price: body.deliveryInfoId, // Mock price
            })),
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'An error occurred while processing the request' },
            { status: 500 }
        );
    }
}