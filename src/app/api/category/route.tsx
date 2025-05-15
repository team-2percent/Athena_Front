import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    return NextResponse.json([
        {
            id: 1,
            categoryName: "카테고리1"
        },
        {
            id: 2,
            categoryName: "카테고리2"
        },
        {
            id: 3,
            categoryName: "카테고리3"
        },
        {
            id: 4,
            categoryName: "카테고리4"
        },
        {
            id: 5,
            categoryName: "카테고리5"
        },
        {
            id: 6,
            categoryName: "카테고리6"
        }
    ]);
}