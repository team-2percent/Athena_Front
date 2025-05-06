import ListProduct from "./ListProduct"

export default function ProductsList({ products }: {
    products: {
        id: number
        image: string
        sellerName: string
        productName: string
        achievementRate: number
        description: string
        liked: boolean
        daysLeft: number
    }[]
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
      <div className="w-fit grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-20 gap-x-[10px] justify-items-center">
        {products.map((product) => (
          <ListProduct 
            key={product.id}
            id={product.id}
            image={product.image}
            sellerName={product.sellerName}
            productName={product.productName}
            achievementRate={product.achievementRate}
            description={product.description}
            liked={false}
            daysLeft={product.daysLeft} />
        ))}
      </div>
    </div>
  )
}