import { NextResponse } from 'next/server';

export async function GET() {
    const comments = [
        {
            id: 9007199254740991,
            userName: "string",
            content: "string",
            createdAt: "2025-05-15T12:33:44.007Z",
        },
        {
            id: 9007199254740991,
            userName: "string",
            content: "string",
            createdAt: "2025-05-15T12:33:44.007Z",
        },
        {
            id: 9007199254740991,
            userName: "string",
            content: "string",
            createdAt: "2025-05-15T12:33:44.007Z",
        },
        // Add more comments here if needed
    ];

    return NextResponse.json(comments);
}