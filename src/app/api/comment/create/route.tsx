import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { projectId, content } = body;

        if (!projectId || !content) {
            return NextResponse.json(
                { error: "projectId and content are required" },
                { status: 400 }
            );
        }

        // Mock response for demonstration
        const newComment = {
            id: Date.now(), // Mock ID generation
            userName: "Anonymous", // Default user name
            content,
            createdAt: new Date().toISOString(),
        };

        return NextResponse.json(newComment, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "An error occurred while processing the request" },
            { status: 500 }
        );
    }
}