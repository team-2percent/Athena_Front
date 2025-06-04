export async function GET(request: Request) {
  // 신규 프로젝트 모킹 데이터 (10개)
  const content = Array.from({ length: 10 }, (_, i) => ({
    id: 10000 + i + 1,
    imageUrl: `https://picsum.photos/seed/recent${i}/400/300`,
    sellerName: `신규 셀러${i + 1}`,
    title: `신규 프로젝트 ${i + 1}`,
    achievementRate: 10 + i * 7,
    description: `신규 프로젝트의 ${i + 1}번째 모킹입니다.`,
    daysLeft: 30 - i,
    views: 100 * (i + 1),
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    endAt: new Date(Date.now() + (10 - i) * 86400000).toISOString(),
  }));
  return Response.json({
    total: 100,
    content,
    nextCursorValue: null,
    nextProjectId: null,
  });
} 