"use client"

import { useState } from "react"
import ConfirmModal from "@/components/common/ConfirmModal"
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react"
import MarkdownRenderer from "@/components/projectRegister/MarkdownRenderer"
import { useApi } from "@/hooks/useApi";
import { useParams } from "next/navigation";
import OverlaySpinner from "@/components/common/OverlaySpinner"
import { useEffect } from "react";
import { formatDateInAdmin } from "@/lib/utils"
import { PrimaryButton, SecondaryButton } from "@/components/common/Button";
import useErrorToastStore from "@/stores/useErrorToastStore";
import ServerErrorComponent from "@/components/common/ServerErrorComponent";

interface ApprovalProject {
    id: number,
    category: string,
    title: string,
    description: string,
    planName: string,
    goalAmount: number,
    totalAmount: number,
    markdown: string,
    startAt: string,
    endAt: string,
    shippedAt: string,
    isApproved: string,
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
    const { showErrorToast } = useErrorToastStore();
    // const [comment, setComment] = useState("")
    const [isApproved, setIsApproved] = useState<"approve" | "reject" | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [project, setProject] = useState<ApprovalProject | null>(null);
    const approve = isApproved === "approve" ? true : isApproved === "reject" ? false : null;
    const disabled = isApproved === null;
    const [serverError, setServerError] = useState(false);

    const handleConfirm = () => {
        apiCall(`/api/admin/project/${id}/approval`, "PATCH", {
            approve: approve,
            // comment: comment
        }).then(({ error, status }) => {
            if (!error) {
                loadProject();
                setIsModalOpen(false);
            } else if (status === 500) {
                if (approve) showErrorToast("프로젝트 승인 처리 실패", "다시 시도해주세요.")
                else showErrorToast("프로젝트 반려 처리 실패", "다시 시도해주세요.")
            }
        })
    }

    const loadProject = () => {
        apiCall<ApprovalProject>(`/api/admin/project/${id}`, "GET").then(({ data, error, status }) => {
            if (!error && data) setProject(data);
            else if (error && status === 500) {
                setServerError(true);
            }
        })
    }

    // 재고 상태에 따른 색상 결정
    const getStockStatusColor = (stock: number) => {
        if (stock <= 0) return "text-red-600 bg-red-50";
        if (stock < 10) return "text-amber-600 bg-amber-50";
        return "text-green-600 bg-green-50";
    };

    useEffect(() => {
        loadProject();
    }, [id])

    const renderProject = () => {
        if (isLoading) return <OverlaySpinner message="처리 중입니다."/>
        if (serverError) return <ServerErrorComponent message="프로젝트 상세 조회에 실패했습니다." onRetry={loadProject}/>
        if (project === null) return <></>
        return (
            <div>
                {/* 프로젝트 기본 정보 */}
            <div className="flex flex-col gap-4" data-cy="project-detail-info">
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
                    <span className="flex-1">{project.category}</span>
                </div>

                <div className="flex">
                    <span className="w-24 text-sub-gray">설명</span>
                    <span className="flex-1">
                        {project.description}
                    </span>
                </div>

                <div className="flex">
                    <span className="w-24 text-sub-gray">요금제</span>
                    <span className="flex-1">
                        {project.planName}
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
            <div className="flex flex-col gap-4 mt-6" data-cy="project-detail-markdown">
                <h2 className="text-2xl font-medium border-b pb-2">상세 소개</h2>
                <MarkdownRenderer content={project.markdown} />
            </div>

            {/* 상품 정보 */}
            <div className="flex flex-col gap-4 mb-6" data-cy="project-detail-product">
                <h2 className="text-2xl font-medium border-b pb-2">상품 정보</h2>
                <div className="flex flex-col">
                    {project.productResponses.map((product, idx) => 
                        <div key={product.id} className="border-b shadow-sm p-4 bg-white border-gray-border">
                            <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                            <span 
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(product.stock)}`}
                            >
                                재고: {product.stock}개
                            </span>
                            </div>
                            
                            <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">상품 설명</p>
                                <p className="text-sm text-gray-700">{product.description}</p>
                            </div>
                            
                            <div>
                                <p className="text-sm text-gray-500 mb-1">가격</p>
                                <p className="text-base font-medium text-gray-900">
                                {product.price.toLocaleString()}원
                                </p>
                            </div>
                            
                            {product.options && product.options.length > 0 ? (
                                <div>
                                <p className="text-sm text-gray-500 mb-1">옵션</p>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    {product.options.map((option, index) => (
                                    <li key={index} className="flex items-center">
                                        <span>{JSON.stringify(option)}</span>
                                    </li>
                                    ))}
                                </ul>
                                </div>
                            ) : (
                                <div>
                                <p className="text-sm text-gray-500 mb-1">옵션</p>
                                <p className="text-sm text-gray-400 italic">옵션 없음</p>
                                </div>
                            )}
                            </div>
                        </div>
                    )}
                </div>
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
                        <SecondaryButton
                            className="ml-auto"
                            onClick={() => router.push(`/profile/${project.sellerResponse.id}`)}
                        >프로필보기</SecondaryButton>
                        <p className="text-sm text-gray-500">* 기존 프로필 페이지로 이동합니다.</p>
                    </div>
                </div>
            </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 mx-auto w-[var(--content-width)] py-8">
            {isLoading && <OverlaySpinner message="처리 중입니다."/>}
            <div className="flex w-full">
            <button className="text-sm text-gray-500 flex items-center gap-2" onClick={() => router.back()}>
                <ArrowLeftIcon className="w-4 h-4" />
                목록으로
            </button>
            </div>
            
            {renderProject()}

            {/* 승인 반려 란 */}
            {project?.isApproved === "PENDING" && (
            <div className="flex flex-col gap-4" data-cy="project-approve-form">
                <h2 className="text-2xl font-medium border-b pb-2">프로젝트 승인 여부</h2>
                <div className="flex justify-between">
                <div className="flex items-center space-x-4 mt-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="approval"
                            value="approve"
                            checked={isApproved === "approve"}
                            onChange={(e) => setIsApproved(e.target.value as "approve")}
                            className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                            data-cy="project-approve-radio"
                        />
                        <span>승인</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="approval"
                            value="reject"
                            checked={isApproved === "reject"}
                            onChange={(e) => setIsApproved(e.target.value as "reject")}
                            className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                            data-cy="project-reject-radio"
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
                    <PrimaryButton
                        disabled={disabled}
                        onClick={() => setIsModalOpen(true)}
                        data-cy="project-save-button"
                    >저장</PrimaryButton>
                </div>
                </div>
            </div>)}
            {/* 확인 모달 */}
            {
                isModalOpen &&
                <ConfirmModal
                    isOpen={isModalOpen}
                    message={`${isApproved === "approve" ? "승인" : "반려"} 하시겠습니까?`}
                    onConfirm={handleConfirm}
                    onClose={() => setIsModalOpen(false)}
                    dataCy="project-approve-modal"
                />
            }
        </div>
    )
}
