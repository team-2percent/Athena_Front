import { randomFill } from "crypto";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sortType = searchParams.get("sortType");
    const cursorValue = searchParams.get("cursorValue");
    const lastProjectId = searchParams.get("lastProjectId");
    console.log(sortType, cursorValue, lastProjectId);

    try {
        // 더미 데이터 생성
        // projectId, title, isCompleted, createdAt
        const projects = Array.from({ length: 10 }, (_, index) => ({
            orderId: index + 1,
            productId: index + 11,
            productTitle: `상품${index + 11}`,
            sellerNickname: `User${index + 1}`,
            thumbnailUrl: null,
            orderedAt: `2025-04-${String(20 + index).padStart(2, "0")}T00:00:00`,
            achievementRate: Math.floor(Math.random() * 200),
        }));

        return NextResponse.json({
            content: projects,
            nextCursorValue: "cursorValue",
            nextProjectId: 1343241,
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
