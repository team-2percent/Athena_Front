"use client"

import { useState } from "react"
import Image from "next/image"
import clsx from "clsx"
import ConfirmModal from "@/components/common/ConfirmModal"
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react"
import MarkdownRenderer from "@/components/projectRegister/MarkdownRenderer"
import { useApi } from "@/hooks/useApi";
import { useParams } from "next/navigation";
import OverlaySpinner from "@/components/common/OverlaySpinner"
import { useEffect } from "react";
import { formatDateInAdmin } from "@/lib/utils"

interface ApprovalProject {
    id: number,
    category: {
      id: number,
      categoryName: string
    },
    title: string,
    description: string,
    goalAmount: number,
    totalAmount: number,
    markdown: string,
    startAt: string,
    endAt: string,
    shippedAt: string,
    approvalStatus: string,
    createdAt: string,
    imageUrls: string[],
    sellerResponse: {
      id: number,
      nickname: string,
      sellerIntroduction: string,
      linkUrl: string
    },
    productResponses: {
        id: number,
        name: string,
        description: string,
        price: number,
        stock: number,
        options: string[]
    }[]
  }
export default function ProjectApprovalDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { isLoading, apiCall } = useApi();
    // const [comment, setComment] = useState("")
    const [approvalStatus, setApprovalStatus] = useState<"approve" | "reject" | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [project, setProject] = useState<ApprovalProject | null>(null);
    const approve = approvalStatus === "approve" ? true : approvalStatus === "reject" ? false : null;
    const disabled = approvalStatus === null;

    const handleConfirm = () => {
        apiCall(`/api/admin/projects/${id}/approval`, "PATCH", {
            approve: approve,
            // comment: comment
        }).then(({ data }) => {
            console.log(data);
            setIsModalOpen(false);
            router.push("/admin/approval/project");
        })
    }

    const loadProject = () => {
        apiCall<ApprovalProject>(`/api/admin/projects/${id}`, "GET").then(({ data }) => {
            setProject(data);
        })
    }

    useEffect(() => {
        loadProject();
    }, [id])

    const renderProject = () => {
        if (isLoading) return <OverlaySpinner message="처리 중입니다."/>
        if (project === null) return <></>
        return (
            <div>
                {/* 프로젝트 기본 정보 */}
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium border-b pb-2">프로젝트 기본 정보</h2>
                <div className="grid grid-cols-5 gap-4">
                    {project.imageUrls.map((imageUrl) => (
                        <div className="aspect-square w-50 h-50 relative overflow-hidden" key={imageUrl}>
                            <img
                                src={imageUrl}
                                alt="프로젝트 이미지 1"
                                className="object-cover w-full h-full rounded-lg"
                            />
                        </div>
                    ))}
                </div>
                
                <div className="space-y-4 mt-4">
                <div className="flex">
                    <span className="w-24 text-sub-gray">프로젝트</span>
                    <span className="flex-1">{project.title}</span>
                </div>

                <div className="flex">
                    <span className="w-24 text-sub-gray">카테고리</span>
                    <span className="flex-1">{project.category.categoryName}</span>
                </div>

                <div className="flex">
                    <span className="w-24 text-sub-gray">설명</span>
                    <span className="flex-1">
                        {project.description}
                    </span>
                </div>

                <div className="flex">
                    <span className="w-24 text-sub-gray">목표 가격</span>
                    <span className="flex-1">{project.goalAmount} 원</span>
                </div>

                <div className="flex">
                    <span className="w-24 text-sub-gray">판매 기간</span>
                    <span className="flex-1">{formatDateInAdmin(project.startAt)} ~ {formatDateInAdmin(project.endAt)}</span>
                </div>

                <div className="flex">
                    <span className="w-24 text-sub-gray">등록</span>
                    <span className="flex-1">{formatDateInAdmin(project.createdAt)}</span>
                </div>
                </div>
                
                
            </div>
            <div className="flex flex-col gap-4 mt-6">
                <h2 className="text-2xl font-medium border-b pb-2">상세 소개</h2>
                <MarkdownRenderer content={project.markdown} />
            </div>
            {/* 판매자 정보 */}
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium border-b pb-2">판매자 정보</h2>
                <div className="flex items-center mt-4 justify-between">
                    <div className="flex items-center gap-4">
                        <button className="h-16 w-16 overflow-hidden rounded-full">
                            <img
                                src={project.sellerResponse.linkUrl}
                                alt="프로필 이미지"
                                className="h-full w-full object-cover"
                            />
                        </button>
                        <div className="flex flex-col">
                            <span className="text-xl font-medium">{project.sellerResponse.nickname}</span>
                            <span className="text-sm text-gray-500">{project.sellerResponse.sellerIntroduction}</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <button className="ml-auto px-4 py-2 text-sm border rounded-md">프로필보기</button>
                        <p className="text-sm text-gray-500">* 기존 프로필 페이지로 이동합니다.</p>
                    </div>
                </div>
            </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col mx-auto w-full p-8 gap-6">
            {isLoading && <OverlaySpinner message="처리 중입니다."/>}
            <div className="flex w-full">
            <button className="text-sm text-gray-500 flex items-center gap-2" onClick={() => router.back()}>
                <ArrowLeftIcon className="w-4 h-4" />
                목록으로
            </button>
            </div>
            
            {renderProject()}

            {/* 승인 반려 란 */}
            {project?.approvalStatus === "PENDING" && (
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium border-b pb-2">프로젝트 승인 여부</h2>
                <div className="flex justify-between">
                <div className="flex items-center space-x-4 mt-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="approval"
                            value="approve"
                            checked={approvalStatus === "approve"}
                            onChange={(e) => setApprovalStatus(e.target.value as "approve")}
                            className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span>승인</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="approval"
                            value="reject"
                            checked={approvalStatus === "reject"}
                            onChange={(e) => setApprovalStatus(e.target.value as "reject")}
                            className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <span>반려</span>
                    </label>
                </div>

                {/* <textarea
                    disabled={approvalStatus !== "reject"}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={approvalStatus === "reject" ? "반려 코멘트를 입력하세요" : ""}
                    className={clsx("w-full h-32 p-3 border rounded-md resize-none", approvalStatus !== "reject" && "bg-gray-100 text-sub-gray pointer-events-none")}
                /> */}

                <div className="flex justify-end space-x-4">
                    <button
                        disabled={disabled}
                        className={clsx(
                            "px-8 py-2 rounded-md",
                            disabled ? "bg-disabled-background text-disabled-text pointer-events-none" : "bg-main-color hover:bg-secondary-color-dark text-white"
                        )}
                        onClick={() => setIsModalOpen(true)}
                    >저장</button>
                </div>
                </div>
            </div>)}
            {/* 확인 모달 */}
            {
                isModalOpen &&
                <ConfirmModal
                    isOpen={isModalOpen}
                    message={`${approvalStatus === "approve" ? "승인" : "반려"} 하시겠습니까?`}
                    onConfirm={handleConfirm}
                    onClose={() => setIsModalOpen(false)}
                />
            }
        </div>
    )
}
