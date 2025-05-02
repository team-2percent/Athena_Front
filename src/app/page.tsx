import Product from "@/components/common/Product";
import Carousel from "@/components/main/Carousel";
import RankProduct from "@/components/main/RankProduct";
import { Trophy } from "lucide-react";
import Image from "next/image";

export default function Home() {
  // Sample product data
  const topProducts = {
    1 :{
      id: 1,
      rank: 1,
      image: "/product-test.png",
      sellerName: "판매자 이름",
      productName: "상품 이름",
      achievementRate: 10,
      size: 360,
      liked: true,
      daysLeft: 5
    },
    2: {
      id: 2,
      rank: 2,
      image: "/product-test2.png",
      sellerName: "판매자 이름",
      productName: "상품 이름",
      achievementRate: 5,
      size: 230,
      liked: true,
      daysLeft: 1
    },
    3: {
      id: 3,
      rank: 3,
      image: "/product-test3.png",
      sellerName: "판매자 이름",
      productName: "상품 이름",
      achievementRate: 1.02,
      size: 200,
      liked: true,
      daysLeft: 2
    },
  }

  const gridProducts = Array.from({ length: 17 }, (_, i) => ({
    id: i + 4,
    rank: i + 4,
    image: "/product-test.png",
    sellerName: "판매자 이름",
    productName: "상품 이름",
    achievementRate: 0.8,
    size: 160,
    daysLeft: 10,
    liked: false,
  }))

  return (
    <div className="w-full h-fit flex flex-col items-center justify-center">
      <div className="container mx-auto px-4 py-8">
      <Carousel />
      {/* Popular Products */}
      <section className="mt-6 px-4">
          <h2 className="text-base font-medium mb-4">인기 상품</h2>

          {/* Top 3 Products - Responsive */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-2 mb-10 md:mb- md:items-end md:justify-center items-center">
            {/* 2nd Place */}
            <div className="h-fit w-fit order-2 md:order-1">
              <div className="flex items-end w-fit">
                <Trophy className="text-[rgb(204,204,204)] w-12 h-12" />
                <div className="text-left font-bold text-xl">2위</div>
              </div>
              <RankProduct
                {...topProducts[1]}
                size={180}
                // className="mx-auto md:mx-0"
              />
            </div>

            {/* 1st Place */}
            <div className="h-fit order-1 md:order-2">
              <div className="flex items-end w-fit">
                <Trophy className="text-[rgb(251,229,162)] w-14 h-14" />
                <div className="text-left font-bold text-2xl">1위</div>
              </div>
              <RankProduct
                {...topProducts[1]}
                size={220}
                // className="mx-auto md:mx-0"
              />
            </div>

            {/* 3rd Place */}
            <div className="h-fit order-3">
              <div className="flex items-end w-fit">
                <Trophy className="text-[rgb(222,169,155)] w-10 h-10" />
                <div className="text-left font-bold text-l">3위</div>
              </div>
              <RankProduct
                {...topProducts[2]}
                size={180}
                // className="mx-auto md:mx-0"
              />
            </div>
          </div>

          {/* Product Grid - Responsive */}
          <div className="flex items-center justify-center mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
              {gridProducts.map((product) => (
                <div key={product.id} className="mb-4">
                  <RankProduct
                    {...product}
                    size={120}
                    // className="mx-auto"
                    rankElement={<div className="font-medium text-base">{product.rank}</div>}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
    </div>
    </div>
  );
}
