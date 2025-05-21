import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

const categories = [
  { id: "all", name: "전체", active: true },
  { id: "design", name: "디자인 문구", active: false },
  { id: "food", name: "푸드", active: false },
  { id: "boardgame", name: "보드게임", active: false },
  { id: "doll", name: "인형", active: false },
]

const topProducts = [
  {
    id: 1,
    rank: 1,
    image: "https://img.tumblbug.com/eyJidWNrZXQiOiJ0dW1ibGJ1Zy1pbWctYXNzZXRzIiwia2V5IjoiY292ZXIvYWIwNGI4MjctNDdhMy00MTE0LWJiYWYtNmY3ZTYzYWZiM2E0LzhlZGNhOWM0LTdhOGUtNDFjOS1iNzg1LTQ5ZDdjNjEzY2M2MS5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQ2NSwiaGVpZ2h0Ijo0NjUsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX19fQ==",
    title: "무슨무슨 트러플 초콜릿",
    seller: "판매자 이름",
    description: "무슨무슨 재료로 만들었습니다. 사려면 지금이 기회!",
    achievement: "10000% 달성!",
    featured: true,
  },
  {
    id: 2,
    rank: 2,
    image: "https://img.tumblbug.com/eyJidWNrZXQiOiJ0dW1ibGJ1Zy1pbWctYXNzZXRzIiwia2V5IjoiY292ZXIvYWIwNGI4MjctNDdhMy00MTE0LWJiYWYtNmY3ZTYzYWZiM2E0LzhlZGNhOWM0LTdhOGUtNDFjOS1iNzg1LTQ5ZDdjNjEzY2M2MS5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQ2NSwiaGVpZ2h0Ijo0NjUsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX19fQ==",
    title: "무슨무슨 트러플 초콜릿",
    seller: "판매자 이름",
    description: "무슨무슨 재료로 만들었습니다. 사려면 지금이 기회!",
    achievement: "10000% 달성!",
  },
  {
    id: 3,
    rank: 3,
    image: "https://img.tumblbug.com/eyJidWNrZXQiOiJ0dW1ibGJ1Zy1pbWctYXNzZXRzIiwia2V5IjoiY292ZXIvYWIwNGI4MjctNDdhMy00MTE0LWJiYWYtNmY3ZTYzYWZiM2E0LzhlZGNhOWM0LTdhOGUtNDFjOS1iNzg1LTQ5ZDdjNjEzY2M2MS5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQ2NSwiaGVpZ2h0Ijo0NjUsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX19fQ==", // Reusing image for demo
    title: "무슨무슨 트러플 초콜릿",
    seller: "판매자 이름",
    description: "무슨무슨 재료로 만들었습니다. 사려면 지금이 기회!",
    achievement: "10000% 달성!",
  },
  {
    id: 4,
    rank: 4,
    image: "https://img.tumblbug.com/eyJidWNrZXQiOiJ0dW1ibGJ1Zy1pbWctYXNzZXRzIiwia2V5IjoiY292ZXIvYWIwNGI4MjctNDdhMy00MTE0LWJiYWYtNmY3ZTYzYWZiM2E0LzhlZGNhOWM0LTdhOGUtNDFjOS1iNzg1LTQ5ZDdjNjEzY2M2MS5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQ2NSwiaGVpZ2h0Ijo0NjUsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX19fQ==", // Reusing image for demo
    title: "무슨무슨 트러플 초콜릿",
    seller: "판매자 이름",
    description: "무슨무슨 재료로 만들었습니다. 사려면 지금이 기회!",
    achievement: "10000% 달성!",
  },
  {
    id: 5,
    rank: 5,
    image: "https://img.tumblbug.com/eyJidWNrZXQiOiJ0dW1ibGJ1Zy1pbWctYXNzZXRzIiwia2V5IjoiY292ZXIvYWIwNGI4MjctNDdhMy00MTE0LWJiYWYtNmY3ZTYzYWZiM2E0LzhlZGNhOWM0LTdhOGUtNDFjOS1iNzg1LTQ5ZDdjNjEzY2M2MS5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQ2NSwiaGVpZ2h0Ijo0NjUsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX19fQ==", // Reusing image for demo
    title: "무슨무슨 트러플 초콜릿",
    seller: "판매자 이름",
    description: "무슨무슨 재료로 만들었습니다. 사려면 지금이 기회!",
    achievement: "10000% 달성!",
  },
]

export default function TopFive() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <h2 className="text-2xl font-bold">
          BEST <span className="text-main-color">TOP 5</span> <span className="text-2xl">🏆</span>
        </h2>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              category.active ? "bg-main-color text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300",
            )}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Top products grid - revised layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Featured product (larger) - takes up half the grid */}
        {topProducts
          .filter((product) => product.featured)
          .map((product) => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden">
              <div className="relative">
                <div className="absolute top-2 left-2 z-10">
                  <div className="bg-main-color text-white w-8 h-8 flex items-center justify-center rounded-sm font-bold">
                    {product.rank}
                  </div>
                </div>
                <div className="relative aspect-square">
                    <img 
                        src={product.image || "/placeholder.svg"} 
                        alt={product.title} 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600">{product.seller}</p>
                  <h3 className="font-bold text-lg mt-1">{product.title}</h3>
                  <p className="text-sm mt-1">{product.description}</p>
                  <p className="text-main-color font-bold mt-2">{product.achievement}</p>
                </div>
              </div>
            </div>
          ))}

        {/* Regular products (smaller) - takes up the other half in a 2x2 grid */}
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          {topProducts
            .filter((product) => !product.featured)
            .map((product) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden">
                <div className="relative">
                    <div className="absolute top-2 left-2 z-10">
                        <div className="bg-main-color text-white w-6 h-6 flex items-center justify-center rounded-sm font-bold text-sm">
                        {product.rank}
                        </div>
                    </div>
                    <div className="relative aspect-square">
                    <img 
                        src={product.image || "/placeholder.svg"} 
                        alt={product.title} 
                        className="w-full h-full object-cover"
                    />
                    </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-600">{product.seller}</p>
                    <h3 className="font-bold text-sm">{product.title}</h3>
                    <p className="text-main-color font-bold text-xs mt-1">{product.achievement}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* View all projects button */}
      <div className="flex justify-end mt-8">
        <Link
          href="#"
          className="inline-flex items-center px-4 py-2 border border-main-color text-main-color rounded hover:bg-pink-50 transition-colors"
        >
          프로젝트 전체보기 →
        </Link>
      </div>
    </div>
  )
}
