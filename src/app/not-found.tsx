import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 w-full">
      <h1 className="text-6xl font-bold text-main-color mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">페이지를 찾을 수 없습니다</h2>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        요청하신 페이지가 존재하지 않거나, 이동되었을 수 있습니다.<br />
        입력하신 주소가 정확한지 다시 한 번 확인해 주세요.
      </p>
      <Link href="/" className="px-6 py-3 bg-main-color text-white rounded-lg font-semibold shadow hover:bg-secondary-color-dark transition">
        메인으로 돌아가기
      </Link>
    </div>
  );
} 