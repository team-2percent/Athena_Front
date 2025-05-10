"use client"

import { useEffect, useState } from "react";

interface Project {
    id: number;
    name: string;
    enrollDate: string;
    sellerName: string;
}

export default function ApprovalPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState<"오래된순" | "최신순">("오래된순");
    const [currentPage, setCurrentPage] = useState(1);

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
        setPageSize(parseInt(e.target.value));
    }

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSort(e.target.value as "오래된순" | "최신순");
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }


    useEffect(() => {
        fetchProjects();
    }, []);


    return (
        <div className="flex flex-col mx-auto max-w-6xl w-full p-8">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-medium">확인해야할 상품이 {projects.length}건 있습니다.</h3>
                <div className="flex gap-4">
                    <select className="border rounded px-4 py-2" onChange={handlePageSizeChange}>
                        <option selected>10개씩</option>
                        <option>20개씩</option>
                        <option>50개씩</option>
                    </select>
                    <select className="border rounded px-4 py-2" onChange={handleSortChange}>
                        <option selected>오래된순</option>
                        <option>최신순</option>
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
                        <tr key={project.id} className="border-b hover:bg-gray-50">
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