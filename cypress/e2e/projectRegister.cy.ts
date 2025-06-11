import { VALIDATION_MESSAGES } from '../../src/lib/validationMessages';

// 프로젝트 등록 플로우 E2E 테스트
// 실제 백엔드와 연동되는 환경에서 동작하도록 intercept/mock 최소화
// cypress-file-upload 플러그인 필요 (support/e2e.ts에 import 필요)

function selectDynamicDates(startOffset = 7, endOffset = 14, deliveryOffset = 21) {
  const today = new Date();
  const startDate = new Date(today); startDate.setDate(today.getDate() + startOffset);
  const endDate = new Date(today); endDate.setDate(today.getDate() + endOffset);
  const deliveryDate = new Date(today); deliveryDate.setDate(today.getDate() + deliveryOffset);

  cy.get('[data-cy="datepicker-start"]').click();
  cy.get('button')
  .filter(`:contains(${startDate.getDate().toString()})`)     
  .not(':disabled')                    
  .first()                              
  .click();
  cy.get('[data-cy="datepicker-end"]').click();
  cy.get('button')
  .filter(`:contains(${endDate.getDate().toString()})`)     
  .not(':disabled')                    
  .first()                              
  .click();
  cy.get('[data-cy="datepicker-delivery"]').click();
  cy.get('button')
  .filter(`:contains(${deliveryDate.getDate().toString()})`)     
  .not(':disabled')                    
  .first()                              
  .click();
}

describe('프로젝트 등록 플로우', () => {
  beforeEach(() => {
    cy.intercept({
      method: "GET",
      url: '/api/project'
    }, {
      statusCode: 200,
      body: 100
    }).as('getProject');

    cy.fixture('category.json').then((category) => {
      cy.intercept({
        method: "GET",
        url: '/api/category'
      }, {
        statusCode: 200,
        body: category
      }).as('getCategory');
    })

    cy.fixture('bankAccount.json').then((bankAccount) => {
      cy.intercept({
        method: "GET",
        url: '/api/bankAccount'
      }, {
        statusCode: 200,
        body: bankAccount
      }).as('getBankAccount');
    })

    // 로그인 모킹: accessToken, userId 세팅 및 fcm/register intercept
    // cy.intercept({
    //   method: "POST",
    //   url: "/api/fcm/register"
    // });
    // // 계좌 정보가 없는 상태를 보장
    // cy.intercept('GET', '/api/bankAccount', {
    //   statusCode: 200,
    //   body: [],
    // }).as('getBankAccount');
    
    // cy.window().then((win) => {
    //   win.localStorage.setItem('accessToken', "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NyIsInJvbGUiOiJST0xFX1VTRVIiLCJuaWNrbmFtZSI6IuqwgOyehe2FjOyKpO2KuCIsImlhdCI6MTc0ODk2ODQ0MSwiZXhwIjoxNzQ5NTczMjQxfQ.8QkpyGU8Mf9Mh2xSTzlmHCapyxQZONR81ZHcv_GQ2b4");
    //   win.localStorage.setItem('userId', "57");
    // });
    cy.visitMainPage();
    cy.login();

    cy.visit('/project/register');
    cy.wait('@getCategory').its('response.statusCode').should('eq', 200);
    cy.wait('@getProject').its('response.statusCode').should('eq', 200);
  });

  it('프로젝트 등록 성공 케이스', () => {
    // 1단계: 기본 정보 입력
    cy.contains('카테고리를 선택해주세요').click();
    cy.contains('디지털').click();

    cy.get('input#title').type('E2E 테스트 프로젝트');
    cy.get('[data-cy="project-description"]').type('이것은 Cypress E2E 테스트용 프로젝트입니다.');

    // 대표 이미지 업로드 (fixtures 폴더에 test.jpg 필요)
    cy.get('input[type="file"]').first().selectFile('cypress/fixtures/example.jpg', { force: true });

    cy.get('input#targetAmount').clear().type('1000000');

    // 날짜 동적 계산
    selectDynamicDates();

    cy.contains('다음 단계로').click();

    // 2단계: 상세 설명(마크다운) 입력
    cy.get('textarea').type('상세 설명 마크다운 입력 E2E 테스트');
    cy.contains('다음 단계로').click();
    
    // 3단계: 후원 옵션 및 계좌 입력
    cy.contains('상품 추가').click();
    cy.get('input[placeholder="상품 이름을 지어주세요."]').type('테스트 리워드');
    cy.get('input[placeholder="해당 옵션을 자세히 설명해 주세요."]').type('테스트 리워드 설명');
    cy.get('input[placeholder="0"]').first().type('5000'); // 가격
    cy.get('input[placeholder="0"]').eq(1).type('100'); // 수량

    // 플랜 선택 (Basic 플랜)
    cy.contains('선택하기').eq(0).click(); // Basic 플랜

    // 계좌가 이미 있다면 선택, 없으면 계좌 추가(실제 서비스 상황에 맞게 조정)
    cy.contains('계좌 추가하기').click();
    cy.get('input[placeholder="예금주 이름을 입력하세요"]').type('홍길동');
    cy.get('input[placeholder="은행명을 입력하세요"]').type('국민은행');
    cy.get('input[placeholder="계좌번호를 입력하세요 (\'-\' 없이 숫자만)"]').type('1234567890');
    cy.get('[data-cy="add-account-modal"]').should('be.visible').within(() => {
      cy.contains('추가하기').click();
    });

    // 등록 버튼 클릭
    cy.contains('등록').click();
    cy.contains('프로젝트 등록 확인').should('be.visible');
    cy.contains('등록하기').scrollIntoView().should('be.visible');
    // cy.contains('등록하기').click();

    // // 성공 모달 확인 및 마이페이지 이동
    // cy.contains('상품이 성공적으로 등록되었습니다.').should('be.visible');
    // cy.contains('확인').click();

    // // 마이페이지에서 등록된 프로젝트 확인 (옵션)
    // cy.url().should('include', '/my');
    // cy.contains('E2E 테스트 프로젝트').should('be.visible');
  });

  it('필수 항목 누락 시 등록 불가 케이스', () => {
    // 1단계: 기본 정보 입력 (상품 제목은 입력하지 않음)
    cy.contains('카테고리를 선택해주세요').click();
    cy.contains('디지털').click();

    // cy.get('input#title').type('E2E 테스트 프로젝트'); // 상품 제목 미입력
    cy.get('[data-cy="project-description"]').type('이것은 Cypress E2E 테스트용 프로젝트입니다.');

    cy.get('input[type="file"]').first().selectFile('cypress/fixtures/example.jpg', { force: true });
    cy.get('input#targetAmount').clear().type('1000000');

    selectDynamicDates();

    cy.contains('다음 단계로').click();

    // 2단계: 상세 설명(마크다운) 입력
    cy.get('textarea').type('상세 설명 마크다운 입력 E2E 테스트');
    cy.get('textarea').type('{selectall}{backspace}');
    cy.contains('다음 단계로').click();
    
    // 3단계: 후원 옵션 및 계좌 입력
    cy.contains('상품 추가').click();
    cy.get('input[placeholder="상품 이름을 지어주세요."]').type('테스트 리워드');
    cy.get('input[placeholder="해당 옵션을 자세히 설명해 주세요."]').type('테스트 리워드 설명');
    cy.get('input[placeholder="0"]').first().type('5000');
    cy.get('input[placeholder="0"]').eq(1).type('100');

    cy.contains('선택하기').eq(0).click(); // Basic 플랜

    // 등록 버튼 클릭
    cy.contains('등록').click();
    cy.contains('프로젝트 등록 확인').should('be.visible');
    cy.contains('미완료 항목 있음').scrollIntoView().should('be.visible');
  });

  it('상품 제목 누락 시 붉은색 X 아이콘 표시', () => {
    cy.contains('카테고리를 선택해주세요').click();
    cy.contains('디지털').click();
    // cy.get('input#title').type('E2E 테스트 프로젝트'); // 상품 제목 미입력
    cy.get('[data-cy="project-description"]').type('이것은 Cypress E2E 테스트용 프로젝트입니다.');
    cy.get('input[type="file"]').first().selectFile('cypress/fixtures/example.jpg', { force: true });
    cy.get('input#targetAmount').clear().type('1000000');
    selectDynamicDates();
    cy.contains('다음 단계로').click();
    cy.get('textarea').type('상세 설명 마크다운 입력 E2E 테스트');
    cy.get('textarea').type('{selectall}{backspace}');
    cy.contains('다음 단계로').click();
    cy.contains('상품 추가').click();
    cy.get('input[placeholder="상품 이름을 지어주세요."]').type('테스트 리워드');
    cy.get('input[placeholder="해당 옵션을 자세히 설명해 주세요."]').type('테스트 리워드 설명');
    cy.get('input[placeholder="0"]').first().type('5000');
    cy.get('input[placeholder="0"]').eq(1).type('100');
    cy.contains('선택하기').eq(0).click();
    cy.contains('등록').click();
    cy.get('[data-cy="validation-modal"]').should('be.visible').within(() => {
      cy.contains('상품 제목').parent().should('have.class', 'bg-red-50').within(() => {
        cy.get('svg').should('exist');
      });
    });
  });

  it('목표 금액 누락 시 붉은색 X 아이콘 표시', () => {
    cy.contains('카테고리를 선택해주세요').click();
    cy.contains('디지털').click();
    cy.get('input#title').type('E2E 테스트 프로젝트');
    cy.get('[data-cy="project-description"]').type('이것은 Cypress E2E 테스트용 프로젝트입니다.');
    cy.get('input[type="file"]').first().selectFile('cypress/fixtures/example.jpg', { force: true });
    // cy.get('input#targetAmount').clear().type('1000000'); // 목표 금액 미입력
    selectDynamicDates();
    cy.contains('다음 단계로').click();
    cy.get('textarea').type('상세 설명 마크다운 입력 E2E 테스트');
    cy.get('textarea').type('{selectall}{backspace}');
    cy.contains('다음 단계로').click();
    cy.contains('상품 추가').click();
    cy.get('input[placeholder="상품 이름을 지어주세요."]').type('테스트 리워드');
    cy.get('input[placeholder="해당 옵션을 자세히 설명해 주세요."]').type('테스트 리워드 설명');
    cy.get('input[placeholder="0"]').first().type('5000');
    cy.get('input[placeholder="0"]').eq(1).type('100');
    cy.contains('선택하기').eq(0).click();
    cy.contains('등록').click();
    cy.get('[data-cy="validation-modal"]').should('be.visible').within(() => {
      cy.contains('목표 금액').parent().should('have.class', 'bg-red-50').within(() => {
        cy.get('svg').should('exist');
      });
    });
  });

  it('펀딩 시작일 누락 시 붉은색 X 아이콘 표시', () => {
    cy.contains('카테고리를 선택해주세요').click();
    cy.contains('디지털').click();
    cy.get('input#title').type('E2E 테스트 프로젝트');
    cy.get('[data-cy="project-description"]').type('이것은 Cypress E2E 테스트용 프로젝트입니다.');
    cy.get('input[type="file"]').first().selectFile('cypress/fixtures/example.jpg', { force: true });
    cy.get('input#targetAmount').clear().type('1000000');

    // 펀딩 시작일은 입력하지 않음
    // 종료일과 배송 예정일만 동적으로 입력
    const today = new Date();
    const endDate = new Date(today); endDate.setDate(today.getDate() + 14);
    const deliveryDate = new Date(today); deliveryDate.setDate(today.getDate() + 21);

    cy.get('[data-cy="datepicker-end"]').click();
    cy.contains(endDate.getDate().toString()).click();
    cy.get('[data-cy="datepicker-delivery"]').click();
    cy.contains(deliveryDate.getDate().toString()).click();

    cy.contains('다음 단계로').click();
    cy.get('textarea').type('상세 설명 마크다운 입력 E2E 테스트');
    cy.get('textarea').type('{selectall}{backspace}');
    cy.contains('다음 단계로').click();
    cy.contains('상품 추가').click();
    cy.get('input[placeholder="상품 이름을 지어주세요."]').type('테스트 리워드');
    cy.get('input[placeholder="해당 옵션을 자세히 설명해 주세요."]').type('테스트 리워드 설명');
    cy.get('input[placeholder="0"]').first().type('5000');
    cy.get('input[placeholder="0"]').eq(1).type('100');
    cy.contains('선택하기').eq(0).click();
    cy.contains('등록').click();
    cy.get('[data-cy="validation-modal"]').should('be.visible').within(() => {
      cy.contains('펀딩 시작일').parent().should('have.class', 'bg-red-50').within(() => {
        cy.get('svg').should('exist');
      });
    });
  });

//   it('펀딩 종료일 누락 시 붉은색 X 아이콘 표시', () => {
//     cy.contains('카테고리를 선택해주세요').click();
//     cy.contains('디지털').click();
//     cy.get('input#title').type('E2E 테스트 프로젝트');
//     cy.get('textarea#description').type('이것은 Cypress E2E 테스트용 프로젝트입니다.');
//     cy.get('input[type="file"]').first().selectFile('cypress/fixtures/example.jpg', { force: true });
//     cy.get('input#targetAmount').clear().type('1000000');
//     cy.get('[data-cy="datepicker-start"]').click();
//     cy.get('button').contains('12').click();
//     // cy.get('[data-cy="datepicker-end"]').click();
//     // cy.get('button').contains('19').click(); // 펀딩 종료일 미입력
//     cy.get('[data-cy="datepicker-delivery"]').click();
//     cy.get('button').contains('26').click();
//     cy.contains('다음 단계로').click();
//     cy.get('textarea').type('상세 설명 마크다운 입력 E2E 테스트');
//     cy.contains('다음 단계로').click();
//     cy.contains('상품 추가').click();
//     cy.get('input[placeholder="상품 이름을 지어주세요."]').type('테스트 리워드');
//     cy.get('input[placeholder="해당 옵션을 자세히 설명해 주세요."]').type('테스트 리워드 설명');
//     cy.get('input[placeholder="0"]').first().type('5000');
//     cy.get('input[placeholder="0"]').eq(1).type('100');
//     cy.contains('선택하기').eq(0).click();
//     cy.contains('등록').click();
//     cy.contains('프로젝트 등록 확인').should('be.visible');
//     cy.contains('펀딩 종료일').parent().should('have.class', 'bg-red-50').within(() => {
//       cy.get('svg').should('exist');
//     });
//   });

//   it('배송 예정일 누락 시 붉은색 X 아이콘 표시', () => {
//     cy.contains('카테고리를 선택해주세요').click();
//     cy.contains('디지털').click();
//     cy.get('input#title').type('E2E 테스트 프로젝트');
//     cy.get('textarea#description').type('이것은 Cypress E2E 테스트용 프로젝트입니다.');
//     cy.get('input[type="file"]').first().selectFile('cypress/fixtures/example.jpg', { force: true });
//     cy.get('input#targetAmount').clear().type('1000000');
//     cy.get('[data-cy="datepicker-start"]').click();
//     cy.get('button').contains('12').click();
//     cy.get('[data-cy="datepicker-end"]').click();
//     cy.get('button').contains('19').click();
//     // cy.get('[data-cy="datepicker-delivery"]').click();
//     // cy.get('button').contains('26').click(); // 배송 예정일 미입력
//     cy.contains('다음 단계로').click();
//     cy.get('textarea').type('상세 설명 마크다운 입력 E2E 테스트');
//     cy.contains('다음 단계로').click();
//     cy.contains('상품 추가').click();
//     cy.get('input[placeholder="상품 이름을 지어주세요."]').type('테스트 리워드');
//     cy.get('input[placeholder="해당 옵션을 자세히 설명해 주세요."]').type('테스트 리워드 설명');
//     cy.get('input[placeholder="0"]').first().type('5000');
//     cy.get('input[placeholder="0"]').eq(1).type('100');
//     cy.contains('선택하기').eq(0).click();
//     cy.contains('등록').click();
//     cy.contains('프로젝트 등록 확인').should('be.visible');
//     cy.contains('배송 예정일').parent().should('have.class', 'bg-red-50').within(() => {
//       cy.get('svg').should('exist');
//     });
//   });

  it('대표 이미지 누락 시 붉은색 X 아이콘 표시', () => {
    cy.contains('카테고리를 선택해주세요').click();
    cy.contains('디지털').click();
    cy.get('input#title').type('E2E 테스트 프로젝트');
    cy.get('[data-cy="project-description"]').type('이것은 Cypress E2E 테스트용 프로젝트입니다.');
    // cy.get('input[type="file"]').first().selectFile('cypress/fixtures/example.jpg', { force: true }); // 대표 이미지 미입력
    cy.get('input#targetAmount').clear().type('1000000');
    selectDynamicDates();
    cy.contains('다음 단계로').click();
    cy.get('textarea').type('상세 설명 마크다운 입력 E2E 테스트');
    cy.get('textarea').type('{selectall}{backspace}');
    cy.contains('다음 단계로').click();
    cy.contains('상품 추가').click();
    cy.get('input[placeholder="상품 이름을 지어주세요."]').type('테스트 리워드');
    cy.get('input[placeholder="해당 옵션을 자세히 설명해 주세요."]').type('테스트 리워드 설명');
    cy.get('input[placeholder="0"]').first().type('5000');
    cy.get('input[placeholder="0"]').eq(1).type('100');
    cy.contains('선택하기').eq(0).click();
    cy.contains('등록').click();
    cy.get('[data-cy="validation-modal"]').should('be.visible').within(() => {
      cy.contains('대표 이미지').parent().should('have.class', 'bg-red-50').within(() => {
        cy.get('svg').should('exist');
      });
    });
  });

  it('상품 상세 설명 누락 시 붉은색 X 아이콘 표시', () => {
    cy.contains('카테고리를 선택해주세요').click();
    cy.contains('디지털').click();
    cy.get('input#title').type('E2E 테스트 프로젝트');
    cy.get('[data-cy="project-description"]').type('이것은 Cypress E2E 테스트용 프로젝트입니다.');
    cy.get('input[type="file"]').first().selectFile('cypress/fixtures/example.jpg', { force: true });
    cy.get('input#targetAmount').clear().type('1000000');
    selectDynamicDates();
    cy.contains('다음 단계로').click();
    // cy.get('textarea').type('상세 설명 마크다운 입력 E2E 테스트'); // 상세 설명 미입력
    cy.get('textarea').type('상세 설명 마크다운 입력 E2E 테스트');
    cy.get('textarea').type('{selectall}{backspace}');
    cy.contains('다음 단계로').click();
    cy.contains('상품 추가').click();
    cy.get('input[placeholder="상품 이름을 지어주세요."]').type('테스트 리워드');
    cy.get('input[placeholder="해당 옵션을 자세히 설명해 주세요."]').type('테스트 리워드 설명');
    cy.get('input[placeholder="0"]').first().type('5000');
    cy.get('input[placeholder="0"]').eq(1).type('100');
    cy.contains('선택하기').eq(0).click();
    cy.contains('등록').click();
    cy.get('[data-cy="validation-modal"]').should('be.visible').within(() => {
      cy.contains('상품 상세 설명').parent().should('have.class', 'bg-red-50').within(() => {
        cy.get('svg').should('exist');
      });
    });
  });

  it('후원 상품 설정 누락 시 붉은색 X 아이콘 표시', () => {
    cy.contains('카테고리를 선택해주세요').click();
    cy.contains('디지털').click();
    cy.get('input#title').type('E2E 테스트 프로젝트');
    cy.get('[data-cy="project-description"]').type('이것은 Cypress E2E 테스트용 프로젝트입니다.');
    cy.get('input[type="file"]').first().selectFile('cypress/fixtures/example.jpg', { force: true });
    cy.get('input#targetAmount').clear().type('1000000');
    selectDynamicDates();
    cy.contains('다음 단계로').click();
    cy.get('textarea').type('상세 설명 마크다운 입력 E2E 테스트');
    cy.get('textarea').type('{selectall}{backspace}');
    cy.contains('다음 단계로').click();
    // cy.contains('상품 추가').click(); // 후원 상품 미입력
    // cy.get('input[placeholder="상품 이름을 지어주세요."]').type('테스트 리워드');
    // cy.get('input[placeholder="해당 옵션을 자세히 설명해 주세요."]').type('테스트 리워드 설명');
    // cy.get('input[placeholder="0"]').first().type('5000');
    // cy.get('input[placeholder="0"]').eq(1).type('100');
    cy.contains('선택하기').eq(0).click();
    cy.contains('등록').click();
    cy.get('[data-cy="validation-modal"]').should('be.visible').within(() => {
      cy.contains('후원 상품 설정').parent().should('have.class', 'bg-red-50').within(() => {
        cy.get('svg').should('exist');
      });
    });
  });

  it('플랜 선택 누락 시 붉은색 X 아이콘 표시', () => {
    cy.contains('카테고리를 선택해주세요').click();
    cy.contains('디지털').click();
    cy.get('input#title').type('E2E 테스트 프로젝트');
    cy.get('[data-cy="project-description"]').type('이것은 Cypress E2E 테스트용 프로젝트입니다.');
    cy.get('input[type="file"]').first().selectFile('cypress/fixtures/example.jpg', { force: true });
    cy.get('input#targetAmount').clear().type('1000000');
    selectDynamicDates();
    cy.contains('다음 단계로').click();
    cy.get('textarea').type('상세 설명 마크다운 입력 E2E 테스트');
    cy.get('textarea').type('{selectall}{backspace}');
    cy.contains('다음 단계로').click();
    cy.contains('상품 추가').click();
    cy.get('input[placeholder="상품 이름을 지어주세요."]').type('테스트 리워드');
    cy.get('input[placeholder="해당 옵션을 자세히 설명해 주세요."]').type('테스트 리워드 설명');
    cy.get('input[placeholder="0"]').first().type('5000');
    cy.get('input[placeholder="0"]').eq(1).type('100');
    // cy.contains('선택하기').eq(0).click(); // 플랜 선택 미입력
    cy.contains('등록').click();
    cy.get('[data-cy="validation-modal"]').should('be.visible').within(() => {
      cy.contains('플랜 선택').parent().should('have.class', 'bg-red-50').within(() => {
        cy.get('svg').should('exist');
      });
    });
  });

  it('계좌 정보 누락 시 붉은색 X 아이콘 표시', () => {
    cy.intercept({
      method: "GET",
      url: '/api/bankAccount'
    }, {
      statusCode: 200,
      body: []
    }).as('getBankAccount');

    cy.contains('카테고리를 선택해주세요').click();
    cy.contains('디지털').click();
    cy.get('input#title').type('E2E 테스트 프로젝트');
    cy.get('[data-cy="project-description"]').type('이것은 Cypress E2E 테스트용 프로젝트입니다.');
    cy.get('input[type="file"]').first().selectFile('cypress/fixtures/example.jpg', { force: true });
    cy.get('input#targetAmount').clear().type('1000000');
    selectDynamicDates();
    cy.contains('다음 단계로').click();
    cy.get('textarea').type('상세 설명 마크다운 입력 E2E 테스트');
    cy.get('textarea').type('{selectall}{backspace}');
    cy.contains('다음 단계로').click();
    cy.wait('@getBankAccount').its('response.statusCode').should('eq', 200);
    cy.contains('상품 추가').click();
    cy.get('input[placeholder="상품 이름을 지어주세요."]').type('테스트 리워드');
    cy.get('input[placeholder="해당 옵션을 자세히 설명해 주세요."]').type('테스트 리워드 설명');
    cy.get('input[placeholder="0"]').first().type('5000');
    cy.get('input[placeholder="0"]').eq(1).type('100');
    cy.contains('선택하기').eq(0).click();
    // 계좌 정보 미입력: 실제로 계좌가 없으면 추가하지 않음(상황에 따라 조정)
    // cy.contains('계좌 추가하기').click(); ...
    cy.contains('등록').click();
    cy.get('[data-cy="validation-modal"]').should('be.visible').within(() => {
      cy.contains('계좌 정보').parent().should('have.class', 'bg-red-50').within(() => {
        cy.get('svg').should('exist');
      });
    });
  });

  // 펀딩 종료일 자동 채우기: 시작일만 입력해도 종료일은 체크(v) 표시가 나와야 함
  it('펀딩 시작일만 입력해도 펀딩 종료일이 체크 표시가 나와야 함', () => {
    cy.contains('카테고리를 선택해주세요').click();
    cy.contains('디지털').click();
    // 나머지 입력 없이 펀딩 시작일만 입력
    selectDynamicDates();
    cy.contains('다음 단계로').click();
    cy.contains('다음 단계로').click();
    cy.contains('등록').click();
    cy.contains('프로젝트 등록 확인').should('be.visible');
    cy.contains('펀딩 종료일').parent().should('not.have.class', 'bg-red-50');
    cy.contains('펀딩 종료일').parent().find('svg').should('exist');
  });

  // 배송 예정일 자동 채우기: 종료일만 입력해도 배송 예정일은 체크(v) 표시가 나와야 함
  it('펀딩 종료일만 입력해도 배송 예정일이 체크 표시가 나와야 함', () => {
    cy.contains('카테고리를 선택해주세요').click();
    cy.contains('디지털').click();
    // 나머지 입력 없이 펀딩 종료일만 입력
    selectDynamicDates();
    cy.contains('다음 단계로').click();
    cy.contains('다음 단계로').click();
    cy.contains('등록').click();
    cy.contains('프로젝트 등록 확인').should('be.visible');
    cy.contains('배송 예정일').parent().should('not.have.class', 'bg-red-50');
    cy.contains('배송 예정일').parent().find('svg').should('exist');
  });
});

describe('프로젝트 입력란 유효성 검사', () => {
  beforeEach(() => {
    cy.intercept({
      method: "GET",
      url: '/api/project'
    }, {
      statusCode: 200,
      body: 100
    }).as('getProject');

    cy.fixture('category.json').then((category) => {
      cy.intercept({
        method: "GET",
        url: '/api/category'
      }, {
        statusCode: 200,
        body: category
      }).as('getCategory');
    })
    // 로그인 모킹: accessToken, userId 세팅 및 fcm/register intercept
    // cy.intercept({
    //   method: "POST",
    //   url: "/api/fcm/register"
    // });
    // // 계좌 정보가 없는 상태를 보장
    // cy.intercept('GET', '/api/bankAccount', {
    //   statusCode: 200,
    //   body: [],
    // }).as('getBankAccount');
    
    // cy.window().then((win) => {
    //   win.localStorage.setItem('accessToken', "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NyIsInJvbGUiOiJST0xFX1VTRVIiLCJuaWNrbmFtZSI6IuqwgOyehe2FjOyKpO2KuCIsImlhdCI6MTc0ODk2ODQ0MSwiZXhwIjoxNzQ5NTczMjQxfQ.8QkpyGU8Mf9Mh2xSTzlmHCapyxQZONR81ZHcv_GQ2b4");
    //   win.localStorage.setItem('userId', "57");
    // });
    cy.visitMainPage();
    cy.login();

    cy.visit('/project/register');
    cy.wait('@getCategory').its('response.statusCode').should('eq', 200);
    cy.wait('@getProject').its('response.statusCode').should('eq', 200);
  });

  describe('상품 제목', () => {
    it('최초 입력 후 빈 칸으로 만들 시 에러 메시지 노출', () => {
      cy.get('input#title').clear().type('A').clear();
      cy.contains(VALIDATION_MESSAGES.REQUIRED_TITLE).should('be.visible');
    });
    it('25자 초과 입력 시 에러 메시지 노출', () => {
      cy.get('input#title').clear().type('A'.repeat(26));
      cy.contains(VALIDATION_MESSAGES.TITLE_MAX).should('be.visible');
    });
    it('1글자 입력 시 에러 메시지 미노출', () => {
      cy.get('input#title').clear().type('A');
      cy.contains(VALIDATION_MESSAGES.REQUIRED_TITLE).should('not.exist');
    });
    it('정상 입력(여러 글자) 시 에러 메시지 미노출', () => {
      cy.get('input#title').clear().type('정상 제목');
      cy.contains(VALIDATION_MESSAGES.REQUIRED_TITLE).should('not.exist');
      cy.contains(VALIDATION_MESSAGES.TITLE_MAX).should('not.exist');
    });
  });

  describe('상품 요약', () => {
    it('10자 미만 입력 시 에러 메시지 노출', () => {
      cy.get('[data-cy="project-description"]').type('짧다');
      cy.contains(VALIDATION_MESSAGES.DESCRIPTION_MIN).should('be.visible');
    });
    it('50자 초과 입력 시 에러 메시지 노출', () => {
      cy.get('[data-cy="project-description"]').type('A'.repeat(51));
      cy.contains(VALIDATION_MESSAGES.DESCRIPTION_MAX).should('be.visible');
    });
    it('정상 입력 시 에러 메시지 미노출', () => {
      cy.get('[data-cy="project-description"]').type('이것은 정상적인 상품 요약입니다.');
      cy.contains(VALIDATION_MESSAGES.DESCRIPTION_MIN).should('not.exist');
      cy.contains(VALIDATION_MESSAGES.DESCRIPTION_MAX).should('not.exist');
    });
  });

  describe('목표 금액', () => {
    it('1자 미만 입력 시 에러 메시지 노출', () => {
      cy.get('input#targetAmount').clear().type('1').clear();
      cy.contains(VALIDATION_MESSAGES.REQUIRED_TARGET_AMOUNT).should('be.visible');
    });
    it('10억원 초과 입력 시 에러 메시지 노출', () => {
      cy.get('input#targetAmount').clear().type('1000000001');
      cy.contains(VALIDATION_MESSAGES.TARGET_AMOUNT_MAX).should('be.visible');
    });
    it('정상 입력(1~10억원) 시 에러 메시지 미노출', () => {
      cy.get('input#targetAmount').clear().type('1000000');
      cy.contains(VALIDATION_MESSAGES.REQUIRED_TARGET_AMOUNT).should('not.exist');
      cy.contains(VALIDATION_MESSAGES.TARGET_AMOUNT_MAX).should('not.exist');
    });
  });
});
 