describe('프로필 상세 페이지', () => {
  const userId = 99;
  const profileUrl = `/profile/${userId}`;

  beforeEach(() => {
    cy.intercept({ method: 'GET', url: `/api/user/${userId}` }, { fixture: 'profile/user.json' }).as('getUser');
    cy.intercept({ method: 'GET', url: `/api/user/${userId}/project` }, { fixture: 'profile/projectList.json' }).as('getUserProjects');
  });

  describe('프로필 헤더', () => {
    it('프로필 조회 로딩', () => {
      cy.intercept({ method: 'GET', url: `/api/user/${userId}` }, (req) => new Promise(resolve => {
        setTimeout(() => {
          req.reply({ fixture: 'profile/user.json' });
          resolve();
        }, 1000);
      })).as('getUserDelay');
      cy.visit(profileUrl);
      cy.get('.animate-pulse').should('exist');
      cy.wait('@getUserDelay');
    });
    it('프로필 조회 성공', () => {
      cy.visit(profileUrl);
      cy.wait('@getUser');
      cy.get('[data-cy="profile-header"]').should('be.visible');
      cy.get('[data-cy="profile-image"]').should('be.visible');
      cy.get('[data-cy="profile-nickname"]').should('be.visible');
    });
    it('서버에러로 인한 프로필 조회 실패', () => {
      cy.intercept({ method: 'GET', url: `/api/user/${userId}` }, { statusCode: 500 }).as('getUserError');
      cy.visit(profileUrl);
      cy.contains('프로필 정보를 불러오는 중 오류가 발생했습니다.').should('be.visible');
    });
  });

  describe('메뉴 탭', () => {
    it('탭 메뉴 확인', () => {
      cy.visit(profileUrl);
      ['소개', '판매 상품', '후기'].forEach(tab => {
        cy.get('[data-cy="menu-tab"]').get(`[data-cy="menu-tab-${tab}"]`).click();
        cy.get(`[data-cy="menu-tab-${tab}"]`).should('have.class', 'text-main-color');
      });
    });
  });

  describe('소개 탭', () => {
    it('소개 조회 로딩', () => {
      cy.intercept({ method: 'GET', url: `/api/user/${userId}` }, (req) => new Promise(resolve => {
        setTimeout(() => {
          req.reply({ fixture: 'profile/user.json' });
          resolve();
        }, 1000);
      })).as('getUserDelay');
      cy.visit(profileUrl);
      cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-소개"]').click();
      cy.get('.animate-pulse').should('exist');
      cy.wait('@getUserDelay');
    });
    it('소개 조회 성공', () => {
      cy.visit(profileUrl);
      cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-소개"]').click();
      cy.get('[data-cy="profile-seller-description"]').should('be.visible');
    });
    it('소개 조회 실패', () => {
      cy.intercept({ method: 'GET', url: `/api/user/${userId}` }, { statusCode: 500 }).as('getUserError');
      cy.visit(profileUrl);
      cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-소개"]').click();
      cy.contains('소개 정보를 불러오는 중 오류가 발생했습니다.').should('be.visible');
    });
  });

  describe('판매 상품 탭', () => {
    it('판매 상품 조회 로딩', () => {
      cy.intercept('GET', /\/api\/user\/.*\/project/, (req) => new Promise(resolve => {
        setTimeout(() => {
          req.reply({ fixture: 'profile/projectList.json' });
          resolve();
        }, 1000);
      })).as('getUserProjectsDelay');
      cy.visit(profileUrl);
      cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-판매 상품"]').click();
      cy.get('.animate-pulse').should('exist');
      cy.wait('@getUserProjectsDelay');
    });
    it('판매 상품 조회 성공', () => {
      cy.intercept('GET', /\/api\/user\/.*\/project/, { fixture: 'profile/projectList.json' }).as('getUserProjects');
      cy.visit(profileUrl);
      cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-판매 상품"]').click();
      cy.get('[data-cy="project-item"]').should('be.visible');
    });
    it('판매 상품 조회 성공, 데이터 없음', () => {
      cy.intercept('GET', /\/api\/user\/.*\/project/, { statusCode: 200, body: [] }).as('getUserProjectsEmpty');
      cy.visit(profileUrl);
      cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-판매 상품"]').click();
      cy.contains('판매 중인 상품이 없습니다.').should('be.visible');
    });
    it('서버 에러로 인한 판매 상품 조회 실패', () => {
      cy.intercept('GET', /\/api\/user\/.*\/project/, { statusCode: 500 }).as('getUserProjectsError');
      cy.visit(profileUrl);
      cy.get('[data-cy="menu-tab"]').get('[data-cy="menu-tab-판매 상품"]').click();
      cy.contains('판매 상품을 불러오는 중 오류가 발생했습니다.').should('be.visible');
    });
  });
}); 