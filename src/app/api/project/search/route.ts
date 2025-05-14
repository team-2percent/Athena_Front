import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("searchTerm");
    const sortType = searchParams.get("sortType");
    const lastProjectId = searchParams.get("lastProjectId");
    console.log(searchTerm, sortType, lastProjectId);

    try {
        // 더미 데이터 생성
        const projects = [
            {
                id: 1,
                image: "/project1.jpg",
                sellerName: "판매자1",
                projectName: "프로젝트1",
                achievementRate: 85,
                description: "프로젝트1 설명입니다.",
                liked: false,
                daysLeft: 15
            },
            {
                id: 2,
                image: "/project2.jpg",
                sellerName: "판매자2",
                projectName: "프로젝트2",
                achievementRate: 65,
                description: "프로젝트2 설명입니다.",
                liked: false,
                daysLeft: 30
            }
        ];

        return NextResponse.json({
            success: true,
            data: projects,
            nextProjectId: 123123,
            total: projects.length,
        });

        // 더 페이지가 없는 버전
        return NextResponse.json({
            success: true,
            data: projects,
            nextProjectId: null,
            total: projects.length,
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "프로젝트 검색에 실패했습니다."
        }, { status: 500 });
    }
}
