import { Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useApi } from "@/hooks/useApi"

import ConfirmModal from "../common/ConfirmModal"
import AlertModal from "../common/AlertModal"
import { GhostDangerButton, PrimaryButton } from "../common/Button"
import { TextInput } from "../common/Input"
import { ACCOUNT_HOLDER_MAX_LENGTH, BANK_ACCOUNT_MAX_LENGTH, BANK_NAME_MAX_LENGTH } from "@/lib/validationConstant"
import InputInfo from "../common/InputInfo"
import { accountAddSchema, accountHolderSchema, bankAccountSchema, bankNameSchema } from "@/lib/validationSchemas"
import useErrorToastStore from "@/stores/useErrorToastStore"
import { getValidatedString, validate } from "@/lib/validationUtil"

interface AccountInfo {
    id: number
    bankName: string
    bankAccount: string
    isDefault: boolean
    accountHolder: string
  }

export default function AccountInfo() {
  const { isLoading, apiCall } = useApi();
  const { showErrorToast } = useErrorToastStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDefaultModalOpen, setIsDefaultModalOpen] = useState(false); 
  // 계좌 정보 상태
  const [accounts, setAccounts] = useState<AccountInfo[]>([])
  const [accountAddError, setAccountAddError] = useState({
    accountHolder: "",
    bankName: "",
    bankAccount: "",
  })
  
  // 새 계좌 정보 폼
  const [newAccount, setNewAccount] = useState<Omit<AccountInfo, "id" | "isDefault">>({
      bankName: "",
      bankAccount: "",
      accountHolder: "",
  })

  const addButtonDisabled = accountAddSchema.safeParse(newAccount).error !== undefined;

  const [defaultId, setDefaultId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // 2. 컴포넌트 내부에 AlertModal 상태 추가 (useState 선언 부분 근처에 추가)
  const [alertMessage, setAlertMessage] = useState<string>("")
  const [isAlertOpen, setIsAlertOpen] = useState(false)

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
        // 3. alert 호출 부분 수정 (기본 계좌 삭제 시도 시)
        setAlertMessage("기본 계좌는 삭제할 수 없습니다!")
        setIsAlertOpen(true)
      } else if (status === 500) {
        showErrorToast("계좌 삭제 실패", "다시 시도해주세요.")
      }
    })
  }

  const setDefaultAccount = () => {
    if (defaultId === null) return;
      apiCall(`/api/bankAccount/state?bankAccountId=${defaultId}`, "PUT").then(({ error, status }) => {
      if (!error) {
        loadAccounts()
        setDefaultId(null)
        setIsDefaultModalOpen(false)
      } else if (status === 500) {
        showErrorToast("기본 계좌 변경 실패", "다시 시도해주세요.")
      }
    })
  }

  const handleNewAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "accountHolder") {
      const result = validate(value, accountHolderSchema)
      if (result.error) {
        setAccountAddError({ ...accountAddError, accountHolder: result.message })
      } else {
        setAccountAddError({ ...accountAddError, accountHolder: "" })
      }
      setNewAccount(prev => ({
        ...prev,
        accountHolder: getValidatedString(value, ACCOUNT_HOLDER_MAX_LENGTH),
      }))
    } else if (name === "bankName") {
      const result = validate(value, bankNameSchema)
      if (result.error) {
        setAccountAddError({ ...accountAddError, bankName: result.message })
      } else {
        setAccountAddError({ ...accountAddError, bankName: "" })
      }
      setNewAccount(prev => ({
        ...prev,
        bankName: getValidatedString(value, BANK_NAME_MAX_LENGTH),
      }))
    } else if (name === "bankAccount") {
      const result = validate(value, bankAccountSchema)
      if (result.error) {
        setAccountAddError({ ...accountAddError, bankAccount: result.message })
      } else {
        setAccountAddError({ ...accountAddError, bankAccount: "" })
      }
      setNewAccount(prev => ({
        ...prev,
        bankAccount: getValidatedString(value, BANK_ACCOUNT_MAX_LENGTH),
      }))
    }
  }

  // 계좌 추가 핸들러
  const handleAddAccount = () => {
    if (!newAccount.bankName || !newAccount.bankAccount) {
        setAlertMessage("은행명과 계좌번호를 모두 입력해주세요.")
        setIsAlertOpen(true)
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
      } else if (status === 500) {
        showErrorToast("계좌 추가 실패", "다시 시도해주세요.")
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


    return <div className="flex gap-4 w-full">
      {/* 5. 컴포넌트 return 문 내부 최상단에 AlertModal 컴포넌트 추가 */}
      <AlertModal isOpen={isAlertOpen} message={alertMessage} onClose={() => setIsAlertOpen(false)} />
      <ConfirmModal isOpen={isDefaultModalOpen} message={"기본 계좌로 설정할까요?"} onConfirm={setDefaultAccount} onClose={() => setIsDefaultModalOpen(false)} dataCy="default-account-confirm-modal"/>
      <ConfirmModal isOpen={isDeleteModalOpen} message={"계좌를 삭제할까요?"} onConfirm={deleteAccount} onClose={() => setIsDeleteModalOpen(false)} dataCy="delete-account-confirm-modal"/>
        {/* 계좌 추가 폼 */}
        <div className="flex-1 bg-white rounded-lg shadow py-6 px-10" data-cy="account-add-form">
            <h3 className="text-lg font-medium mb-6">새 계좌 추가</h3>
            <div className="flex gap-4 flex-col">
            <div>
                <label className="block text-sm font-medium text-sub-gray mb-1">이름</label>
                <TextInput
                  className="w-full"
                  name="accountHolder"
                  value={newAccount.accountHolder}
                  onChange={handleNewAccountChange}
                  placeholder="이름"
                  dataCy="account-name-input"
                />
                <InputInfo errorMessage={accountAddError.accountHolder} errorMessageDataCy="account-name-error-message"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-sub-gray mb-1">은행명</label>
                <TextInput
                className="w-full"
                  name="bankName"
                  value={newAccount.bankName}
                  onChange={handleNewAccountChange}
                  placeholder="은행명"
                  dataCy="account-bank-input"
                />
                <InputInfo errorMessage={accountAddError.bankName} errorMessageDataCy="account-bank-error-message"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-sub-gray mb-1">계좌번호</label>
                <TextInput
                className="w-full"
                  name="bankAccount"
                  value={newAccount.bankAccount}
                  onChange={handleNewAccountChange}
                  placeholder="계좌번호"
                  dataCy="account-number-input"
                />
                <InputInfo errorMessage={accountAddError.bankAccount} errorMessageDataCy="account-number-error-message"/>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <PrimaryButton
                type="button"
                onClick={handleAddAccount}
                className="flex items-center appearance-none"
                disabled={addButtonDisabled}
                dataCy="account-add-button"
              >
                <Plus className="w-4 h-4 mr-1" /> 계좌 추가
              </PrimaryButton>
            </div>
          </div>
        {/* 계좌 목록 */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow py-6 px-10 justify-between" data-cy="account-list">
            <h3 className="text-lg font-medium mb-6">등록된 계좌 목록</h3>
            <div className="flex-1 flex flex-col gap-4" data-cy="account-list">
            {accounts.length === 0 ? (
                    <p className="text-sub-gray text-center py-4">등록된 계좌가 없습니다.</p>
                ) : (
                    <div className="space-y-3 mt-2">
                    {accounts.map((account) => (
                        <div key={account.id} className="flex items-center justify-between border-b pb-3" data-cy="account-list-item">
                        <div className="flex items-center">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{account.bankName}</p>
                                <p className="text-sm text-sub-gray">{account.accountHolder}</p>
                              </div>
                              <p className="text-sm text-sub-gray">{account.bankAccount}</p>
                            </div>
                            {account.isDefault ? 
                            <span
                              className="ml-2 px-2 py-0.5 bg-secondary-color text-main-color text-xs rounded-full"
                              data-cy="account-default-mark"
                            >기본</span>
                            :
                            <button
                              className="border-box ml-2 px-2 py-0.5 text-xs text-main-color underline"
                              onClick={() => handleClickSetDefaultButton(account.id)}
                              data-cy="account-default-change-button"
                            >기본 계좌로 설정</button>
                            }
                        </div>
                        {
                          !account.isDefault &&
                          <GhostDangerButton
                              onClick={() => handleClickDeleteButton(account.id)}
                              className="w-fit h-fit p-2 rounded-full"
                              dataCy="account-delete-button"
                          >
                              <Trash2 className="w-4 h-4" />
                          </GhostDangerButton>
                        }
                        </div>
                    ))}  
                    </div>
                )}
            </div>
        </div>
        </div>
}