describe('사용자 정보 수정', () => {
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

    cy.visitMainPage()
    cy.adminLogin()
  })

  describe('프로필 탭 활성화', () => {
    it('프로필 탭 활성화', () => {
      cy.visit('/my/edit')
      cy.get('[data-cy="menu-tab-프로필"]').should('have.class', 'text-main-color')
    })
  })

  describe('사용자 정보 조회', () => {
    it('사용자 정보 조회 로딩', () => {
        cy.fixture('profileEdit/user.json').then((profileEdit) => {
          cy.intercept({
            method: 'GET',
            url: '/api/user/*'
          }, {
            statusCode: 200,
            body: profileEdit,
            delay: 1000
          },).as("getUser");
        })
        
        cy.visit('/my/edit')
        
        cy.get('[data-cy="spinner"]').should('be.visible')
    })

    it('사용자 정보 조회 성공', () => {
        cy.visit('/my/edit')
        cy.wait('@getUser').its('response.statusCode').should('eq', 200)

        cy.get('[data-cy="nickname-input"]').should('be.visible')
        cy.get('[data-cy="seller-description-input"]').should('be.visible')
    })

    it('서버 에러로 인한 사용자 정보 조회 실패', () => {
      cy.intercept({
        method: 'GET',
        url: '/api/user/*'
      }, {
        statusCode: 500,
        body: {
          message: '서버 에러가 발생했습니다'
        }
      }).as('getUserError')

      cy.visit('/my/edit')
      cy.wait('@getUserError').its('response.statusCode').should('eq', 500)

      cy.get('[data-cy="server-error-message"]').should('be.visible')
    })
  })

  describe('입력값 유효성 검증', () => {
    beforeEach(() => {
      cy.visit('/my/edit')
      cy.wait('@getUser').its('response.statusCode').should('eq', 200)
    })

    describe('입력란 공란', () => {
      it('닉네임 없을 경우 저장 불가', () => {
        cy.get('[data-cy="nickname-input"]').clear()
        cy.get('[data-cy="nickname-error-message"]').should('be.visible')
        cy.get('[data-cy="save-button"]').should('be.disabled')
      })

      it('링크 내용 없을 경우 링크 추가 불가', () => {
        cy.get('[data-cy="toggle-link-url-add-form-button"]').click()
        cy.get('[data-cy="link-url-add-button"]').should('be.disabled')
        
        cy.get('[data-cy="link-url-input"]').type('https://example.com').clear()
        cy.get('[data-cy="link-url-add-button"]').should('be.disabled')
        cy.get('[data-cy="link-url-error-message"]').should('be.visible')
      })
    })

    describe('입력 형식 오류', () => {
      beforeEach(() => {
        cy.visit('/my/edit')
        cy.wait('@getUser').its('response.statusCode').should('eq', 200)
      })

      it('프로필 사진 형식 오류', () => {
        // dummy 파일 생성
        cy.writeFile('cypress/fixtures/temp/invalid-format.txt', 'This is not an image file')
        
        // 파일 input에 직접 파일 설정
        cy.get('[data-cy="profile-image-input"]').then($input => {
          const file = new File(['This is not an image file'], 'invalid-format.txt', { type: 'text/plain' })
          const dataTransfer = new DataTransfer()
          dataTransfer.items.add(file)
          $input[0].files = dataTransfer.files
          $input[0].dispatchEvent(new Event('change', { bubbles: true }))
        })
        
        cy.get('[data-cy="file-upload-error-modal"]').should('be.visible')
        cy.get('[data-cy="profile-image"]').should('not.exist')
        
        // 임시 파일 삭제
        cy.task('deleteFile', 'cypress/fixtures/temp/invalid-format.txt')
      })

      it('링크 형식 오류', () => {
        cy.get('[data-cy="toggle-link-url-add-form-button"]').click()
        cy.get('[data-cy="link-url-input"]').type('invalid-link-format')
        cy.get('[data-cy="link-url-add-button"]').should('be.disabled')
        cy.get('[data-cy="link-url-error-message"]').should('be.visible')
      })
    })

    describe('입력란 제한 초과', () => {
      beforeEach(() => {
        cy.visit('/my/edit')
        cy.wait('@getUser').its('response.statusCode').should('eq', 200)
      })

      it('파일 크기 제한 초과할 시 입력 취소', () => {
        // 큰 dummy 파일 생성 (10MB 이상)
        const largeContent = 'a'.repeat(10 * 1024 * 1024) // 10MB
        
        // 파일 input에 직접 파일 설정
        cy.get('[data-cy="profile-image-input"]').then($input => {
          const file = new File([largeContent], 'large-file.jpg', { type: 'image/jpeg' })
          const dataTransfer = new DataTransfer()
          dataTransfer.items.add(file)
          $input[0].files = dataTransfer.files
          $input[0].dispatchEvent(new Event('change', { bubbles: true }))
        })
        
        cy.get('[data-cy="file-upload-error-modal"]').should('be.visible')
        cy.get('[data-cy="profile-image"]').should('not.exist')

        cy.task('deleteFile', 'cypress/fixtures/temp/large-file.jpg')
      })

      it('닉네임 길이 제한 초과할 시 슬라이싱', () => {
        // 기존 닉네임 값을 가져오기 위해 input의 value 속성 확인
        const longNickname = 'a'.repeat(50)   
        cy.get('[data-cy="nickname-input"]').then(($input) => {
            const currentValue = $input.val();
            const expected = `${currentValue}${longNickname}`.substring(0, 50);
          
            // 강제 값 주입 후 input 이벤트 트리거
            cy.wrap($input)
              .invoke('val', expected)
              .trigger('input');
          
            // 렌더링 지연 대비: 값이 확실히 반영될 때까지 기다리기
            cy.get('[data-cy="nickname-input"]')
              .should(($el) => {
                expect($el.val()).to.equal(expected);
              });
          
            // 에러 메시지 표시까지 기다리기
            cy.get('[data-cy="nickname-error-message"]').should('be.visible');
          });
      })

      it('판매자 설명 길이 제한 초과할 시 슬라이싱', () => {
        // 기존 설명 값을 가져오기 위해 textarea의 value 속성 확인
        const longDescription = 'a'.repeat(200)
        cy.get('[data-cy="seller-description-input"]')
            .then(($input) => {
            const currentValue = $input.val();
            const expected = `${currentValue}${longDescription}`.substring(0, 200);
            
            cy.wrap($input)
                .invoke('val', expected)
                .trigger('input');
            });
        
            cy.get('[data-cy="seller-description-error-message"]').should('be.visible')
      })

      it('링크 바이트 제한 초과할 시 슬라이싱', () => {
        cy.get('[data-cy="toggle-link-url-add-form-button"]').click()
        // 이모지는 한 글자당 4바이트이므로 16383번 반복하면 65535바이트가 됨
        const longLink = 'http://naver.com/' + 'a'.repeat(65535)
        console.log(new Blob([longLink]).size);
        cy.get('[data-cy="link-url-input"]')
            .then(($input) => {
            cy.wrap($input)
                .invoke('val', longLink)
                .trigger('input');
            
            cy.get('[data-cy="link-url-input"]')
                .should(($el) => {
                    expect($el.val()).to.equal(longLink);
                });
            });
        cy.get('[data-cy="link-url-error-message"]').should('be.visible')
      })
    })
  })

  describe('변경 사항 인식', () => {
    beforeEach(() => {
      cy.visit('/my/edit')
      cy.wait('@getUser').its('response.statusCode').should('eq', 200)
    })

    it('닉네임 수정 시 저장 가능', () => {
      cy.get('[data-cy="nickname-input"]').type('수정된닉네임')
      cy.get('[data-cy="save-button"]').should('not.be.disabled')
    })

    it('이미지 변경 시 저장 가능', () => {
        cy.get('[data-cy="profile-image-upload-button"]').click().selectFile('cypress/fixtures/profileEdit/profileImageEditExample.jpg')
        cy.get('[data-cy="save-button"]').should('not.be.disabled')
    })

    it('판매자 소개 수정 시 저장 가능', () => {
      cy.get('[data-cy="seller-description-input"]').type('{backspace}')
      cy.get('[data-cy="save-button"]').should('not.be.disabled')
    })

    it('링크 추가 또는 삭제 시 저장 가능', () => {
      cy.get('[data-cy="toggle-link-url-add-form-button"]').click()
      cy.get('[data-cy="link-url-input"]').type('https://example.com')
      cy.get('[data-cy="link-url-add-button"]').click()
      cy.get('[data-cy="save-button"]').should('not.be.disabled')
    })
  })

  describe('수정 사항 저장', () => {
    beforeEach(() => {
      cy.visit('/my/edit')
      cy.wait('@getUser').its('response.statusCode').should('eq', 200)      
    })

    it('수정 사항 저장 로딩', () => {
        cy.intercept({
            method: 'PUT',
            url: '/api/user'
        }, {
            statusCode: 200,
            delay: 1000
        }).as('updateUserSuccess')
      cy.get('[data-cy="nickname-input"]').type('수정된닉네임')
      cy.get('[data-cy="save-button"]').click()
      cy.get('[data-cy="spinner"]').should('be.visible')
    })

    it('수정 사항 저장 성공', () => {
        cy.fixture('profileEdit/user.json').then((profileEdit) => {
            const newProfileEdit = { ...profileEdit }
            newProfileEdit.nickname = '수정된닉네임'
            cy.intercept({
                method: 'PUT',
                url: '/api/user'
            }, {
                statusCode: 200,
                body: {
                    "id": newProfileEdit.id,
                    "email": newProfileEdit.email,
                    "nickname": newProfileEdit.nickname,
                    "sellerIntroduction": newProfileEdit.sellerDescription,
                    "linkUrl": newProfileEdit.linkUrl
                }
            }).as('updateUserSuccess')
        })

        cy.get('[data-cy="nickname-input"]').clear().type('수정된닉네임')
        cy.get('[data-cy="save-button"]').click()

        cy.wait('@updateUserSuccess').its('response.statusCode').should('eq', 200)
        
        cy.get('[data-cy="save-button"]').should('be.disabled')
    })

    it('수정 사항 저장 실패', () => {
      cy.intercept({
        method: 'PUT',
        url: '/api/user'
      }, {
        statusCode: 500,
      }).as('updateUserError')

      cy.get('[data-cy="nickname-input"]').type('수정된닉네임')
      cy.get('[data-cy="save-button"]').click()

      cy.wait('@updateUserError').its('response.statusCode').should('eq', 500)
      
      cy.checkErrorTopToast('프로필 수정 실패', '다시 시도해주세요.')
      cy.get('[data-cy="save-button"]').should('not.be.disabled')
    })

    it('비밀번호 변경 이동', () => {
      cy.get('[data-cy="password-change-button"]').click()
      cy.get('[data-cy="password-change-title"]').should('be.visible')
    })
  })
})
