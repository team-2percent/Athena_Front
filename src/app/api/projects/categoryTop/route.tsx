import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return NextResponse.json([
        {
            id: 1,
            imageUrl: "/project-test.png",
            title: "Project 1",
            categoryId: 1,
            categoryName: "Category 1"
        },
        {
            id: 2,
            imageUrl: "/project-test2.png",
            title: "Project 2",
            categoryId: 2,
            categoryName: "Category 2"
        },
        {
            id: 3,
            imageUrl: "/project-test3.png",
            title: "Project 3",
            categoryId: 3,
            categoryName: "Category 3"
        },
        {
            id: 4,
            imageUrl: "/project-test.png",
            title: "Project 4",
            categoryId: 4,
            categoryName: "Category 4"
        },
        {
            id: 5,
            imageUrl: "/project-test2.png",
            title: "Project 5",
            categoryId: 5,
            categoryName: "Category 5"
        },
    ]);
}