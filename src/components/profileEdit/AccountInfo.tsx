import clsx from "clsx"
import { Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useApi } from "@/hooks/useApi"
import ConfirmModal from "../common/ConfirmModal"

interface AccountInfo {
    id: number
    bankName: string
    bankAccount: string
    isDefault: boolean
    accountHolder: string
  }

export default function AccountInfo() {
  const { isLoading, apiCall } = useApi();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDefaultModalOpen, setIsDefaultModalOpen] = useState(false); 
  // 계좌 정보 상태
  const [accounts, setAccounts] = useState<AccountInfo[]>([])

  // 새 계좌 정보 폼
  const [newAccount, setNewAccount] = useState<Omit<AccountInfo, "id" | "isDefault">>({
      bankName: "",
      bankAccount: "",
      accountHolder: "",
  })

  const [defaultId, setDefaultId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadAccounts = () => {
    apiCall<AccountInfo[]>("/api/bankAccount", "GET").then(({ data }) => {
      if (data) {
        setAccounts(data)
      }
    })
  }

  const deleteAccount = () => {
    if (deleteId === null) return;
    apiCall(`/api/bankAccount?bankAccountId=${deleteId}`, "DELETE").then(({ error, status }) => {
      if (!error) {
        loadAccounts()
        setDeleteId(null);
        setIsDeleteModalOpen(false)
      } else if (status === 409) {
        alert("기본 계좌는 삭제할 수 없습니다!")
      } else {
        console.log("삭제 실패")
      }
    })
  }

  const setDefaultAccount = () => {
    if (defaultId === null) return;
      apiCall(`/api/bankAccount/state?bankAccountId=${defaultId}`, "PUT").then(({ error }) => {
      if (!error) {
        loadAccounts()
        setDefaultId(null)
        setIsDefaultModalOpen(false)
      } else {
        console.log("설정 실패")
      }
    })
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
    if (!newAccount.bankName || !newAccount.bankAccount) {
        alert("은행명과 계좌번호를 모두 입력해주세요.")
        return
    }

    apiCall("/api/bankAccount", "POST", {
      accountNumber: newAccount.bankAccount,
      accountHolder: newAccount.accountHolder,
      bankName: newAccount.bankName
    }).then(({ error, status }) => {
      if (!error) {
        setNewAccount({ bankName: "", bankAccount: "", accountHolder: "" }) // 폼 초기화
        loadAccounts();
      }
    }) 
  }

  // 삭제 버튼 핸들러
  const handleClickDeleteButton = (accountId: number) => {
    setDeleteId(accountId)
    setIsDeleteModalOpen(true)
  }

  // 기본 설정 버튼 핸들러
  const handleClickSetDefaultButton = (accountId: number) => {
    setDefaultId(accountId)
    setIsDefaultModalOpen(true)
  }

  useEffect(() => {
    loadAccounts();
  }, []);


    return <div className="flex gap-4">
      <ConfirmModal isOpen={isDefaultModalOpen} message={"기본 계좌로 설정할까요?"} onConfirm={setDefaultAccount} onClose={() => setIsDefaultModalOpen(false)} />
      <ConfirmModal isOpen={isDeleteModalOpen} message={"계좌를 삭제할까요?"} onConfirm={deleteAccount} onClose={() => setIsDeleteModalOpen(false)} />
        {/* 계좌 추가 폼 */}
        <div className="flex-1 bg-white rounded-lg shadow py-6 px-10">
            <h3 className="text-lg font-medium mb-6">새 계좌 추가</h3>
            <div className="flex gap-4 flex-col">
            <div>
                <label className="block text-sm font-medium text-sub-gray mb-1">이름</label>
                <input
                  type="text"
                  name="accountHolder"
                  value={newAccount.accountHolder}
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
                  name="bankAccount"
                  value={newAccount.bankAccount}
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
                className="px-4 py-2 bg-main-color text-white rounded-md hover:bg-secondary-color-dark text-sm flex items-center appearance-none"
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
                            <div>
                            <p className="font-medium">{account.bankName}</p>
                            <p className="text-sm text-sub-gray">{account.bankAccount}</p>
                            </div>
                            {account.isDefault ? 
                            <span className="ml-2 px-2 py-0.5 bg-secondary-color text-main-color text-xs rounded-full">기본</span>
                            :
                            <button
                              className="border-box ml-2 px-2 py-0.5 text-xs text-main-color rounded-full border border-main-color"
                              onClick={() => handleClickSetDefaultButton(account.id)}
                            >기본 계좌로 설정</button>
                            }
                        </div>
                        <button
                            type="button"
                            onClick={() => handleClickDeleteButton(account.id)}
                            className="text-sub-gray hover:text-red-500"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        </div>
                    ))}  
                    </div>
                )}
            </div>
        </div>
        </div>
}