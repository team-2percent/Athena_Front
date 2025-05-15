import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const sortType = searchParams.get("sortType");
    const cursorValue = searchParams.get("cursorValue");
    const lastProjectId = searchParams.get("lastProjectId");

    try {
        // 더미 데이터 생성
        const projects = [
            {
                id: 1,
                imageUrl: "/project1.jpg",
                sellerName: "판매자1", 
                title: "프로젝트1",
                description: "프로젝트 설명입니다.",
                achievementRate: 85,
                createdAt: null,
                endAt: "2025-06-02T00:00:06",
                daysLeft: 15,
                views: 10,
            },
            {
                id: 2, 
                imageUrl: "/project2.jpg",
                sellerName: "판매자2",
                title: "프로젝트2", 
                description: "프로젝트 설명입니다.",
                achievementRate: 65,
                createdAt: null,
                endAt: "2025-06-02T00:00:06",
                daysLeft: 30,
                views: 0,
            }
        ];

        return NextResponse.json({
            success: true,
            data: projects,
            nextCursorValue: "cursorValue",
            nextProjectId: 132413,
            total: projects.length,
        });

        // 더 페이지가 없는 버전
        return NextResponse.json({
            success: true,
            data: projects,
            nextCursorValue: null,
            nextProjectId: null,
            total: projects.length,
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "프로젝트 조회에 실패했습니다."
        }, { status: 500 });
    }
}
