import type { ReactNode } from "react"
import Product from "../common/Product"

interface CategoryProductProps {
    id: number
    image: string
    sellerName: string
    productName: string
    achievementRate: number
    liked: boolean
    daysLeft: number
}

const CategoryProduct = ({ id, image, sellerName, productName, achievementRate, liked, daysLeft }: CategoryProductProps) => {
    return (
        <Product 
            id={id}
            image={image}
            sellerName={sellerName}
            productName={productName}
            achievementRate={achievementRate}
            liked={liked}
            size={180}
            daysLeft={daysLeft}
            
        />
    )
}

export default CategoryProduct