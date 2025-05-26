import { z } from "zod"

// 1단계 유효성 검사 스키마
export const stepOneSchema = z
  .object({
    // 카테고리: 필수
    categoryId: z
      .number({
        required_error: "카테고리를 선택해주세요.",
      })
      .min(1, "카테고리를 선택해주세요."),

    // 상품 제목: 필수, 25자 이하
    title: z
      .string({
        required_error: "상품 제목을 입력해주세요.",
      })
      .min(1, "상품 제목을 입력해주세요.")
      .max(25, "상품 제목은 25자 이하로 입력해주세요."),

    // 상품 설명: 필수, 10자 이상 50자 이하
    description: z
      .string({
        required_error: "상품 설명을 입력해주세요.",
      })
      .min(10, "상품 설명은 10자 이상 입력해주세요.")
      .max(50, "상품 설명은 50자 이하로 입력해주세요."),

    // 대표 이미지: 선택사항 (최대 5개)
    images: z.array(z.any()).max(5, "이미지는 최대 5개까지 업로드 가능합니다.").optional(),

    // 목표 금액: 필수, 10억원 이하
    targetAmount: z
      .string({
        required_error: "목표 금액을 입력해주세요.",
      })
      .min(1, "목표 금액을 입력해주세요.")
      .refine((val) => {
        const numericValue = Number(val.replace(/,/g, ""))
        return !isNaN(numericValue) && numericValue > 0
      }, "올바른 금액을 입력해주세요.")
      .refine((val) => {
        const numericValue = Number(val.replace(/,/g, ""))
        return numericValue <= 1000000000 // 10억원
      }, "목표 금액은 10억원 이하로 설정해주세요."),

    // 펀딩 시작일: 필수, 오늘부터 일주일 뒤
    startDate: z
      .date({
        required_error: "펀딩 시작일을 선택해주세요.",
      })
      .nullable()
      .refine((date) => {
        if (!date) return false // null이면 유효하지 않음
        const today = new Date()
        const minStartDate = new Date(today)
        minStartDate.setDate(today.getDate() + 7)

        // 날짜만 비교 (시간 제거)
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        const minDateOnly = new Date(minStartDate.getFullYear(), minStartDate.getMonth(), minStartDate.getDate())

        return dateOnly >= minDateOnly
      }, "펀딩 시작일은 오늘부터 일주일 뒤부터 선택 가능합니다."),

    // 펀딩 종료일: 필수, 시작일 이후 또는 동일
    endDate: z
      .date({
        required_error: "펀딩 종료일을 선택해주세요.",
      })
      .nullable()
      .refine((date) => date !== null, "펀딩 종료일을 선택해주세요."),

    // 배송 예정일: 필수, 종료일 + 7일 이후
    deliveryDate: z
      .date({
        required_error: "배송 예정일을 선택해주세요.",
      })
      .nullable()
      .refine((date) => date !== null, "배송 예정일을 선택해주세요."),
  })
  .refine(
    (data) => {
      // 종료일이 시작일 이후 또는 동일한지 확인 (>= 로 변경)
      if (!data.startDate || !data.endDate) return true // null인 경우는 개별 필드에서 처리
      return data.endDate >= data.startDate
    },
    {
      message: "펀딩 종료일은 시작일과 같거나 이후여야 합니다.",
      path: ["endDate"],
    },
  )
  .refine(
    (data) => {
      // 배송일이 종료일 + 7일 이후인지 확인
      if (!data.endDate || !data.deliveryDate) return true // null인 경우는 개별 필드에서 처리
      const minDeliveryDate = new Date(data.endDate)
      minDeliveryDate.setDate(data.endDate.getDate() + 7)

      // 날짜만 비교 (시간 제거)
      const deliveryDateOnly = new Date(
        data.deliveryDate.getFullYear(),
        data.deliveryDate.getMonth(),
        data.deliveryDate.getDate(),
      )
      const minDateOnly = new Date(minDeliveryDate.getFullYear(), minDeliveryDate.getMonth(), minDeliveryDate.getDate())

      return deliveryDateOnly >= minDateOnly
    },
    {
      message: "배송 예정일은 펀딩 종료일로부터 일주일 뒤부터 선택 가능합니다.",
      path: ["deliveryDate"],
    },
  )

export type StepOneFormData = z.infer<typeof stepOneSchema>

// 3단계 유효성 검사 스키마
export const stepThreeSchema = z.object({
  // 후원 상품 목록: 최소 1개 이상
  supportOptions: z
    .array(
      z.object({
        id: z.number(),
        // 후원 상품 이름: 필수, 25자 이하
        name: z
          .string({
            required_error: "후원 상품 이름을 입력해주세요.",
          })
          .min(1, "후원 상품 이름을 입력해주세요.")
          .max(25, "후원 상품 이름은 25자 이하로 입력해주세요."),

        // 후원 상품 설명: 선택사항, 50자 이하
        description: z.string().max(50, "후원 상품 설명은 50자 이하로 입력해주세요.").optional().or(z.literal("")),

        // 후원 상품 가격: 필수, 10억 이하
        price: z
          .string({
            required_error: "후원 상품 가격을 입력해주세요.",
          })
          .min(1, "후원 상품 가격을 입력해주세요.")
          .refine((val) => {
            const numericValue = Number(val.replace(/,/g, ""))
            return !isNaN(numericValue) && numericValue > 0
          }, "올바른 가격을 입력해주세요.")
          .refine((val) => {
            const numericValue = Number(val.replace(/,/g, ""))
            return numericValue <= 1000000000 // 10억원
          }, "후원 상품 가격은 10억원 이하로 설정해주세요."),

        // 후원 상품 수량: 필수, 1개 이상 1만 개 이하
        stock: z
          .string({
            required_error: "후원 상품 수량을 입력해주세요.",
          })
          .min(1, "후원 상품 수량을 입력해주세요.")
          .refine((val) => {
            const numericValue = Number(val.replace(/,/g, ""))
            return !isNaN(numericValue) && numericValue >= 1
          }, "후원 상품 수량은 1개 이상이어야 합니다.")
          .refine((val) => {
            const numericValue = Number(val.replace(/,/g, ""))
            return numericValue <= 10000 // 1만 개
          }, "후원 상품 수량은 1만 개 이하로 설정해주세요."),

        // 후원 상품 구성: 선택사항, 각 구성 항목마다 100자 이하
        composition: z
          .array(
            z.object({
              id: z.number(),
              content: z.string().max(100, "구성 항목은 100자 이하로 입력해주세요."),
            }),
          )
          .optional(),
      }),
    )
    .min(1, "후원 상품을 최소 1개 이상 추가해주세요."),

  // 후원 플랜: 필수 선택
  platformPlan: z.enum(["BASIC", "PRO", "PREMIUM"], {
    required_error: "후원 플랜을 선택해주세요.",
  }),

  // 계좌 정보: 필수 선택
  bankAccountId: z
    .number({
      required_error: "후원 받을 계좌를 선택해주세요.",
    })
    .min(1, "후원 받을 계좌를 선택해주세요."),
})

export type StepThreeFormData = z.infer<typeof stepThreeSchema>
