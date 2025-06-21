import React from "react"
import { DangerButton } from "../common/Button"

export default function WithdrawInfo() {
    return (
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">회원 탈퇴 안내</h2>
            <p className="text-gray-700 mb-6 text-center">
                회원 탈퇴를 진행하면 <b>모든 계정 정보와 데이터가 영구적으로 삭제</b>되며,<br />
                복구가 불가능합니다.<br />
                탈퇴 전 신중히 결정해 주세요.
            </p>
            <ul className="mb-6 text-sm text-gray-500 list-disc list-inside text-left">
                <li>진행 중인 프로젝트 및 후원 내역이 모두 삭제됩니다.</li>
                <li>탈퇴 후 동일 이메일로 재가입이 제한될 수 있습니다.</li>
                <li>탈퇴 시 개인정보 및 계좌 정보가 모두 삭제됩니다.</li>
            </ul>
            <DangerButton
                className="mt-4 px-8 py-3 rounded-xl font-bold text-lg transition"
                disabled
                data-cy="withdraw-button"
            >
                회원 탈퇴 (준비중)
            </DangerButton>
        </div>
    )
} 