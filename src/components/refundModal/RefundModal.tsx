"use client"

import { useState } from "react"
import { X } from "lucide-react"
import Header from "./Header"
import AccountList from "./AccountList"
import EmptyAccountList from "./EmptyAccountList"
import type { Account } from "./interfaces"
import BackButton from "./BackButton"

// View types
// "accounts" : 메인(계좌 목록)
// "form" : 계좌 추가
// "refund" : 환불 내역
type ViewType = "main" | "form" | "refund"

interface RefundModalProps {
  initialView?: ViewType
  accounts?: Array<Account>
}

export default function RefundModal({ initialView = "main", accounts = [] }: RefundModalProps) {
  const [currentView, setCurrentView] = useState<ViewType>(initialView)

  // 메인 영역으로 이동
  const handleBackClick = () => {
    setCurrentView("main")
  }

  // 계좌 추가 영역으로 이동
  const handleAddAccountClick = () => {
    setCurrentView("form")
  }

  // 정산 영역으로 이동
  const handleRefundClick = () => {
    setCurrentView("refund");
  }

  // 계좌 삭제
  const handleDeleteAccount = (id: number) => {
    // 계좌 삭제 로직 삽입 필요
    console.log(`계좌 ${id} 삭제`)
  }

  // 내부 영역 변환
  const renderInnerContent = () => {
    switch (currentView) {
      case "main":
        return accounts.length > 0 ? <AccountList accounts={accounts} onDelete={handleDeleteAccount} /> : <EmptyAccountList />
      case "form":
        return (
          <div>계좌 추가</div>
        )
      case "refund":
        return (
          <div>정산</div>
        )
      default:
        return accounts.length > 0 ? <AccountList accounts={accounts} onDelete={handleDeleteAccount}  /> : <EmptyAccountList />
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-[800px] h-[600px] bg-white p-6 rounded-3xl shadow-lg overflow-hidden min-w-fit">
        {/* 닫기 버튼 */}
        <div className="flex justify-end mb-4">
          <button type="button" className="text-gray-400">
            <X className="h-5 w-5" />
          </button>
        </div>
        {
          currentView === "main" ?
          <Header moveToAddAccount={handleAddAccountClick} moveToRefund={handleRefundClick}/>
          :
          <BackButton onClick={handleBackClick} />
        }
        
        {renderInnerContent()}
      </div>
    </div>
  )
}
