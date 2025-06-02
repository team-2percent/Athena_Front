import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  // 모킹 리뷰 데이터
  return Response.json([
    {
      id: 1,
      userName: "홍길동",
      content: "정말 만족스러운 프로젝트였습니다! 추천합니다.",
      createdAt: "2024-06-10T12:34:56.000Z",
      imageUrl: "/project-test.png",
    },
    {
      id: 2,
      userName: "김영희",
      content: "배송도 빠르고, 상품 퀄리티도 좋아요.",
      createdAt: "2024-06-12T09:20:00.000Z",
      imageUrl: "/project-test2.png",
    },
    {
      id: 3,
      userName: "박철수",
      content: "아쉬운 점도 있었지만 전반적으로 만족합니다.",
      createdAt: "2024-06-15T15:10:30.000Z",
      imageUrl: "/project-test3.png",
    }
  ]);
} 