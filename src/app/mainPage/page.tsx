import Header from "@/components/header/Header"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-6 text-4xl font-bold text-gray-900">Athenna에 오신 것을 환영합니다</h1>
        <p className="text-lg text-gray-700">여기에 메인 페이지 콘텐츠가 들어갑니다.</p>
      </div>
    </main>
  )
}
