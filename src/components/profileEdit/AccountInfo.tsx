import clsx from "clsx"
import { Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

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

    // 저장 가능 여부
    const [saveable, setSaveable] = useState(false)

    // 기본 계좌 설정 핸들러
    const handleSetDefaultAccount = (id: string) => {
        setAccounts(
        accounts.map((account) => ({
            ...account,
            isDefault: account.id === id,
        })),
        )
        setSaveable(true)
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
        // 추가 api 호출 및 계좌 리스트 다시 불러오기
    }

    // 계좌 정보 삭제 핸들러
    const handleRemoveAccount = (id: string) => {
        const updatedAccounts = accounts.filter((account) => account.id !== id)

        // 기본 계좌 설정 확인
        if (updatedAccounts.length > 0 && accounts.find((a) => a.id === id)?.isDefault) {
        updatedAccounts[0].isDefault = true
        }

        setAccounts(updatedAccounts)
        setSaveable(true)
    }
    

    // 저장 핸들러
    function handleSave(): void {
        // 저장 api 호출
        // 저장 성공 시 저장 가능 여부 초기화
        console.log("save");
        setSaveable(false)
    }

    return <div className="flex gap-4">
        {/* 계좌 추가 폼 */}
        <div className="flex-1 bg-white rounded-lg shadow py-6 px-10">
            <h3 className="text-lg font-medium mb-6">새 계좌 추가</h3>
            <div className="flex gap-4 flex-col">
            <div>
                <label className="block text-sm font-medium text-sub-gray mb-1">이름</label>
                <input
                  type="text"
                  name="name"
                  value={newAccount.name}
                  onChange={handleNewAccountChange}
                  className="w-full px-3 py-2 border border-gray-border rounded-md focus:outline-none focus:ring-2 focus:ring-main-color"
                  placeholder="이름"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sub-gray mb-1">은행명</label>
                <input
                  type="text"
                  name="bankName"
                  value={newAccount.bankName}
                  onChange={handleNewAccountChange}
                  className="w-full px-3 py-2 border border-gray-border rounded-md focus:outline-none focus:ring-2 focus:ring-main-color"
                  placeholder="은행명"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sub-gray mb-1">계좌번호</label>
                <input
                  type="number"
                  name="accountNumber"
                  value={newAccount.accountNumber}
                  onChange={handleNewAccountChange}
                  className="w-full px-3 py-2 border border-gray-border rounded-md focus:outline-none focus:ring-2 focus:ring-main-color"
                  placeholder="계좌번호"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleAddAccount}
                className="px-4 py-2 bg-main-color text-white rounded-md hover:bg-pink-600 text-sm flex items-center appearance-none"
              >
                <Plus className="w-4 h-4 mr-1" /> 계좌 추가
              </button>
            </div>
          </div>
        {/* 계좌 목록 */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow py-6 px-10 justify-between">
            <h3 className="text-lg font-medium mb-6">등록된 계좌 목록</h3>
            <div className="flex-1 flex flex-col gap-4">
            {accounts.length === 0 ? (
                    <p className="text-sub-gray text-center py-4">등록된 계좌가 없습니다.</p>
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
                            className="w-4 h-4 text-main-color border-gray-border focus:ring-main-color mr-3"
                            />
                            <div>
                            <p className="font-medium">{account.bankName}</p>
                            <p className="text-sm text-sub-gray">{account.accountNumber}</p>
                            </div>
                            {account.isDefault && (
                            <span className="ml-2 px-2 py-0.5 bg-secondary-color text-main-color text-xs rounded-full">기본</span>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveAccount(account.id)}
                            className="text-sub-gray hover:text-red-500"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        </div>
                    ))}  
                    </div>
                )}
            </div>
            <div className="flex gap-2 justify-end items-end flex-wrap mt-4">
                <p className="text-sm font-medium text-sub-gray">※ 저장하지 않고 페이지를 나갈 시 변경사항이 저장되지 않습니다.</p>
                <button
                    disabled={!saveable}
                    className={clsx("text-white rounded-md text-sm px-4 py-2", saveable ? "bg-main-color hover:bg-secondary-color-dark": "bg-disabled-background")}
                    onClick={handleSave}
                >
                    저장
                </button>
            </div>  
        </div>
        </div>
}