import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const { params } = context;
  const id = params?.id;

  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }

  // 목업 데이터
  const mockProjects = [
    {
      projectId: "1",
      title: "게살피자",
      description: "맛있는 게살피자 프로젝트",
      goalAmount: 10000000,
      totalAmount: 40000000,
      convertedMarkdown: `## 레시피 대충 소개

  (일본요리) 제일 쉬운 떡볶이

  ----------------------------

  재료

  ----------------------------

  고추장 3숟
  설탕 3숟
  쇠고기 다시다 0.5숟
  다진마늘 1숟
  대파 1뿌리

  밀떡 250~300g
  물 300~350g

  ![떡볶이 이미지](/tteokbokki/tteokbokki.jpg)`,
      startAt: "2025-04-25T00:00:00",
      endAt: "2025-05-15T23:59:59",
      shippedAt: "2025-06-13T00:00:00",
      imageUrls: [
        "/pizza/pizza-variant1.jpg",
        "/pizza/pizza-variant2.png",
        "/pizza/pizza-variant3.png",
        "/pizza/pizza-variant4.png",
        "/pizza/pizza-variant5.png",
        "/pizza/pizza-variant6.png",
        "/pizza/pizza-variant7.png",
        "/pizza/pizza-variant8.png",
        "/pizza/pizza-variant9.png",
        "/pizza/pizza-variant10.png",
      ],
      sellerResponse: {
        id: 101,
        sellerIntroduction: "어? 왜 지가 화를 내지?",
        linkUrl: "https://seller-intro.site",
      },
      productResponses: [
        {
          id: 201,
          name: "마음만 받을게요",
          description: "돈통 ㄱㅅ",
          price: 1000,
          stock: 999999,
          options: [],
        },
        {
          id: 202,
          name: "피자 아닌 떡볶이",
          description: "떡볶이 하나 (색상 선택 가능)\n맵기 정도 (순한, 조금매운, 매운 선택 가능)",
          price: 5000,
          stock: 200000000,
          options: ["색상 선택", "맵기 선택"],
        },
        {
          id: 203,
          name: "비밀스런 피자",
          description: "강 잡숴보셈 ㄹㅇ",
          price: 100000,
          stock: 200000000,
          options: [],
        },
        {
          id: 204,
          name: "프리미엄 세트",
          description: "떡볶이와 피자를 한번에 즐길 수 있는 프리미엄 세트",
          price: 150000,
          stock: 100,
          options: [],
        },
        {
          id: 205,
          name: "한정판 굿즈",
          description: "게살피자 캐릭터 피규어와 스티커 세트",
          price: 30000,
          stock: 50,
          options: [],
        },
        {
          id: 206,
          name: "디지털 아트북",
          description: "게살피자 제작 과정을 담은 디지털 아트북",
          price: 15000,
          stock: 999999,
          options: [],
        },
        {
          id: 207,
          name: "VIP 패키지",
          description: "모든 혜택을 한번에 누릴 수 있는 VIP 패키지",
          price: 300000,
          stock: 10,
          options: [],
        },
        {
          id: 208,
          name: "응원 메시지",
          description: "개발자에게 응원 메시지를 보낼 수 있습니다",
          price: 3000,
          stock: 999999,
          options: [],
        },
      ],
    },
    {
      projectId: "2",
      title: "수제 초콜릿 세트",
      description: "직접 만든 프리미엄 초콜릿 세트",
      goalAmount: 5000000,
      totalAmount: 3500000,
      convertedMarkdown: `## 수제 초콜릿 세트

  직접 만든 프리미엄 초콜릿 세트를 소개합니다.

  ### 특징

  - 100% 유기농 재료 사용
  - 인공 첨가물 무첨가
  - 다양한 맛과 모양

  ### 구성

  - 다크 초콜릿 (카카오 함량 70%)
  - 밀크 초콜릿
  - 화이트 초콜릿
  - 헤이즐넛 초콜릿
  - 딸기 초콜릿

  ![초콜릿 이미지](https://mblogthumb-phinf.pstatic.net/MjAyMzA4MDVfNjYg/MDAxNjkxMjQwODQ4MDQ5.Gp2vSuUPm3y5EnIgXlCuQd8fiTB74Fm6KrMF8-3vrsUg.FApJSVh_dkQXjcsoS5mbsGv5JCvbcm4O4akZRjY4_ZQg.JPEG.epochejonae/IMG_3806.jpg?type=w966)`,
      startAt: "2025-05-01T00:00:00",
      endAt: "2025-05-31T23:59:59",
      shippedAt: "2025-06-20T00:00:00",
      imageUrls: [
        "/dark-chocolate.png",
      ],
      sellerResponse: {
        id: 102,
        sellerIntroduction: "10년 경력의 초콜릿 장인입니다.",
        linkUrl: "https://chocolate-master.com",
      },
      productResponses: [
        {
          id: 301,
          name: "기본 세트",
          description: "5가지 맛 초콜릿 기본 세트",
          price: 25000,
          stock: 500,
          options: [],
        },
        {
          id: 302,
          name: "프리미엄 세트",
          description: "10가지 맛 초콜릿 프리미엄 세트",
          price: 45000,
          stock: 300,
          options: [],
        },
        {
          id: 303,
          name: "선물용 세트",
          description: "고급 패키지의 선물용 초콜릿 세트",
          price: 60000,
          stock: 200,
          options: ["포장지 선택", "메시지 카드 추가"],
        },
      ],
    },
    {
      projectId: "3",
      title: "스마트 홈 IoT 디바이스",
      description: "집안 모든 전자기기를 스마트하게 제어하는 IoT 디바이스",
      goalAmount: 20000000,
      totalAmount: 15000000,
      convertedMarkdown: `# 스마트 홈 IoT 디바이스

  집안 모든 전자기기를 스마트하게 제어하는 IoT 디바이스를 소개합니다.

  ## 주요 기능

  1. **음성 제어**: 구글 어시스턴트, 알렉사, 시리와 연동
  2. **원격 제어**: 외출 중에도 스마트폰으로 제어 가능
  3. **자동화**: 시간, 위치, 상황에 따른 자동화 설정
  4. **에너지 모니터링**: 전력 사용량 실시간 모니터링

  ## 기술 사양

  - 연결: Wi-Fi, Bluetooth 5.0, Zigbee
  - 전원: USB-C (5V/2A)
  - 크기: 100 x 100 x 25mm
  - 무게: 150g

  ![스마트 홈 디바이스](https://www.sisa-news.com/data/photos/20100832/art_1281856849.jpg)`,
      startAt: "2025-04-15T00:00:00",
      endAt: "2025-06-15T23:59:59",
      shippedAt: "2025-07-30T00:00:00",
      imageUrls: [
        "/smart-home-device.png",
        "/smart-home-app-interface.png",
      ],
      sellerResponse: {
        id: 103,
        sellerIntroduction: "IoT 전문 개발자 팀입니다. 5년간 다양한 스마트 홈 제품을 개발해왔습니다.",
        linkUrl: "https://smart-home-innovations.tech",
      },
      productResponses: [
        {
          id: 401,
          name: "기본형",
          description: "기본 기능을 갖춘 스마트 홈 컨트롤러",
          price: 89000,
          stock: 1000,
          options: ["색상 선택"],
        },
        {
          id: 402,
          name: "프로 버전",
          description: "고급 기능이 추가된 프로 버전 컨트롤러",
          price: 149000,
          stock: 500,
          options: ["색상 선택", "추가 센서 선택"],
        },
        {
          id: 403,
          name: "스타터 키트",
          description: "컨트롤러 + 스마트 플러그 3개 + 모션 센서 세트",
          price: 199000,
          stock: 300,
          options: [],
        },
        {
          id: 404,
          name: "개발자 에디션",
          description: "API 접근 권한과 개발 문서가 포함된 개발자용 버전",
          price: 249000,
          stock: 100,
          options: [],
        },
      ],
    },
  ]

  // Filter comments by projectId
  const filteredProject = mockProjects
    .filter((project) => project.projectId === id)
    .map((project) => ({
      projectId: project.projectId,
      title: project.title,
      description: project.description,
      goalAmount: project.goalAmount,
      totalAmount: project.totalAmount,
      convertedMarkdown: project.convertedMarkdown,
      startAt: project.startAt,
      endAt: project.endAt,
      shippedAt: project.shippedAt,
      imageUrls: project.imageUrls,
      sellerResponse: project.sellerResponse,
      productResponses: project.productResponses,
    }));

  return NextResponse.json(filteredProject[0]);
}
