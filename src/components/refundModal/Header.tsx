interface HeaderProps {
  moveToAddAccount: () => void
  moveToRefund: () => void
}

export default function Header({ moveToAddAccount, moveToRefund }: HeaderProps) {
  return (
    <>
      {/* Balance Card */}
      <div className="flex items-stretch mb-6 bg-white rounded-[20px] shadow-sm overflow-hidden min-w-fit border-pink-400 border-2">
        <div className="flex-1 p-5">
          <p className="text-sm font-medium text-gray-700">보유 코인</p>
          <h1 className="text-4xl font-bold mt-1 whitespace-nowrap">
            10000<span className="text-2xl">코인</span>
          </h1>
        </div>
        <div className="bg-pink-400 flex w-fit">
          <button
            type="button"
            className="text-white font-medium text-xl px-6 h-full flex items-center justify-center min-w-fit whitespace-nowrap"
            onClick={moveToRefund}
          >
            정산하기
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-4" />

      {/* Add Account Button */}
      <div className="flex justify-end mb-4">
        <button
          type="button"
          className="text-pink-400 font-medium flex items-center"
          onClick={moveToAddAccount}
        >
          계좌 추가 <span className="ml-1">+</span>
        </button>
      </div>
    </>
  )
}
