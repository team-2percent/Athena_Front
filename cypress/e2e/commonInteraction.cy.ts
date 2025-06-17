describe('공통 상호작용', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('로고 클릭 시 메인 페이지로 이동', () => {
    cy.get('[data-cy="logo-link"]').filter(':visible').click();
    cy.url().should('eq', 'http://localhost:3000/');
  });

  it('검색바 입력 및 검색 버튼/엔터 동작', () => {
    cy.get('[data-cy="search-input"]').type('테스트');
    cy.get('[data-cy="search-button"]').click();
    cy.url().should('include', `/search?query=${encodeURIComponent('테스트')}`);
    cy.visit('/');
    cy.get('[data-cy="search-input"]').type('엔터검색{enter}');
    cy.url().should('include', `/search?query=${encodeURIComponent('엔터검색')}`);
  });

  it('검색바에 아무것도 없으면 검색 버튼 disabled', () => {
    cy.get('[data-cy="search-input"]').clear();
    cy.get('[data-cy="search-button"]').should('be.disabled');
  });

  it('검색바 최대 입력 길이 확인', () => {
    cy.get('[data-cy="search-input"]').type('A'.repeat(21));
    cy.get('[data-cy="search-input"]').invoke('val').should('have.length.lte', 20);
  });

  it('로그인/회원가입 버튼 존재 및 클릭 시 모달 노출', () => {
    cy.get('[data-cy="open-login-modal-button"]').should('be.visible').click();
    cy.get('[data-cy="login-modal"]').should('be.visible');
    cy.get('[data-cy="modal-close-button"]').click();
    cy.get('[data-cy="open-signup-modal-button"]').should('be.visible').click();
    cy.get('[data-cy="signup-modal"]').should('be.visible');
  });

  it('상단 메뉴탭(전체/카테고리/신규/마감임박) 활성화 및 이동', () => {
    const tabs = [
      { label: '전체', url: '/' },
      { label: '카테고리', url: '/category' },
      { label: '신규', url: '/new' },
      { label: '마감임박', url: '/deadline' }
    ];
    tabs.forEach(tab => {
      cy.get(`[data-cy="menu-tab-${tab.label}"]`).click();
      cy.url().should('include', tab.url);
      cy.get(`[data-cy="menu-tab-${tab.label}"]`).should('have.class', 'text-main-color');
      cy.visit('/');
    });
  });
})