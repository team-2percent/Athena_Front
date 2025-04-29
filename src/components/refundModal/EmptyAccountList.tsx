import { AlertTriangle } from "lucide-react"

export default function EmptyAccountList() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-fit mt-10 ">
      <div className="bg-pink-400 p-4 rounded-full mb-4">
        <AlertTriangle className="h-8 w-8 text-white" />
      </div>
      <p className="text-lg font-medium mb-2">등록된 계좌가 없습니다.</p>
      <p className="text-lg font-medium">정산 받을 계좌를 추가해주세요.</p>
    </div>
  )
}
