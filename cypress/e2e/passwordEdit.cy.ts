describe('비밀번호 수정', () => {
  beforeEach(() => {
    cy.visitMainPage()
    cy.adminLogin()
  })

  describe('프로필 탭 활성화', () => {
    it('프로필 탭 활성화', () => {
      cy.fixture('profileEdit/user.json').then((profileEdit) => {
        cy.intercept({
          method: 'GET',
          url: '/api/user/*'
        }, {
          statusCode: 200,
          body: profileEdit
        }).as("getUser");
      })

      cy.fixture('profileEdit/accountList.json').then((account) => {
        cy.intercept({
            method: "GET",
            url: "/api/bankAccount"
        }, {
            statusCode: 200,
            body: account
        }).as("getAccount");
      })

      cy.fixture('profileEdit/addressList.json').then((shipping) => {
          cy.intercept({
              method: "GET",
              url: "/api/delivery/delivery-info"
          }, {
              statusCode: 200,
              body: shipping
          }).as("getAddress");
      })

      cy.visit('/my/edit')
      cy.wait('@getUser').its('response.statusCode').should('eq', 200)
      cy.get('[data-cy="password-change-button"]').click()
      cy.get('[data-cy="menu-tab-프로필"]').should('have.class', 'text-main-color')
    })
  })

  describe('입력값 유효성 검사', () => {
    beforeEach(() => {
      cy.fixture('profileEdit/user.json').then((profileEdit) => {
        cy.intercept({
          method: 'GET',
          url: '/api/user/*'
        }, {
          statusCode: 200,
          body: profileEdit
        }).as("getUser");
      })
      
      cy.fixture('profileEdit/accountList.json').then((account) => {
        cy.intercept({
            method: "GET",
            url: "/api/bankAccount"
        }, {
            statusCode: 200,
            body: account
        }).as("getAccount");
      })

      cy.fixture('profileEdit/addressList.json').then((shipping) => {
          cy.intercept({
              method: "GET",
              url: "/api/delivery/delivery-info"
          }, {
              statusCode: 200,
              body: shipping
          }).as("getAddress");
      })

      cy.intercept({
        method: 'POST',
        url: '/api/my/checkPassword'
      }, {
        statusCode: 200,
        body: true
    }).as('verifyPassword')

      cy.visit('/my/edit')
      cy.wait('@getUser').its('response.statusCode').should('eq', 200)
      cy.get('[data-cy="password-change-button"]').click()
    })

    it('비밀번호 확인 완료, 새 비밀번호와 새 비밀번호 확인이 일치 시 저장 가능', () => {
      cy.get('[data-cy="password-input"]').type('Abc1234%')
      cy.get('[data-cy="password-verify-button"]').click()
      cy.wait('@verifyPassword').its('response.statusCode').should('eq', 200)
      cy.get('[data-cy="password-verify-success"]').should('be.visible')
      cy.get('[data-cy="new-password-input"]').type('NewPass123%')
      cy.get('[data-cy="new-password-confirm-input"]').type('NewPass123%')
      cy.get('[data-cy="password-save-button"]').click()
    })

    describe('입력값 공란', () => {
      it('비밀번호 미입력 시 확인 불가', () => {
        cy.get('[data-cy="password-verify-button"]').should('be.disabled')
      })

      it('새 비밀번호 미입력 시 저장 불가', () => {
        cy.get('[data-cy="password-input"]').type('Abc1234%')
        cy.get('[data-cy="password-verify-button"]').click()
        cy.wait('@verifyPassword').its('response.statusCode').should('eq', 200)
        cy.get('[data-cy="password-verify-success"]').should('be.visible')
        cy.get('[data-cy="password-save-button"]').should('be.disabled')
      })

      it('새 비밀번호 확인 미입력 시 저장 불가', () => {
        cy.get('[data-cy="password-input"]').type('Abc1234%')
        cy.get('[data-cy="password-verify-button"]').click()
        cy.wait('@verifyPassword').its('response.statusCode').should('eq', 200)
        cy.get('[data-cy="password-verify-success"]').should('be.visible')
        cy.get('[data-cy="new-password-input"]').type('NewPass123%')
        cy.get('[data-cy="password-save-button"]').should('be.disabled')
      })

      it('새 비밀번호 형식 오류 시 저장 불가', () => {
        cy.get('[data-cy="password-input"]').type('Abc1234%')
        cy.get('[data-cy="password-verify-button"]').click()
        cy.wait('@verifyPassword').its('response.statusCode').should('eq', 200)
        cy.get('[data-cy="password-verify-success"]').should('be.visible')
        cy.get('[data-cy="new-password-input"]').type('invalid')
        cy.get('[data-cy="new-password-error-message"]').should('be.visible')
        cy.get('[data-cy="password-save-button"]').should('be.disabled')
      })
    })

    describe('입력값 제한 초과', () => {
      it('비밀번호 제한 초과 시 슬라이싱', () => {
        const longPassword = 'a'.repeat(101)
        cy.get('[data-cy="password-input"]').type(longPassword)
        cy.get('[data-cy="password-input"]').should('have.value', longPassword.substring(0, 100))
        cy.get('[data-cy="password-verify-error-message"]').should('be.visible')
      })

      it('새 비밀번호 제한 초과 시 슬라이싱', () => {
        cy.get('[data-cy="password-input"]').type('Abc1234%')
        cy.get('[data-cy="password-verify-button"]').click()
        cy.wait('@verifyPassword').its('response.statusCode').should('eq', 200)
        cy.get('[data-cy="password-verify-success"]').should('be.visible')
        
        const longNewPassword = 'a'.repeat(101)
        cy.get('[data-cy="new-password-input"]').type(longNewPassword)
        cy.get('[data-cy="new-password-input"]').should('have.value', longNewPassword.substring(0, 100))
        cy.get('[data-cy="new-password-error-message"]').should('be.visible')
      })

      it('새 비밀번호 확인 제한 초과 시 슬라이싱', () => {
        cy.get('[data-cy="password-input"]').type('Abc1234%')
        cy.get('[data-cy="password-verify-button"]').click()
        cy.wait('@verifyPassword').its('response.statusCode').should('eq', 200)
        cy.get('[data-cy="password-verify-success"]').should('be.visible')
        cy.get('[data-cy="new-password-input"]').type('NewPass123%')
        
        const longConfirmPassword = 'a'.repeat(101)
        cy.get('[data-cy="new-password-confirm-input"]').type(longConfirmPassword)
        cy.get('[data-cy="new-password-confirm-input"]').should('have.value', longConfirmPassword.substring(0, 100))
        cy.get('[data-cy="new-password-confirm-error-message"]').should('be.visible')
      })

      it('새 비밀번호와 새 비밀번호 확인이 일치하지 않으면 저장 불가', () => {
        cy.get('[data-cy="password-input"]').type('Abc1234%')
        cy.get('[data-cy="password-verify-button"]').click()
        cy.wait('@verifyPassword').its('response.statusCode').should('eq', 200)
        cy.get('[data-cy="password-verify-success"]').should('be.visible')
        cy.get('[data-cy="new-password-input"]').type('NewPass123%')
        cy.get('[data-cy="new-password-confirm-input"]').type('DifferentPass123%')
        cy.get('[data-cy="new-password-confirm-error-message"]').should('be.visible')
        cy.get('[data-cy="password-save-button"]').should('be.disabled')
      })
    })
  })

  describe('비밀번호 확인', () => {
    beforeEach(() => {
      cy.fixture('profileEdit/user.json').then((profileEdit) => {
        cy.intercept({
          method: 'GET',
          url: '/api/user/*'
        }, {
          statusCode: 200,
          body: profileEdit
        }).as("getUser");
      })
      
      cy.fixture('profileEdit/accountList.json').then((account) => {
        cy.intercept({
            method: "GET",
            url: "/api/bankAccount"
        }, {
            statusCode: 200,
            body: account
        }).as("getAccount");
      })

      cy.fixture('profileEdit/addressList.json').then((shipping) => {
          cy.intercept({
              method: "GET",
              url: "/api/delivery/delivery-info"
          }, {
              statusCode: 200,
              body: shipping
          }).as("getAddress");
      })

      cy.visit('/my/edit')
      cy.wait('@getUser').its('response.statusCode').should('eq', 200)
      cy.get('[data-cy="password-change-button"]').click()
    })
    it('비밀번호 확인 로딩', () => {
      cy.intercept({
        method: 'POST',
        url: '/api/my/checkPassword'
      }, {
        statusCode: 200,
        delay: 2000,
        body: true
      }).as('verifyPassword')

      cy.get('[data-cy="password-input"]').type('Abc1234%')
      cy.get('[data-cy="password-verify-button"]').click()
      cy.get('[data-cy="password-verify-button"]').should('have.attr', 'data-loading', 'true')
      cy.wait('@verifyPassword').its('response.statusCode').should('eq', 200)
    })

    it('비밀번호 확인 성공', () => {
      cy.intercept({
        method: 'POST',
        url: '/api/my/checkPassword'
      }, {
        statusCode: 200,
        body: true
      }).as('verifyPasswordSuccess')

      cy.get('[data-cy="password-input"]').type('Abc1234%')
      cy.get('[data-cy="password-verify-button"]').click()
      cy.wait('@verifyPasswordSuccess').its('response.statusCode').should('eq', 200)
      cy.get('[data-cy="password-verify-success"]').should('be.visible')
    })

    describe('비밀번호 확인 실패', () => {
      it('비밀번호 불일치로 인한 비밀번호 확인 실패', () => {
        cy.intercept({
          method: 'POST',
          url: '/api/my/checkPassword'
        }, {
          statusCode: 200,
          body: false
        }).as('verifyPasswordFail')

        cy.get('[data-cy="password-input"]').type('WrongPassword123%')
        cy.get('[data-cy="password-verify-button"]').click()
        cy.wait('@verifyPasswordFail').its('response.statusCode').should('eq', 200)
        cy.get('[data-cy="password-verify-error-message"]').should('be.visible')
      })

      it('서버 오류로 인한 비밀번호 확인 실패', () => {
        cy.intercept({
          method: 'POST',
          url: '/api/my/checkPassword'
        }, {
          statusCode: 500,
        }).as('verifyPasswordServerError')

        cy.get('[data-cy="password-input"]').type('Abc1234%')
        cy.get('[data-cy="password-verify-button"]').click()
        cy.wait('@verifyPasswordServerError').its('response.statusCode').should('eq', 500)
        cy.get('[data-cy="password-verify-error-message"]').should('be.visible')
      })
    })
  })

  describe('비밀번호 변경', () => {
    beforeEach(() => {
      cy.fixture('profileEdit/user.json').then((profileEdit) => {
        cy.intercept({
          method: 'GET',
          url: '/api/user/*'
        }, {
          statusCode: 200,
          body: profileEdit
        }).as("getUser");
      })
      
      cy.fixture('profileEdit/accountList.json').then((account) => {
        cy.intercept({
            method: "GET",
            url: "/api/bankAccount"
        }, {
            statusCode: 200,
            body: account
        }).as("getAccount");
      })

      cy.fixture('profileEdit/addressList.json').then((shipping) => {
          cy.intercept({
              method: "GET",
              url: "/api/delivery/delivery-info"
          }, {
              statusCode: 200,
              body: shipping
          }).as("getAddress");
      })
      cy.intercept({
        method: 'POST',
        url: '/api/my/checkPassword'
      }, {
        statusCode: 200,
        body: true
    }).as('verifyPassword')

      cy.visit('/my/edit')
      cy.wait('@getUser').its('response.statusCode').should('eq', 200)
      cy.get('[data-cy="password-change-button"]').click()
    })
    it('비밀번호 변경 로딩', () => {
      cy.intercept({
        method: 'POST',
        url: '/api/my/checkPassword'
      }, {
        statusCode: 200,
        body: true
      }).as('verifyPassword')

      cy.intercept({
        method: 'POST',
        url: '/api/my/updatePassword'
      }, {
        statusCode: 200,
        delay: 2000
      }).as('changePassword')

      cy.get('[data-cy="password-input"]').type('Abc1234%')
      cy.get('[data-cy="password-verify-button"]').click()
      cy.wait('@verifyPassword').its('response.statusCode').should('eq', 200)
      cy.get('[data-cy="password-verify-success"]').should('be.visible')
      cy.get('[data-cy="new-password-input"]').type('NewPass123%')
      cy.get('[data-cy="new-password-confirm-input"]').type('NewPass123%')
      cy.get('[data-cy="password-save-button"]').click()
      cy.get('[data-cy="password-save-button"]').should('have.attr', 'data-loading', 'true')
      cy.wait('@changePassword').its('response.statusCode').should('eq', 200)
    })

    it('비밀번호 변경 성공', () => {
      cy.intercept({
        method: 'POST',
        url: '/api/my/checkPassword'
      }, {
        statusCode: 200,
        body: true
      }).as('verifyPassword')

      cy.intercept({
        method: 'POST',
        url: '/api/my/updatePassword'
      }, {
        statusCode: 200,
      }).as('changePasswordSuccess')

      cy.get('[data-cy="password-input"]').type('Abc1234%')
      cy.get('[data-cy="password-verify-button"]').click()
      cy.wait('@verifyPassword').its('response.statusCode').should('eq', 200)
      cy.get('[data-cy="password-verify-success"]').should('be.visible')
      cy.get('[data-cy="new-password-input"]').type('NewPass123%')
      cy.get('[data-cy="new-password-confirm-input"]').type('NewPass123%')
      cy.get('[data-cy="password-save-button"]').click()

      cy.wait('@changePasswordSuccess').its('response.statusCode').should('eq', 200)
      
      cy.get('[data-cy="new-password-input"]').should('have.value', '')
      cy.get('[data-cy="new-password-confirm-input"]').should('have.value', '')
      cy.get('[data-cy="password-save-button"]').should('be.disabled')
    })

    it('서버 오류로 인한 비밀번호 변경 실패', () => {
      cy.intercept({
        method: 'POST',
        url: '/api/my/checkPassword'
      }, {
        statusCode: 200,
        body: true
      }).as('verifyPassword')

      cy.intercept({
        method: 'POST',
        url: '/api/my/updatePassword'
      }, {
        statusCode: 500,
      }).as('changePasswordFail')

      cy.get('[data-cy="password-input"]').type('Abc1234%')
      cy.get('[data-cy="password-verify-button"]').click()
      cy.wait('@verifyPassword').its('response.statusCode').should('eq', 200)
      cy.get('[data-cy="password-verify-success"]').should('be.visible')
      cy.get('[data-cy="new-password-input"]').type('NewPass123%')
      cy.get('[data-cy="new-password-confirm-input"]').type('NewPass123%')
      cy.get('[data-cy="password-save-button"]').click()
      
      cy.checkErrorTopToast(
        '비밀번호 변경 실패',
        '다시 시도해주세요.'
      )
    })
  })
})
