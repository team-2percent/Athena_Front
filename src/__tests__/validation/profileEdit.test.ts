import { sellerDescriptionSchema, linkUrlsSchema, profileUrlSchema, profileEditSchema, passwordEditSchema, accountHolderSchema, bankNameSchema, bankAccountSchema, addressSchema, addressDetailSchema, accountAddSchema, addressAddSchema, passwordMatchSchema } from "@/lib/validationSchemas";

describe('sellerDescriptionSchema', () => {
    it('200자를 초과하면 에러를 반환해야 함', () => {
      const result = sellerDescriptionSchema.safeParse('a'.repeat(201));
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('판매자 소개는 200자 이내로 입력해주세요.');
    });

    it('유효한 값은 성공해야 함', () => {
      const result = sellerDescriptionSchema.safeParse('a'.repeat(200));
      expect(result.success).toBe(true);
    });
  });

describe('linkUrlsSchema', () => {
    it('65535Byte를 초과하면 에러를 반환해야 함', () => {
        const result = linkUrlsSchema.safeParse('a'.repeat(65536));
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('링크가 너무 깁니다.');
    });

    it('유효한 값은 성공해야 함', () => {
        const result = linkUrlsSchema.safeParse('https://example.com');
        expect(result.success).toBe(true);
    });
});

describe('profileUrlSchema', () => {
    it('잘못된 URL 형식은 에러를 반환해야 함', () => {
        const result = profileUrlSchema.safeParse({ url: 'not-a-url' });
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('올바른 링크 형식이 아닙니다.');
    });

    it('전체 65535Byte를 초과하면 에러를 반환해야 함', () => {
        const result = profileUrlSchema.safeParse({ url: 'https://example.com', linkUrl: 'a'.repeat(65535) });
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('링크가 너무 깁니다.');
    });

    it('유효한 값은 성공해야 함', () => {
        const result = profileUrlSchema.safeParse({ url: 'https://example.com', linkUrl: 'https://example.com' });
        expect(result.success).toBe(true);
    });
});

describe('profileEditSchema', () => {
    it('닉네임이 빈 문자열이면 에러를 반환해야 함', () => {
        const result = profileEditSchema.safeParse({
        nickname: '',
        sellerDescription: '설명',
        linkUrl: 'https://example.com'
        });
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('닉네임을 입력해주세요.');
    });

    it('판매자 소개가 200자를 초과하면 에러를 반환해야 함', () => {
        const result = profileEditSchema.safeParse({
        nickname: '닉네임',
        sellerDescription: 'a'.repeat(201),
        linkUrl: 'https://example.com'
        });
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('판매자 소개는 200자 이내로 입력해주세요.');
    });

    it('링크가 65535Byte를 초과하면 에러를 반환해야 함', () => {
        const result = profileEditSchema.safeParse({
            nickname: '닉네임',
            sellerDescription: '설명',
            linkUrl: 'a'.repeat(65536)
        });
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('링크가 너무 깁니다.');
    });

    it('유효한 값은 성공해야 함', () => {
        const result = profileEditSchema.safeParse({
            nickname: '닉네임',
            sellerDescription: 'a'.repeat(200),
            linkUrl: 'a'.repeat(65535)
        });
        expect(result.success).toBe(true);
    });
});

describe('passwordEditSchema', () => {
    it('비밀번호 확인이 false면 에러를 반환해야 함', () => {
        const result = passwordEditSchema.safeParse({
            passwordConfirmed: false,
            newPassword: 'Abcdefg1!',
            newPasswordConfirm: 'Abcdefg1!',
            newPasswordMatch: {
                password: 'Abcdefg1!',
                passwordConfirm: 'Abcdefg1!'
            }
        });
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('비밀번호 확인이 필요합니다.');
    });

    it('새 비밀번호 8자 미만이면 에러를 반환해야 함', () => {
        const result = passwordEditSchema.safeParse({
            passwordConfirmed: true,
            newPassword: 'abc123!',
            newPasswordConfirm: 'abc123!',
            newPasswordMatch: {
                password: 'abc123!',
                passwordConfirm: 'abc123!'
            } 
        });
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('8자 이상 입력해주세요.');
    });

    it('새 비밀번호 대문자 미포함이면 에러를 반환해야 함', () => {
        const result = passwordEditSchema.safeParse({
            passwordConfirmed: true,
            newPassword: 'abc1234!',
            newPasswordConfirm: 'abc1234!',
            newPasswordMatch: {
                password: 'abc1234!',
                passwordConfirm: 'abc1234!'
            }
        });
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('대문자를 포함해주세요.');
    });

    it('새 비밀번호 소문자 미포함이면 에러를 반환해야 함', () => {
        const result = passwordEditSchema.safeParse({
            passwordConfirmed: true,
            newPassword: 'ABC1234!',
            newPasswordConfirm: 'ABC1234!',
            newPasswordMatch: {
                password: 'ABC1234!',
                passwordConfirm: 'ABC1234!'
            }
        });
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('소문자를 포함해주세요.');
    });

    it('새 비밀번호 숫자 미포함이면 에러를 반환해야 함', () => {
        const result = passwordEditSchema.safeParse({
            passwordConfirmed: true,
            newPassword: 'Abcdefg!',
            newPasswordConfirm: 'Abcdefg!',
            newPasswordMatch: {
                password: 'Abcdefg!',
                passwordConfirm: 'Abcdefg!'
            }
        });
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('숫자를 포함해주세요.');
    });

    it('새 비밀번호 특수문자 미포함이면 에러를 반환해야 함', () => {
        const result = passwordEditSchema.safeParse({
            passwordConfirmed: true,
            newPassword: 'Abcdefg1',
            newPasswordConfirm: 'Abcdefg1',
            newPasswordMatch: {
                password: 'Abcdefg1',
                passwordConfirm: 'Abcdefg1'
            }
        });
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('특수문자를 포함해주세요.');
    });

    it('새 비밀번호와 새 비밀번호 확인이 다르면 에러를 반환해야 함', () => {
        const result = passwordEditSchema.safeParse({
            passwordConfirmed: true,
            newPassword: 'Abcdefg1!',
            newPasswordConfirm: 'Abcdefg2!',
            newPasswordMatch: {
                password: 'Abcdefg1!',
                passwordConfirm: 'Abcdefg2!'
            }
        });
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('비밀번호가 일치하지 않습니다.');
    });

    it('유효한 값은 성공해야 함', () => {
        const result = passwordEditSchema.safeParse({
            passwordConfirmed: true,
            newPassword: 'Abcdefg1!',
            newPasswordConfirm: 'Abcdefg1!',
            newPasswordMatch: {
                password: 'Abcdefg1!',
                passwordConfirm: 'Abcdefg1!'
            }
        });
        expect(result.success).toBe(true);
    });
});

describe('accountHolderSchema', () => {
    it('빈 문자열은 에러를 반환해야 함', () => {
        const result = accountHolderSchema.safeParse('');
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('예금주를 입력해주세요.');
    });

    it('50자를 초과하면 에러를 반환해야 함', () => {
        const result = accountHolderSchema.safeParse('a'.repeat(51));
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('예금주는 50자 이내로 입력해주세요.');
    });

    it('유효한 값은 성공해야 함', () => {
        const result = accountHolderSchema.safeParse('a'.repeat(50));
        expect(result.success).toBe(true);
    });
});

describe('bankNameSchema', () => {
    it('빈 문자열은 에러를 반환해야 함', () => {
        const result = bankNameSchema.safeParse('');
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('은행명을 입력해주세요.');
    });

    it('50자를 초과하면 에러를 반환해야 함', () => {
        const result = bankNameSchema.safeParse('a'.repeat(51));
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('은행명은 50자 이내로 입력해주세요.');
    });

    it('유효한 값은 성공해야 함', () => {
        const result = bankNameSchema.safeParse('a'.repeat(50));
        expect(result.success).toBe(true);
    });
});

describe('bankAccountSchema', () => {
    it('빈 문자열은 에러를 반환해야 함', () => {
        const result = bankAccountSchema.safeParse('');
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('계좌번호를 입력해주세요.');
    });

    it('50자를 초과하면 에러를 반환해야 함', () => {
        const result = bankAccountSchema.safeParse('a'.repeat(51));
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('계좌번호는 50자 이내로 입력해주세요.');
    });

    it('숫자가 아닌 문자가 포함되면 에러를 반환해야 함', () => {
        const result = bankAccountSchema.safeParse('1234-5678');
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('숫자만 입력해주세요.');
    });

    it('유효한 값은 성공해야 함', () => {
        const result = bankAccountSchema.safeParse('1234567890');
        expect(result.success).toBe(true);
    });
});

describe('accountAddSchema', () => {
    it('예금주가 빈 문자열이면 에러를 반환해야 함', () => {
        const result = accountAddSchema.safeParse({
            accountHolder: '',
            bankName: '은행명',
            bankAccount: '1234567890'
        });
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('예금주를 입력해주세요.');
    });

    it('은행명이 빈 문자열이면 에러를 반환해야 함', () => {
        const result = accountAddSchema.safeParse({
            accountHolder: '예금주',
            bankName: '',
            bankAccount: '1234567890'
        });
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('은행명을 입력해주세요.');
    });

    it('계좌번호가 빈 문자열이면 에러를 반환해야 함', () => {
        const result = accountAddSchema.safeParse({
            accountHolder: '예금주',
            bankName: '은행명',
            bankAccount: ''
        });
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('계좌번호를 입력해주세요.');
    });

    it('유효한 값은 성공해야 함', () => {
        const result = accountAddSchema.safeParse({
            accountHolder: '예금주',
            bankName: '은행명',
            bankAccount: '1234567890'
        });
        expect(result.success).toBe(true);
    });
});

describe('addressSchema', () => {
    it('빈 문자열은 에러를 반환해야 함', () => {
        const result = addressSchema.safeParse('');
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('주소가 필요합니다.');
    });
});

describe('addressDetailSchema', () => {
    it('빈 문자열은 에러를 반환해야 함', () => {
        const result = addressDetailSchema.safeParse('');
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('상세 주소를 입력해주세요.');
    });

    it('100자를 초과하면 에러를 반환해야 함', () => {
        const result = addressDetailSchema.safeParse('a'.repeat(101));
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('상세 주소는 100자 이내로 입력해주세요.');
    });

    it('유효한 값은 성공해야 함', () => {
        const result = addressDetailSchema.safeParse('a'.repeat(50));
        expect(result.success).toBe(true);
    });
});

describe('addressAddSchema', () => {
    it('주소가 빈 문자열이면 에러를 반환해야 함', () => {
        const result = addressAddSchema.safeParse({
            address: '',
            detailAddress: '상세 주소'
        });
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('주소가 필요합니다.');
    });

    it('상세 주소가 빈 문자열이면 에러를 반환해야 함', () => {
        const result = addressAddSchema.safeParse({
            address: '주소',
            detailAddress: ''
        });
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('상세 주소를 입력해주세요.');
    });

    it('유효한 값은 성공해야 함', () => {
        const result = addressAddSchema.safeParse({
            address: '판교역로 166',
            detailAddress: '카카오 아지트 2층'
        });
        expect(result.success).toBe(true);
    });
});
