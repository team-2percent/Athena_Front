import ProductDetail from "@/components/productDetail/ProductDetail"
import DonateDock from "@/components/productDetail/DonateDock"

export default function ProductDetailPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* 상품 상세 페이지 영역 */}
        <ProductDetail />
      </div>
      {/* 후원하기 독 영역 */}
      <DonateDock />
    </main>
  )
}
