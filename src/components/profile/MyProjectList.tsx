"use client"

import { useState } from "react";
import ProductItem from "./ProductItem";
import DeleteModal from "./DeleteModal";

export default function MyProductList({ products, deleteProduct }: { products: any[], deleteProduct: (id: number) => void }) {
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
        e.stopPropagation()
        setIsOpenDeleteModal(true);
        setDeleteId(id);
      }
    
      const handleCloseDeleteModal = () => {
        setIsOpenDeleteModal(false);
        setDeleteError(false);
        setDeleteSuccess(false);
      }
    
      const handleConfirmDelete = () => {
        if (deleteId !== null) {
        deleteProduct(deleteId);
        if (false) { // 삭제 조건
          setDeleteSuccess(true)
        } else {
          setDeleteError(true);
        }
      }
    }

    return (
        <div>
            {isOpenDeleteModal && 
            <DeleteModal
                isOpen={isOpenDeleteModal}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                deleteError={deleteError} deleteSuccess={deleteSuccess}      />}
            {products.map((product) => (
              <ProductItem
                key={product.id}
                id={product.id}
                sellerName={product.sellerName}
                productName={product.productName}
                description={product.description}
                imageUrl={product.imageUrl}
                achievementRate={product.achievementRate}
                daysLeft={product.daysLeft}
                isCompleted={product.isCompleted}
                productId={product.productId}
                onClickDelete={handleDeleteClick}
                isMy={true}
              />
            ))}
        </div>
    )
}