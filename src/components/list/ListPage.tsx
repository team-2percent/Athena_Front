"use client"

import { useEffect, useRef, useState } from "react";
import ListHeader from "./ListHeader";
import ProductsList from "./ProductsList";

interface ListPageProps {
    type: "new" | "deadline" | "category" | "search"
    categoryId?: number
    searchWord?: string
}

const sorts = {
    "deadline" : ["deadline", "recommend", "view", "achievement"],
    "category" : ["new", "recommend", "view", "achievement"],
    "search" : ["new", "recommend", "view", "achievement"],
}

export default function ListPage({ type, categoryId, searchWord }: ListPageProps) {
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [morePage, setMorePage] = useState(true); // 더 불러올 페이지가 있는지
    const [totalCount, setTotalCount] = useState(0);
    const loader = useRef(null);
    const [sort, setSort] = useState(type === "new" ? null : sorts[type][0]);

    const loadUrl = `backendURL/${type}${type === "category" ? `/${categoryId}` : type === "search" ? `?query=${searchWord}` : ""}` // 추후 수정

    const [products, setProducts] = useState(Array(20).fill({}).map((_, index) => (
        {
            id: index + 1,
            image: "/product-test.png",
            sellerName: "John Doe",
            productName: "Product 1",
            achievementRate: 50,
            description: "This is a description of the productThis is a description of the productThis is a description of the product",
            liked: false,
            daysLeft: 10
        }
    )
    ))

    const loadMoreProducts = () => {
        setProducts(prevProducts => [...prevProducts, ...Array(20).fill({}).map((_, index) => (
            {
                id: index * 2 + 1,
                image: "/product-test.png",
                sellerName: "John Doe",
                productName: "Product 1",
                achievementRate: 50,
                description: "This is a description of the productThis is a description of the productThis is a description of the product",
                liked: false,
                daysLeft: 10
            }
        )
        )])
        setIsLoading(false);
    }

    const handleSortClick = (sort: "new" | "deadline" | "recommend" | "view" | "achievement") => {
        setSort(sort);
    }

    useEffect(() => {
        setTotalCount(999999);
    }, [products])
    // 옵저버로 loading bar 나오면 loadMore 동작
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && morePage) {
          setIsLoading(true);
          loadMoreProducts();
        }
      },
      { threshold: 0.8 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }
    return () => observer.disconnect();
  }, [isLoading, morePage]);


  useEffect(() => {
    // 페이지 불러오기 로직
    // currentPage 변경, morePage 변경
  }, [products]);

  return (
    <div>
        <ListHeader
            type={type}
            count={totalCount}
            searchWord={searchWord}
            sort={sort as "new" | "deadline" | "recommend" | "view" | "achievement" | null}
            onClickSort={handleSortClick}
        /> 
        <ProductsList products={products} />
        { 
            morePage && 
            <div className="w-full py-20 flex justify-center items-center" ref={loader}>
                <p className="text-2xl font-medium text-[#ff8fab]">Loading...</p>
            </div>
        }
    </div>
  )
}