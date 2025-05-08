import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"

interface AccountInfo {
    id: string
    bankName: string
    accountNumber: string
    isDefault: boolean
    name: string
  }

export default function AccountInfo() {
    // 계좌 정보 상태
    const [accounts, setAccounts] = useState<AccountInfo[]>([
        {
        id: "1",
        bankName: "국민은행",
        accountNumber: "123-456-789012",
        isDefault: true,
        name: "홍길동"
        },
    ])

    // 새 계좌 정보 폼
    const [newAccount, setNewAccount] = useState<Omit<AccountInfo, "id" | "isDefault">>({
        bankName: "",
        accountNumber: "",
        name: "",
    })

    // 기본 계좌 설정 핸들러
    const handleSetDefaultAccount = (id: string) => {
        setAccounts(
        accounts.map((account) => ({
            ...account,
            isDefault: account.id === id,
        })),
        )
    }

    // 새 계좌 정보 변경 핸들러
    const handleNewAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewAccount({
        ...newAccount,
        [name]: value,
        })
    }

    // 계좌 추가 핸들러
    const handleAddAccount = () => {
        if (!newAccount.bankName || !newAccount.accountNumber) {
        alert("은행명과 계좌번호를 모두 입력해주세요.")
        return
        }

        const accountToAdd: AccountInfo = {
        id: Date.now().toString(),
        bankName: newAccount.bankName,
        accountNumber: newAccount.accountNumber,
        isDefault: accounts.length === 0,
        name: newAccount.name,
        }

        setAccounts([...accounts, accountToAdd])
        setNewAccount({ bankName: "", accountNumber: "", name: "" }) // 폼 초기화
    }

    // 계좌 정보 삭제 핸들러
    const handleRemoveAccount = (id: string) => {
        const updatedAccounts = accounts.filter((account) => account.id !== id)

        // 기본 계좌 설정 확인
        if (updatedAccounts.length > 0 && accounts.find((a) => a.id === id)?.isDefault) {
        updatedAccounts[0].isDefault = true
        }

        setAccounts(updatedAccounts)
    }
    
    return <div className="flex gap-4">
        {/* 계좌 추가 폼 */}
        <div className="flex-1 bg-white rounded-lg shadow py-6 px-10">
            <h3 className="text-lg font-medium mb-6">새 계좌 추가</h3>
            <div className="flex gap-4 flex-col">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <input
                  type="text"
                  name="name"
                  value={newAccount.name}
                  onChange={handleNewAccountChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="이름"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">은행명</label>
                <input
                  type="text"
                  name="bankName"
                  value={newAccount.bankName}
                  onChange={handleNewAccountChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="은행명"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">계좌번호</label>
                <input
                  type="number"
                  name="accountNumber"
                  value={newAccount.accountNumber}
                  onChange={handleNewAccountChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="계좌번호"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleAddAccount}
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 text-sm flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" /> 계좌 추가
              </button>
            </div>
          </div>
        {/* 계좌 목록 */}
        <div className="flex-1 bg-white rounded-lg shadow py-6 px-10">
        
        <h3 className="text-lg font-medium mb-6">등록된 계좌 목록</h3>
          {accounts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">등록된 계좌가 없습니다.</p>
          ) : (
            <div className="space-y-3 mt-2">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={`default-account-${account.id}`}
                      name="default-account"
                      checked={account.isDefault}
                      onChange={() => handleSetDefaultAccount(account.id)}
                      className="w-4 h-4 text-pink-500 border-gray-300 focus:ring-pink-300 mr-3"
                    />
                    <div>
                      <p className="font-medium">{account.bankName}</p>
                      <p className="text-sm text-gray-500">{account.accountNumber}</p>
                    </div>
                    {account.isDefault && (
                      <span className="ml-2 px-2 py-0.5 bg-pink-100 text-pink-600 text-xs rounded-full">기본</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAccount(account.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
}