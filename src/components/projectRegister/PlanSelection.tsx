"use client"
import { Check } from "lucide-react"
import { useProjectFormStore } from "@/stores/useProjectFormStore"
import type { PlanType } from "@/stores/useProjectFormStore"

interface PlanFeature {
  text: string
  included: boolean
}

interface PlanOption {
  type: PlanType
  title: string
  platformFee: string
  settlementFee: string
  features: PlanFeature[]
  color: string
  emoji: string
  description: string
  tagline: string
}

export default function PlanSelection() {
  const { planType, updateFormData } = useProjectFormStore()

  // 플랜 옵션 정의
  const planOptions: PlanOption[] = [
    {
      type: "basic",
      title: "Basic",
      platformFee: "3%",
      settlementFee: "0%",
      color: "bg-gray-100",
      emoji: "✍️",
      description: "나만의 프로젝트를 시작해 보세요",
      tagline: "처음 해보시는 분들께",
      features: [
        { text: "프로젝트 펀딩", included: true },
        { text: "프로젝트 운영권 발급", included: true },
      ],
    },
    {
      type: "pro",
      title: "Pro",
      platformFee: "5%",
      settlementFee: "0%",
      color: "bg-rose-100",
      emoji: "🎉",
      description: "메인 페이지 노출 기회",
      tagline: "더 많은 사람들이 보기를 원하신다면",
      features: [
        { text: "Basic의 모든 서비스", included: true },
        { text: "\"에디터 픽\"에 프로젝트 노출", included: true },
      ],
    },
    {
      type: "premium",
      title: "Premium",
      platformFee: "9%",
      settlementFee: "0%",
      color: "bg-orange-100",
      emoji: "👍",
      description: "최고의 성과를 달성하세요",
      tagline: "가장 큰 홍보 효과",
      features: [
        { text: "Pro의 모든 서비스", included: true },
        { text: "메인 상단에 크게 노출", included: true },
      ],
    },
  ]

  // 플랜 선택 핸들러
  const handleSelectPlan = (type: PlanType) => {
    updateFormData({ planType: type })
  }

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold">플랜 선택</h2>
        <p className="text-gray-500 mt-1">프로젝트에 맞는 플랜을 선택해 보세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planOptions.map((plan) => (
          <div key={plan.type} className="flex flex-col h-full">
            {/* 헤더 부분 */}
            <div className={`${plan.color} p-6 rounded-t-xl`}>
              <div className="text-lg mb-2">
                {plan.emoji} {plan.tagline}
              </div>
              <div className="text-base">{plan.description}</div>
            </div>

            {/* 본문 부분 */}
            <div className="border border-gray-200 border-t-0 rounded-b-xl p-6 flex-grow flex flex-col">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">{plan.title}</h3>
                  {plan.type === "premium" && (
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">실시 필요</span>
                  )}
                </div>

                <div className="mt-4">
                  <div className="text-lg">
                    플랫폼 수수료 <span className="text-rose-500 font-medium">{plan.platformFee}</span>
                  </div>
                </div>
              </div>

              {/* 선택 버튼 */}
              <button
                type="button"
                onClick={() => handleSelectPlan(plan.type)}
                className={`w-full py-3 px-4 rounded-lg border flex items-center justify-center mb-6 ${
                  planType === plan.type
                    ? "border-main-color text-main-color"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                선택하기 {planType === plan.type && <Check className="ml-2 h-5 w-5" />}
              </button>

              {/* 기능 목록 */}
              <div className="space-y-3 mt-auto">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-main-color">
                      {feature.included && <Check className="h-5 w-5" />}
                    </div>
                    <span className={`ml-2 ${!feature.included ? "text-gray-400" : ""}`}>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
