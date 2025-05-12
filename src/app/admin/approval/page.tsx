"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Project {
    id: number;
    name: string;
    enrollDate: string;
    sellerName: string;
}

export default function ApprovalPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [pageSize, setPageSize] = useState<10 | 20 | 50>(10);
    const [sort, setSort] = useState<"old" | "new">("old");
    const [currentPage, setCurrentPage] = useState(1);

    const [search, setSearch] = useState("");

    const fetchProjects = async () => {
        setProjects([
            {
                id: 1,
                name: "프로젝트 1",
                enrollDate: "2025.01.01",
                sellerName: "판매자1"
            },
            {
                id: 2,
                name: "프로젝트 2",
                enrollDate: "2025.01.01",
                sellerName: "판매자1"
            },
            {
                id: 3,
                name: "프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3프로젝트 3",
                enrollDate: "2025.01.01",
                sellerName: "판매자1판매자1판매자1판매자1"
            },
            {
                id: 4,
                name: "프로젝트 4",
                enrollDate: "2025.01.01",
                sellerName: "판매자1"
            },
            {
                id: 5,
                name: "프로젝트 5",
                enrollDate: "2025.01.01",
                sellerName: "판매자1"
            },
            {
                id: 6,
                name: "프로젝트 6",
                enrollDate: "2025.01.01",
                sellerName: "판매자1"
            },
            {
                id: 7,
                name: "프로젝트 7",
                enrollDate: "2025.01.01",
                sellerName: "판매자1"
            },
            {
                id: 8,
                name: "프로젝트 8",
                enrollDate: "2025.01.01",
                sellerName: "판매자1"
            },
            {
                id: 9,
                name: "프로젝트 9",
                enrollDate: "2025.01.01",
                sellerName: "판매자1"
            },
            {
                id: 10,
                name: "프로젝트 10",
                enrollDate: "2025.01.01",
                sellerName: "판매자1"
            },
            
        ]);
    }

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(parseInt(e.target.value) as 10 | 20 | 50);
    }

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSort(e.target.value as "old" | "new");
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const handleSearchClick = () => {
        // api 요청
        console.log(search + " 검색");
    }

    const handleProjectClick = (id: number) => {
        router.push(`/admin/approval/project/${id}`);
    }

    useEffect(() => {
        fetchProjects();
    }, []);


    return (
        <div className="flex flex-col mx-auto max-w-6xl w-full p-8">
            <h3 className="text-xl font-medium mb-8">확인해야할 상품이 {projects.length}건 있습니다.</h3>
            <div className="flex items-center mb-8 gap-4">
                <div className="flex flex-1 gap-2">
                    <input
                        type="text"
                        placeholder="상품명으로 검색"
                        className="border flex-1 p-2 border rounded text-left text-gray-400 min-w-[350px] h-10"
                        onChange={handleSearchChange}
                    />
                    <button
                        onClick={handleSearchClick}
                        className="border bg-pink-500 text-white px-4 py-2 rounded h-10"
                    >검색</button>
                </div>
                <div className="flex gap-4">
                    <select className="border rounded px-4 py-2 h-10" onChange={handlePageSizeChange}>
                        <option value="10">10개씩</option>
                        <option value="20">20개씩</option>
                        <option value="50">50개씩</option>
                    </select>
                    <select className="border rounded px-4 py-2 h-10" onChange={handleSortChange}>
                        <option value="old">오래된순</option>
                        <option value="new">최신순</option>
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
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project, index) => (
                        <tr key={project.id} className="border-b hover:bg-gray-50" onClick={() => handleProjectClick(project.id)}>
                            <td className="text-center p-4 whitespace-nowrap">{index + 1}</td>
                            <td className="text-center p-4 truncate max-w-0">{project.name}</td>
                            <td className="text-center p-4 whitespace-nowrap">{project.enrollDate}</td>
                            <td className="text-center p-4 truncate max-w-0">{project.sellerName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center gap-2 mt-8">
                <button className="px-3 py-2">◀</button>
                <button className="px-3 py-2 text-pink-500">1</button>
                <button className="px-3 py-2">▶</button>
            </div>
        </div>
    )
}