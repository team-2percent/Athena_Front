"use client"

import { useState } from "react"
import Image from "next/image"
import clsx from "clsx"
import ConfirmModal from "@/components/common/ConfirmModal"
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react"
import MarkdownRenderer from "@/components/projectRegister/MarkdownRenderer"

export default function ProjectApprovalDetailPage() {
    const router = useRouter();
    const [comment, setComment] = useState("")
    const [approvalStatus, setApprovalStatus] = useState<"approve" | "reject" | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleConfirm = () => {
        // 요청 로직
        console.log("요청")
        setIsModalOpen(false);
        router.back();
    }

    const markdown = `# 프로젝트 기본 정보\n**안됨**\n## 프로젝트 기본 정보\n**안됨**\n## 프로젝트 기본 정보\n**안됨**\n## 프로젝트 기본 정보\n**안됨**`

    return (
        <div className="flex flex-col mx-auto w-full p-8 gap-6">
            <div className="flex w-full">
            <button className="text-sm text-gray-500 flex items-center gap-2" onClick={() => router.back()}>
                <ArrowLeftIcon className="w-4 h-4" />
                목록으로
            </button>
            </div>
            {/* 프로젝트 기본 정보 */}
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium border-b pb-2">프로젝트 기본 정보</h2>
                
                <div className="space-y-4 mt-4">
                <div className="flex">
                    <span className="w-24 text-sub-gray">프로젝트</span>
                    <span>TG5555555</span>
                </div>

                <div className="flex">
                    <span className="w-24 text-sub-gray">판매 기간</span>
                    <span>2025. 04. 25 ~ 2025. 05. 15 (19일)</span>
                </div>

                <div className="flex">
                    <span className="w-24 text-sub-gray">등록</span>
                    <span>2025. 04. 13</span>
                </div>
                </div>
                
                
            </div>
            <div className="flex flex-col gap-4 mt-6">
                <h2 className="text-2xl font-medium border-b pb-2">상세 소개</h2>
                <MarkdownRenderer content={markdown} />
            </div>
            {/* 판매자 정보 */}
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium border-b pb-2">판매자 정보</h2>
                <div className="flex items-center mt-4 justify-between">
                    <div className="flex items-center gap-4">
                        <button className="h-16 w-16 overflow-hidden rounded-full">
                            <Image
                                src="/abstract-profile.png"
                                alt="프로필 이미지"
                                width={64}
                                height={64}
                                className="h-full w-full object-cover"
                            />
                        </button>
                        <div className="flex flex-col">
                            <span className="text-xl font-medium">기적가</span>
                            <span className="text-sm text-gray-500">판매자 소개</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <button className="ml-auto px-4 py-2 text-sm border rounded-md">프로필보기</button>
                        <p className="text-sm text-gray-500">* 기존 프로필 페이지로 이동합니다.</p>
                    </div>
                </div>
            </div>
            {/* 승인 반려 란 */}
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium border-b pb-2">프로젝트 승인 여부</h2>
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

                <textarea
                    disabled={approvalStatus !== "reject"}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={approvalStatus === "reject" ? "반려 코멘트를 입력하세요" : ""}
                    className={clsx("w-full h-32 p-3 border rounded-md resize-none", approvalStatus !== "reject" && "bg-gray-100 text-sub-gray pointer-events-none")}
                />

                <div className="flex justify-end space-x-4">
                    <button
                        disabled={approvalStatus === null}
                        className="px-8 py-2 rounded-md bg-pink-100 text-pink-600"
                        onClick={() => setIsModalOpen(true)}
                    >저장</button>
                </div>
            </div>
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
