export async function GET(request: Request) {
  // 마감임박 프로젝트 모킹 데이터 (10개)
  const content = Array.from({ length: 10 }, (_, i) => ({
    id: 20000 + i + 1,
    imageUrl: `https://picsum.photos/seed/deadline${i}/400/300`,
    sellerName: `마감 셀러${i + 1}`,
    title: `마감임박 프로젝트 ${i + 1}`,
    achievementRate: 50 + i * 3,
    description: `마감임박 프로젝트의 ${i + 1}번째 모킹입니다.`,
    daysLeft: i + 1,
    views: 200 * (i + 1),
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    endAt: new Date(Date.now() + (i + 1) * 86400000).toISOString(),
  }));
  return Response.json({
    total: 100,
    content,
    nextCursorValue: null,
    nextProjectId: null,
  });
} 