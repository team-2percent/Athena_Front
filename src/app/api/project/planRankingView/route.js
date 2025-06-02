export async function GET(request) {
  // 메인페이지 플랜별 모킹 데이터 (10개씩, 이미지 placeholder)
  return Response.json([
    {
      planName: "PREMIUM",
      items: Array.from({ length: 10 }, (_, i) => ({
        id: 1000 + i + 1,
        title: `프리미엄 프로젝트 ${i + 1}`,
        sellerName: `프리미엄 셀러${i + 1}`,
        description: `프리미엄 플랜의 ${i + 1}번째 모킹 프로젝트입니다.`,
        achievementRate: 100 + i * 5,
        daysLeft: 20 - i,
      })),
    },
    {
      planName: "PRO",
      items: Array.from({ length: 10 }, (_, i) => ({
        id: 2000 + i + 1,
        title: `프로 프로젝트 ${i + 1}`,
        sellerName: `프로 셀러${i + 1}`,
        description: `프로 플랜의 ${i + 1}번째 모킹 프로젝트입니다.`,
        achievementRate: 80 + i * 3,
        daysLeft: 25 - i,
      })),
    },
  ]);
} 