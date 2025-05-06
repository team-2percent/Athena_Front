import Product from "../common/Product"


interface ListProductProps {
    id: number
    image: string
    sellerName: string
    productName: string
    achievementRate: number
    description: string
    liked: boolean
    daysLeft: number
}

export default function ListProduct({ id, image, sellerName, productName, achievementRate, description, liked, daysLeft }: ListProductProps) {
  return (
    <Product
      id={id}
      image={image}
      sellerName={sellerName}
      productName={productName}
      achievementRate={achievementRate}
      description={description}
      liked={liked}
      daysLeft={daysLeft}
      showProgressBar={true}
    />
  )
}