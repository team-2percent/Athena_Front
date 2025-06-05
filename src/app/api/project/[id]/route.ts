import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // 모킹 데이터
  return Response.json({
    id: Number(id),
    title: `테스트 프로젝트 ${id}`,
    description: "이것은 모킹된 프로젝트 상세 설명입니다.",
    goalAmount: 1000000,
    totalAmount: 345000,
    markdown: `# 프로젝트 소개\n\n안녕하세요! 저희 프로젝트에 방문해주셔서 진심으로 감사드립니다.\n\n---\n\n## 1. 프로젝트 스토리\n\n### 시작의 계기\n\n2023년 어느 날, 저희 팀은 일상 속 불편함을 해결하고자 모였습니다.\n\n> "왜 이렇게 복잡하지? 더 쉽고, 더 편리하게 만들 수 없을까?"\n\n이런 작은 의문에서 출발한 저희 프로젝트는, 수많은 시행착오와 밤샘 회의 끝에 지금의 모습으로 발전하게 되었습니다.\n\n### 팀의 미션\n\n- **모두가 쉽게 쓸 수 있는 기술**\n- **지속 가능한 사회적 가치 창출**\n- **사용자 중심의 혁신**\n\n---\n\n## 2. 문제의식\n\n현대 사회는 빠르게 변화하고 있지만, 여전히 많은 사람들이 기술의 혜택을 충분히 누리지 못하고 있습니다.\n\n- 복잡한 사용법\n- 높은 진입 장벽\n- 비싼 가격\n\n저희는 이러한 문제를 해결하고자, 누구나 접근할 수 있는 솔루션을 만들기로 결심했습니다.\n\n---\n\n## 3. 시장 조사\n\n- **2023년 기준 관련 시장 규모**: 약 2조 원\n- **주요 타겟층**: 20~40대 직장인, 대학생, 1인 가구\n- **경쟁사 분석**: 기존 제품은 가격이 높거나, 사용법이 복잡함\n\n> "고객의 78%가 '더 쉽고 저렴한 대안'을 원한다는 설문 결과가 있습니다."\n\n---\n\n## 4. 기술적 차별점\n\n- **AI 기반 자동화**: 사용자의 패턴을 학습하여 맞춤형 서비스를 제공합니다.\n- **클라우드 연동**: 언제 어디서나 데이터에 접근 가능\n- **친환경 소재**: 환경을 생각한 소재 사용\n- **모듈형 설계**: 필요에 따라 기능을 추가/제거할 수 있습니다.\n ![내구성 테스트를 열심히 했습니다](https://img.notionusercontent.com/s3/prod-files-secure%2F3f96ae0a-aa67-4bd3-9df0-7dbae072442f%2F18ed2e8d-5b81-4a7b-8083-26aac3bbfc59%2Fproject-test6.png/size/w=2000?exp=1749109319&sig=G1FmEX4ltQmXoNwUaF9FXK5r8g3flzm_9cOa03LPJzM&id=2088b171-45f3-809d-ac39-de3f994fd929&table=block) \n---\n\n## 5. 상세 사용 시나리오\n\n### 시나리오 1: 바쁜 직장인 김철수\n\n1. 아침에 앱으로 오늘의 추천 설정을 확인\n2. 퇴근길에 원격으로 집안 기기를 제어\n3. 주말에는 가족과 함께 맞춤형 서비스를 활용\n\n### 시나리오 2: 1인 가구 대학생 이영희\n\n1. 처음 설치 시, 5분 만에 모든 설정 완료\n2. 매주 자동 리포트로 사용 패턴 확인\n3. 친구와 함께 공동 구매로 할인 혜택\n\n---\n\n## 6. 실제 사용자 후기\n\n> "설치가 정말 쉽고, 매일매일 삶이 편해졌어요!" - @happyuser\n> \n> "고객센터 응대가 빨라서 감동했습니다." - @quickhelp\n> \n> "친구에게 추천하고 싶은 서비스 1위!" - @recommend\n\n---\n\n## 7. 제품 상세 스펙\n\n| 항목 | 내용 |
|---|---|
| 크기 | 120 x 80 x 30 mm |
| 무게 | 250g |
| 배터리 | 4000mAh (최대 48시간 사용) |
| 연결 | Wi-Fi, Bluetooth 5.0 |
| 호환 OS | iOS, Android, Windows |
| 보증기간 | 2년 무상 A/S |

---

## 8. 로드맵

- **2024년 6월**: 베타 테스트 시작
- **2024년 8월**: 정식 출시
- **2024년 12월**: 해외 진출(일본, 미국)
- **2025년 상반기**: 신제품 라인업 공개

![북극에서도 내구성 테스트가 완료되었습니다](https://img.notionusercontent.com/s3/prod-files-secure%2F3f96ae0a-aa67-4bd3-9df0-7dbae072442f%2F3e6ae27a-ab18-46c4-9113-a39b6dc1cac0%2Fproject-test5.png/size/w=2000?exp=1749109286&sig=WhkwLKntSzeeNRtfFBtQi_XQE5FHdszk7lL-QeuQmK4&id=2088b171-45f3-807f-81ef-e2d6122d9f70&table=block)

---

## 9. 파트너십 및 협력사

- (주)테크이노베이션: 하드웨어 공급
- (주)그린소재: 친환경 소재 협력
- (주)마케팅랩: 온/오프라인 마케팅

---

## 10. 미디어 보도

- 2024.05.10 [IT조선] "혁신적 스마트 기기, 국내 첫 공개"
- 2024.05.22 [전자신문] "사용자 중심 설계로 시장 판도 바꾼다"
- 2024.06.01 [그린뉴스] "친환경 소재로 지속가능성 확보"

---

## 11. 자주 묻는 질문(FAQ)

**Q. 설치가 어렵지 않나요?**
A. 누구나 쉽게 설치할 수 있도록 상세 설명서와 동영상 가이드를 제공합니다.

**Q. A/S는 어떻게 받나요?**
A. 공식 홈페이지 또는 앱을 통해 간편하게 A/S 신청이 가능합니다.

**Q. 배터리 교체는 어떻게 하나요?**
A. 배터리 교체 방법은 제품 패키지 내 설명서와 앱 내 가이드에서 확인하실 수 있습니다.

**Q. 해외 배송도 되나요?**
A. 네, 일본/미국 등 주요 국가로 배송이 가능합니다.

**Q. 공동구매 할인은 어떻게 적용되나요?**
A. 2인 이상 공동구매 시 자동으로 할인 혜택이 적용됩니다.

![화산에서도 잘 버텨요](https://img.notionusercontent.com/s3/prod-files-secure%2F3f96ae0a-aa67-4bd3-9df0-7dbae072442f%2Fe1b705fc-fad2-42cb-af1c-dfe99b95b9be%2Fproject-test4.png/size/w=1420?exp=1749109225&sig=tlgz_7p08Q0-WzvhyVXlVAmQqGI5k2qxkAzaPwfr3g0&id=2088b171-45f3-80b5-8bad-ed750a006bdd&table=block)

---

## 12. 팀 소개

| 이름 | 역할 | 주요 경력 |
|---|---|---|
| 김개발 | 총괄 PM | 10년 경력, 대기업 프로젝트 리드 |
| 이디자이너 | UI/UX 디자인 | 글로벌 디자인 어워드 수상 |
| 박엔지니어 | 하드웨어/소프트웨어 | IoT 특허 3건 보유 |
| 최마케터 | 마케팅/커뮤니티 | SNS 팔로워 10만명 운영 |

---

## 13. 프로젝트 타임라인(상세)

1. 2023년 12월: 아이디어 구상 및 팀 결성
2. 2024년 1~3월: 프로토타입 개발 및 내부 테스트
3. 2024년 4월: 1차 사용자 피드백 수집
4. 2024년 5월: 기능 개선 및 디자인 확정
5. 2024년 6월: 베타 테스터 모집 및 운영
6. 2024년 7월: 생산 및 품질 테스트
7. 2024년 8월: 정식 출시 및 배송 시작

---

## 14. 고객센터 및 문의

- 이메일: support@example.com
- 전화: 02-1234-5678
- 카카오톡: @exampleproject
- 공식 홈페이지: https://example.com

---

## 15. 후원자 혜택

- 얼리버드 한정 할인
- 한정판 굿즈 제공
- 정식 출시 전 우선 체험 기회
- 공식 커뮤니티 초대

---

## 16. 커뮤니티 & SNS

- 인스타그램: @exampleproject
- 페이스북: facebook.com/exampleproject
- 유튜브: youtube.com/@exampleproject
- 네이버 카페: cafe.naver.com/exampleproject

---

## 17. Q&A (실시간)

**Q. 제품 사용 중 궁금한 점이 생기면?**
A. 공식 커뮤니티 또는 고객센터로 문의해 주세요. 빠르게 답변드리겠습니다.

**Q. 추가 기능 요청은 어떻게 하나요?**
A. 커뮤니티 내 '기능 제안' 게시판을 이용해 주세요.

---

## 18. 참고 자료 및 다운로드

- [제품 설명서 PDF 다운로드](https://example.com/manual.pdf)
- [설치 가이드 영상](https://youtube.com/exampleproject)
- [기술 백서](https://example.com/whitepaper.pdf)

---

## 19. 프로젝트를 만든 이유 (에필로그)

저희는 단순히 제품을 만드는 것이 아니라, 더 나은 세상을 만들고자 합니다.\n여러분의 작은 관심과 후원이 큰 변화를 만듭니다.\n\n---\n\n## 20. 감사의 말씀\n\n여기까지 읽어주신 모든 분들께 진심으로 감사드립니다.\n여러분의 응원과 피드백이 저희에게 큰 힘이 됩니다.\n\n---\n\n## 문의\n\n궁금한 점이 있으시면 언제든지 [공식 이메일](mailto:contact@example.com)로 연락해 주세요!\n\n감사합니다.\n`,
    startAt: "2024-06-01T00:00:00.000Z",
    endAt: "2024-07-01T23:59:59.000Z",
    shippedAt: "2024-08-01T00:00:00.000Z",
    imageUrls: [
      "/project-test.png",
      "/project-test2.png",
      "/project-test3.png"
    ],
    sellerResponse: {
      id: 1,
      nickname: "테스트 셀러",
      sellerIntroduction: "이 셀러는 모킹 데이터용입니다.",
      linkUrl: "/profile/1.png"
    },
    productResponses: [
      {
        id: 101,
        name: "테스트 상품 1",
        description: "테스트 상품 1의 설명입니다.",
        price: 25000,
        stock: 12,
        options: ["색상: 빨강", "사이즈: M"]
      },
      {
        id: 102,
        name: "테스트 상품 2",
        description: "테스트 상품 2의 설명입니다.",
        price: 35000,
        stock: 0,
        options: []
      }
    ]
  });
} 