import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: { id: string } }) {
    const { params } = context;
    const projectId = params?.id;

    if (!projectId) {
        return NextResponse.json(
            { error: "projectId is required" },
            { status: 400 }
        );
    }

    // Mock data for demonstration
    const comments = [
        {
            id: 9007199254740991,
            projectId: "1",
            userName: "John Doe",
            content: "This is a comment for project 1.",
            createdAt: "2025-05-13T11:13:59.194Z",
        },
        {
            id: 9007199254740992,
            projectId: "1",
            userName: "Jane Smith",
            content: "Another comment for project 1.",
            createdAt: "2025-05-14T12:15:45.123Z",
        },
        {
            id: 9007199254740993,
            projectId: "2",
            userName: "Alice Johnson",
            content: "This is a comment for project 2.",
            createdAt: "2025-05-15T09:30:00.000Z",
        },
        {
            id: 9007199254740994,
            projectId: "2",
            userName: "Bob Brown",
            content: "Another comment for project 2.",
            createdAt: "2025-05-16T14:45:30.456Z",
        },
        {
            id: 9007199254740995,
            projectId: "3",
            userName: "Charlie Green",
            content: "This is a comment for project 3.",
            createdAt: "2025-05-17T10:00:00.000Z",
        },
    ];

    // Filter comments by projectId
    const filteredComments = comments
        .filter((comment) => comment.projectId === projectId)
        .map(({ id, userName, content, createdAt }) => ({
            id,
            userName,
            content,
            createdAt,
        }));

    return NextResponse.json(filteredComments);
}
