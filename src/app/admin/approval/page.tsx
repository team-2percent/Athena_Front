"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { formatDateInAdmin } from "@/lib/utils";
import Pagination from "@/components/common/Pagination";
import EmptyMessage from "@/components/common/EmptyMessage";
import { PrimaryButton } from "@/components/common/Button";

interface Project {
    projectId: number;
    title: string;
    createdAt: string;
    sellerName: string;
    isApproved: "PENDING" | "APPROVED" | "REJECTED";
}

interface Response {
    content: Project[];
    pageInfo: {
        currentPage: number;
        totalPages: number;
    };
    pendingCount: number;
}

const approvalStatus = {
    PENDING: "승인 대기",
    APPROVED: "승인",
    REJECTED: "반려"
}

export default function ApprovalPage() {
    const router = useRouter();
    const { isLoading, apiCall } = useApi();
    const [projects, setProjects] = useState<Project[]>([]);
    const [queryParams, setQueryParams] = useState({
        page: 0,
        keyword: "",
        sort: "asc"
    });
    const [totalPageCount, setTotalPageCount] = useState(1);
    const [pendingCount, setPendingCount] = useState(0);
    const [loadError, setLoadError] = useState(false);
    const isEmpty = totalPageCount === 0 && !isLoading && !loadError;

    const [search, setSearch] = useState("");

    const baseUri = "/api/admin/project"
    const queryParamUri = `?page=${queryParams.page}&direction=${queryParams.sort}${queryParams.keyword.length ? `&keyword=${queryParams.keyword}` : ""}`
    const url = `${baseUri}${queryParamUri ? `${queryParamUri}` : ""}`
    const loadProjects = () => {
        apiCall<Response>(url, "GET").then(({ data }) => {
            if (data === null) return
            setProjects(data.content);
            setQueryParams({
                page: data.pageInfo.currentPage,
                keyword: queryParams.keyword,
                sort: queryParams.sort
            });
            setTotalPageCount(data.pageInfo.totalPages);
            setPendingCount(data.pendingCount);
        })
    }

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setQueryParams({
            page: 0,
            keyword: queryParams.keyword,
            sort: e.target.value as "asc" | "desc"
        });
    }

    const handlePageChange = (page: number) => {
        setQueryParams({
            page: page,
            keyword: queryParams.keyword,
            sort: queryParams.sort
        })
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    // 엔터키로 검색
    const activeEnter = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearchClick();
        }
    }

    const handleSearchClick = () => {
        setQueryParams({
            page: 0,
            keyword: search,
            sort: queryParams.sort
        });
    }

    const handleProjectClick = (id: number) => {
        router.push(`/admin/approval/project/${id}`);
    }

    useEffect(() => {
        loadProjects();
    }, []);

    useEffect(() => {
        loadProjects();
    }, [queryParams.keyword, queryParams.sort, queryParams.page])


    return (
        <div className="flex flex-col mx-auto py-8 w-[var(--content-width)]">
            <h3 className="text-xl font-medium mb-8">확인해야할 상품이 {pendingCount}건 있습니다.</h3>
            <div className="flex items-center mb-8 gap-4">
                <div className="flex flex-1 gap-2">
                    <input
                        type="text"
                        placeholder="상품명으로 검색"
                        className="border flex-1 p-2 border rounded text-left text-sub-gray min-w-[350px] h-10"
                        onChange={handleSearchChange}
                        onKeyDown={(e) => activeEnter(e)}
                    />
                    <PrimaryButton
                        onClick={handleSearchClick}
                    >검색</PrimaryButton>
                </div>
                <div className="flex gap-4">
                    <select className="border rounded px-4 py-2 h-10" onChange={handleSortChange}>
                        <option value="asc">오래된순</option>
                        <option value="desc">최신순</option>
                    </select>
                </div>
            </div>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b">
                        <th className="text-center p-4 w-[5%]">순번</th>
                        <th className="text-center p-4 w-[50%]">제목</th>
                        <th className="text-center p-4 w-[10%]">등록 날짜</th>
                        <th className="text-center p-4 w-[15%]">판매자</th>
                        <th className="text-center p-4 w-[10%]">승인 상태</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project, index) => (
                        <tr key={project.projectId} className="border-b hover:bg-gray-50" onClick={() => handleProjectClick(project.projectId)}>
                            <td className="text-center p-4 whitespace-nowrap">{index + 1}</td>
                            <td className="text-center p-4 truncate max-w-0">{project.title}</td>
                            <td className="text-center p-4 whitespace-nowrap">{formatDateInAdmin(project.createdAt)}</td>
                            <td className="text-center p-4 truncate max-w-0">{project.sellerName}</td>
                            <td className="text-center p-4 whitespace-nowrap">{approvalStatus[project.isApproved]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isEmpty && <EmptyMessage message="프로젝트가 없습니다." />}
            <Pagination totalPages={totalPageCount} currentPage={queryParams.page} onPageChange={handlePageChange} />
        </div>
    )
}