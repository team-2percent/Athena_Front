export async function GET(request: Request) {
  // 쿼리 파라미터에서 categoryId 추출
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId') || '0';
  // 카테고리별 프로젝트 모킹 데이터 (10개)
  const content = Array.from({ length: 10 }, (_, i) => ({
    id: Number(categoryId) * 1000 + i + 1,
    imageUrl: `https://picsum.photos/seed/category${categoryId}_${i}/400/300`,
    sellerName: `카테고리${categoryId} 셀러${i + 1}`,
    title: `카테고리${categoryId} 프로젝트 ${i + 1}`,
    achievementRate: 30 + i * 5,
    description: `카테고리${categoryId}의 ${i + 1}번째 모킹 프로젝트입니다.`,
    daysLeft: 15 + i,
    views: 50 * (i + 1),
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    endAt: new Date(Date.now() + (20 - i) * 86400000).toISOString(),
  }));
  return Response.json({
    total: 100,
    content,
    nextCursorValue: null,
    nextProjectId: null,
  });
} 