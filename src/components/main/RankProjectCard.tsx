import type { ReactNode } from "react"
import Product from "../common/Product"

interface RankProductProps {
    id: number
    image: string
    sellerName: string
    productName: string
    achievementRate: number
    liked: boolean
    size: number
    daysLeft: number
    rankElement?: ReactNode
}

const RankProduct = ({ id, image, sellerName, productName, achievementRate, liked, size, daysLeft, rankElement }: RankProductProps) => {
    return (
        <Product 
            id={id}
            image={image}
            sellerName={sellerName}
            productName={productName}
            achievementRate={achievementRate}
            liked={liked}
            size={size}
            daysLeft={daysLeft}
            rankElement={rankElement}
        />
    )
}

export default RankProduct