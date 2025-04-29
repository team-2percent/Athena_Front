"use client"

import { Trash2 } from "lucide-react"
import type { Account } from "./interfaces"

interface AccountListProps {
  accounts: Account[]
  onDelete?: (id: number) => void
}

export default function AccountList({ accounts, onDelete }: AccountListProps) {
  return (
    <div className="mb-4 space-y-3 h-100 overflow-y-scroll">
      {accounts.map((account) => (
        <div key={account.id} className="border border-pink-200 rounded-3xl p-4 flex justify-between items-center">
          <div>
            <p className="text-gray-800 mb-1">{account.bank}</p>
            <p className="text-lg font-medium">{account.accountNumber}</p>
          </div>
          <button
            type="button"
            className="text-pink-300"
            onClick={() => onDelete?.(account.id)}
            aria-label="계좌 삭제"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  )
}
