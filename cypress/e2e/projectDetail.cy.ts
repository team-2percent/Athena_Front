describe('프로젝트 상세 페이지 (Mock)', () => {
  const mockProjectId = 'test'
  const mockProjectData = {
    id: 9999,
    title: '모킹 프로젝트',
    description: '이것은 Cypress 모킹 테스트용 프로젝트입니다.',
    goalAmount: 1000000,
    totalAmount: 500000,
    markdown: '# 상세 설명\n이 프로젝트는 테스트용입니다.',
    startAt: '2024-06-01',
    endAt: '2024-06-30',
    shippedAt: '2024-07-10',
    imageUrls: [
      "/project-test.png",
      "/project-test2.png",
      "/project-test3.png"
    ],
    sellerResponse: {
      id: 1,
      nickname: '테스트판매자',
      sellerIntroduction: '테스트 판매자 소개',
      linkUrl: 'https://test.com'
    },
    productResponses: [
      {
        id: 1,
        name: '테스트 리워드',
        description: '테스트 리워드 설명',
        price: 10000,
        stock: 10,
        options: []
      }
    ]
  }

  const mockComments = [
    {
      id: 1,
      userName: '테스트유저',
      content: '이것은 테스트용 후기입니다.',
      createdAt: '2024-06-30T12:00:00Z',
      imageUrl: '/profile-test.png'
    }
  ]

  function formatDatePad(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}. ${m}. ${d}.`;
  }

  it('메타데이터가 정상적으로 노출된다', () => {
    cy.task('resetApiMocks');
    
    // 프로젝트 상세 정보 mock
    cy.task('mockApiResponse', { 
      endpoint: `/api/project/${mockProjectId}`, 
      data: mockProjectData 
    });

    // 후기 API mock
    cy.task('mockApiResponse', { 
      endpoint: '/api/comment/test', 
      data: mockComments 
    });

    cy.visit(`/project/${mockProjectId}`)
    cy.wait(2000)
    
    cy.contains(mockProjectData.title)
    cy.contains(mockProjectData.description)
    cy.contains('달성 금액')
    cy.contains(`${mockProjectData.totalAmount.toLocaleString()}원`)
    cy.contains(`${mockProjectData.goalAmount.toLocaleString()}원`)
    cy.contains('펀딩 마감까지 남은 시간')
    // 펀딩 마감 날짜
    const endAtStr = formatDatePad(new Date(mockProjectData.endAt))
    cy.contains(endAtStr)
    mockProjectData.imageUrls.forEach((url, idx) => {
      cy.get('[data-cy="project-image"]').should('have.attr', 'src', url)
      if (idx < mockProjectData.imageUrls.length - 1) {
        cy.get('button[aria-label="다음 이미지"]').click()
      }
    })
  })

  it('프로젝트 정보 탭에 데이터가 정상적으로 노출된다', () => {
    cy.task('resetApiMocks');
    
    // 프로젝트 상세 정보 mock
    cy.task('mockApiResponse', { 
      endpoint: `/api/project/${mockProjectId}`, 
      data: mockProjectData 
    });

    // 후기 API mock
    cy.task('mockApiResponse', { 
      endpoint: '/api/comment/test', 
      data: mockComments 
    });

    cy.visit(`/project/${mockProjectId}`)
    cy.wait(2000)
    
    cy.contains('프로젝트 정보').click()
    cy.get('[data-cy="project-info-tab"]').within(() => {
      cy.contains(`${mockProjectData.goalAmount.toLocaleString()}원`)
      // 펀딩 기간
      const startAtStr = formatDatePad(new Date(mockProjectData.startAt))
      const endAtStr = formatDatePad(new Date(mockProjectData.endAt))
      cy.contains(`${startAtStr} ~ ${endAtStr}`)
      // 결제 예정
      cy.contains('결제 예정')
      // 예상 발송 시작일
      const shippedAtStr = formatDatePad(new Date(mockProjectData.shippedAt))
      cy.contains(shippedAtStr)
      cy.contains(mockProjectData.sellerResponse.nickname)
      cy.contains(mockProjectData.sellerResponse.sellerIntroduction)
    })
  })

  it('후원 옵션(리워드)이 정상적으로 노출된다', () => {
    cy.task('resetApiMocks');
    
    // 프로젝트 상세 정보 mock
    cy.task('mockApiResponse', { 
      endpoint: `/api/project/${mockProjectId}`, 
      data: mockProjectData 
    });

    // 후기 API mock
    cy.task('mockApiResponse', { 
      endpoint: '/api/comment/test', 
      data: mockComments 
    });

    cy.visit(`/project/${mockProjectId}`)
    cy.wait(2000)
    
    // 1. 후원하기 버튼 클릭
    cy.contains('후원하기').should('exist').and('not.be.disabled').click();

    // 2. 상품(리워드) 선택
    cy.contains('테스트 리워드').click();

    // 3. 오른쪽 영역에 선택된 상품 정보가 노출되는지 확인
    cy.contains('선택된 상품').should('be.visible');
    cy.contains('테스트 리워드').should('be.visible');
    cy.contains('1개 × 10,000원 = 10,000원').should('be.visible');

    // 4. chevronRight(펼치기) 버튼 클릭 → 상세 설명 노출 확인
    cy.get('[data-cy="expand-selected-product"]').click();
    cy.contains('테스트 리워드 설명').should('be.visible');
  })

  it('프로젝트 후기 탭에 리뷰가 정상적으로 노출된다', () => {
    cy.task('resetApiMocks');
    
    // 프로젝트 상세 정보 mock
    cy.task('mockApiResponse', { 
      endpoint: `/api/project/${mockProjectId}`, 
      data: mockProjectData 
    });

    // 후기 API mock
    cy.task('mockApiResponse', { 
      endpoint: '/api/comment/test', 
      data: mockComments 
    });

    cy.visit(`/project/${mockProjectId}`)
    cy.wait(2000)
    
    cy.contains('후기').click();
    cy.get('[data-cy="review-item"]').should('have.length.at.least', 1);
    cy.get('[data-cy="review-item"]').first().within(() => {
      cy.get('[data-cy="review-username"]').should('not.be.empty');
      cy.get('[data-cy="review-content"]').should('not.be.empty');
      cy.get('[data-cy="review-date"]').should('not.be.empty');
    });
  });

  it('프로젝트 후기 탭에 리뷰가 없을 때 안내 메시지가 노출된다', () => {
    cy.task('resetApiMocks');
    
    // 프로젝트 상세 정보 mock
    cy.task('mockApiResponse', { 
      endpoint: `/api/project/${mockProjectId}`, 
      data: mockProjectData 
    });

    // 후기 API mock (빈 배열)
    cy.task('mockApiResponse', { endpoint: '/api/comment/test', data: [] });
    
    cy.visit(`/project/${mockProjectId}`)
    cy.wait(2000)
    
    // cy.reload();
    cy.contains('후기').click();
    cy.contains('아직 리뷰가 없습니다').should('be.visible');
  });

  it('프로젝트 조회 중 스켈레톤이 노출된다', () => {
    cy.task('resetApiMocks');

    cy.task('mockApiResponse', { 
      endpoint: `/api/project/${mockProjectId}`, 
      data: mockProjectData 
    });

    cy.visit(`/project/${mockProjectId}`);
    cy.get('.animate-pulse').should('exist');
  });

  it('프로젝트 조회 실패 시 에러 메시지와 다시 시도 버튼 노출', () => {
    cy.task('resetApiMocks');
    
    cy.task('mockApiErrorResponse', { 
      endpoint: `/api/project/${mockProjectId}`, 
      message: 'Internal Server Error' 
    });
    cy.visit(`/project/${mockProjectId}`);
    cy.contains('프로젝트 정보를 불러올 수 없습니다').should('be.visible');
    cy.contains('다시 시도').click();
  });

  it('이미지 캐러셀 동작 및 인덱스 버튼 클릭 시 이미지 변경', () => {
    cy.task('resetApiMocks');
    
    // 프로젝트 상세 정보 mock
    cy.task('mockApiResponse', { 
      endpoint: `/api/project/${mockProjectId}`, 
      data: mockProjectData 
    });

    // 후기 API mock
    cy.task('mockApiResponse', { 
      endpoint: '/api/comment/test', 
      data: mockComments 
    });

    cy.visit(`/project/${mockProjectId}`)
    cy.wait(2000)
    
    cy.get('[data-cy="project-image"]').first().should('have.attr', 'src', '/project-test.png');
    cy.get('button[aria-label="다음 이미지"]').click();
    cy.get('[data-cy="project-image"]').first().should('have.attr', 'src', '/project-test2.png');
  });

  it('재고가 0일 때 후원 불가 버튼이 노출된다', () => {
    cy.task('resetApiMocks');
    
    const noStockData = { 
      ...mockProjectData, 
      productResponses: [{ ...mockProjectData.productResponses[0], stock: 0 }] 
    };
    cy.task('mockApiResponse', { 
      endpoint: `/api/project/${mockProjectId}`, 
      data: noStockData 
    });
    cy.visit(`/project/${mockProjectId}`);
    cy.get('[data-cy="donate-disabled"]').should('exist').and('be.disabled');
  });

  it('펀딩 마감/종료 시 상태 메시지가 노출된다', () => {
    cy.task('resetApiMocks');
    
    const endedData = { ...mockProjectData, endAt: '2023-01-01' };
    cy.task('mockApiResponse', { 
      endpoint: `/api/project/${mockProjectId}`, 
      data: endedData 
    });
    cy.visit(`/project/${mockProjectId}`);
    cy.contains('마감임박').should('be.visible');
    cy.contains('펀딩 종료').should('be.visible');
  });
})

describe('프로젝트 상세 결제 플로우', () => {
  const mockProjectId = 'test'
  const mockProjectData = {
    id: 9999,
    title: '모킹 프로젝트',
    description: '이것은 Cypress 모킹 테스트용 프로젝트입니다.',
    goalAmount: 1000000,
    totalAmount: 500000,
    markdown: '# 상세 설명\n이 프로젝트는 테스트용입니다.',
    startAt: '2024-06-01',
    endAt: '2024-06-30',
    shippedAt: '2024-07-10',
    imageUrls: [
      "/project-test.png",
      "/project-test2.png",
      "/project-test3.png"
    ],
    sellerResponse: {
      id: 1,
      nickname: '테스트판매자',
      sellerIntroduction: '테스트 판매자 소개',
      linkUrl: 'https://test.com'
    },
    productResponses: [
      {
        id: 1,
        name: '테스트 리워드',
        description: '테스트 리워드 설명',
        price: 10000,
        stock: 10,
        options: []
      }
    ]
  }

  beforeEach(() => {
    cy.intercept({ method: 'GET', url: `/api/project/${mockProjectId}` }, {
      statusCode: 200,
      body: { ...mockProjectData }
    }).as('getProjectDetail')
    cy.intercept({ method: 'GET', url: '/api/delivery/delivery-info' }, {
      statusCode: 200,
      body: []
    }).as('getDeliveryInfo')
    cy.intercept({ method: 'POST', url: '/api/order' }, { 
      orderId: 123, 
      totalPrice: 10000, 
      orderedAt: '2024-07-01', 
      items: [{ productId: 1, productName: '테스트 리워드', quantity: 1, price: 10000 }] 
    }).as('order')
    cy.intercept({ method: 'POST', url: '/api/payment/ready/*' }, { 
      next_redirect_pc_url: 'https://pay.test', 
      tid: 'TID123' 
    }).as('paymentReady')
    cy.visit('/project/test')
    cy.wait('@getProjectDetail')
  })

  it('필수값 누락 시 Alert 노출', () => {
    cy.contains('후원하기').click()
    // 상품 미선택 상태: 다음 단계 버튼이 비활성화
    cy.get('[data-cy="donate-next-step"]').should('be.disabled')

    // 상품 선택 후 다음 단계로 이동
    cy.contains('테스트 리워드').click()
    cy.get('[data-cy="donate-next-step"]').should('not.be.disabled').click()
    cy.wait('@getDeliveryInfo')

    // 결제수단/배송지 모두 미선택 상태에서 후원하기 클릭
    cy.get('[data-cy="donate-submit"]').click()
    cy.contains('결제 수단을 선택해주세요.').should('be.visible')
    // 모달의 확인 버튼 클릭
    cy.contains('확인').click()

    // 결제수단만 선택하고 후원하기 클릭
    cy.get('[data-cy="pay-kakaopay"]').click()
    cy.get('[data-cy="donate-submit"]').click()
    cy.contains('배송지를 선택해주세요.').should('be.visible')
    // 모달의 확인 버튼 클릭
    cy.contains('확인').click()
  })

  it('정상 결제 플로우', () => {
    cy.intercept({ method: 'GET', url: '/api/delivery/delivery-info' }, {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: '테스트 배송지',
          address: '서울특별시 중구 세종대로 3',
          detailAddress: '신규 404호',
          zipcode: '12345',
          isDefault: true
        }
      ]
    }).as('getDeliveryInfo')
    cy.intercept({
      method: "POST",
      url: "/api/delivery/delivery-info"
    }, {
      statusCode: 200
    }).as("addAddress")

    cy.contains('후원하기').click()
    cy.contains('테스트 리워드').click()
    cy.get('[data-cy="donate-next-step"]').click()
    cy.wait('@getDeliveryInfo')

    // 결제수단 선택
    cy.get('[data-cy="pay-kakaopay"]').click()

    // 배송지 추가 버튼 클릭
    cy.contains('배송지 추가').click()
    // 새 배송지 입력
    cy.get('input[placeholder="\'찾기\'를 눌러서 주소 입력"]').invoke('val', '서울특별시 중구 세종대로 3').trigger('input')
    cy.get('input[placeholder="상세 주소 입력"]').type('신규 404호')
    cy.contains('찾기').click()

    // 새 배송지 카드가 나타나면 선택
    // cy.get('[data-cy^="address-card-"]').last().click()
    cy.get('[data-cy="address-search-modal"]').should('be.visible').as('addressSearchModal')
    cy.get('[data-cy="mock-postcode"]').should('be.visible').click()
    cy.contains('저장').click()

    // 결제 버튼 클릭 및 결제 플로우 진행
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen')
    })
    
    cy.get('[data-cy="donate-submit"]').click()
    cy.wait('@order')
    cy.wait('@paymentReady')
    cy.get('@windowOpen').should('be.calledWithMatch', 'https://pay.test')
  })

  it('옵션 해제, 수량 증감, 결제 금액 변화가 정상 동작한다', () => {
    cy.contains('후원하기').click();
    cy.contains('테스트 리워드').click();
    // 오른쪽 영역에 선택된 상품이 보이는지 검증
    cy.get('[data-cy="expand-selected-product"]').should('be.visible');
    cy.contains('테스트 리워드').should('exist');
    cy.get('button').contains('+').click();
    cy.contains('20,000원').should('exist');
    cy.get('button').contains('-').click();
    cy.contains('10,000원').should('exist');
    cy.contains('테스트 리워드').click();
    cy.get('[data-cy="expand-selected-product"]').should('not.exist');
  });
})
