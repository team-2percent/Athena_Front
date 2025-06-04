export async function GET(request) {
  // 메인페이지용 모킹 데이터 (10개씩, 이미지 placeholder)
  return Response.json({
    allTopView: Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      title: `테스트 프로젝트 ${i + 1}`,
      description: `${i + 1}번째 모킹 프로젝트입니다.`,
      viewCount: 1000 - i * 50,
      imageUrl: `https://picsum.photos/seed/allTopView${i}/400/300`,
    })),
    categoryTopView: [
      {
        categoryId: 10,
        categoryName: '아트',
        items: Array.from({ length: 5 }, (_, i) => ({
          id: 100 + i + 1,
          title: `아트 프로젝트 ${i + 1}`,
          description: `아트 카테고리의 ${i + 1}번째 모킹 프로젝트`,
          viewCount: 500 - i * 20,
          imageUrl: `https://picsum.photos/seed/art${i}/400/300`,
        })),
      },
      {
        categoryId: 20,
        categoryName: '테크',
        items: Array.from({ length: 5 }, (_, i) => ({
          id: 200 + i + 1,
          title: `테크 프로젝트 ${i + 1}`,
          description: `테크 카테고리의 ${i + 1}번째 모킹 프로젝트`,
          viewCount: 800 - i * 30,
          imageUrl: `https://picsum.photos/seed/tech${i}/400/300`,
        })),
      },
    ],
  });
} 