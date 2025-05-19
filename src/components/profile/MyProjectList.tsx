"use client"

import type React from "react"

import { useState } from "react"
import ProjectItem from "./ProjectItem"
import DeleteModal from "./DeleteModal"

export default function MyProjectList({
  projects,
  deleteProject,
}: { projects: any[]; deleteProject: (id: number) => void }) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const [deleteError, setDeleteError] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.stopPropagation()
    setIsOpenDeleteModal(true)
    setDeleteId(id)
    setDeleteError(false)
    setDeleteSuccess(false)
  }

  const handleCloseDeleteModal = () => {
    setIsOpenDeleteModal(false)
    setDeleteError(false)
    setDeleteSuccess(false)
  }

  const handleConfirmDelete = () => {
    if (deleteId !== null) {
      try {
        deleteProject(deleteId)
        setDeleteSuccess(true)
      } catch (error) {
        console.error("상품 삭제에 실패했습니다.", error)
        setDeleteError(true)
      }
    }
  }

  return (
    <div>
      {isOpenDeleteModal && (
        <DeleteModal
          isOpen={isOpenDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          deleteError={deleteError}
          deleteSuccess={deleteSuccess}
        />
      )}
      {projects.map((project) => (
        <ProjectItem
          key={project.id}
          id={project.id}
          sellerName={project.sellerName}
          projectName={project.projectName}
          description={project.description}
          imageUrl={project.imageUrl}
          achievementRate={project.achievementRate}
          daysLeft={project.daysLeft}
          isCompleted={project.isCompleted}
          projectId={project.projectId}
          onClickDelete={(e) => handleDeleteClick(e, project.id)}
          isMy={true}
        />
      ))}
    </div>
  )
}
