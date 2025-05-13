"use client"

import { useEffect, useRef, useState } from "react";
import ListHeader from "./ListHeader";
import ProjectsList from "./ProjectsList";
import Spinner from "../common/Spinner";

interface ListPageProps {
    type: "new" | "deadline" | "category" | "search"
    categoryId?: number
    searchWord?: string
}

const sorts = {
    "deadline" : ["deadline", "recommend", "view", "achievement"],
    "category" : ["new", "recommend", "view", "achievement"],
    "search" : ["new", "recommend", "view", "achievement"],
}

export default function ListPage({ type, categoryId, searchWord }: ListPageProps) {
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [morePage, setMorePage] = useState(true); // 더 불러올 페이지가 있는지
    const [totalCount, setTotalCount] = useState(0);
    const loader = useRef(null);
    const [sort, setSort] = useState(type === "new" ? null : sorts[type][0]);

    const loadUrl = `backendURL/${type}${type === "category" && categoryId ? `/${categoryId}` : type === "search" ? `?query=${searchWord}&page=${currentPage}` : `?page=${currentPage}`}` // 추후 수정

    interface Project {
        id: number;
        image: string;
        sellerName: string;
        projectName: string;
        achievementRate: number;
        description: string;
        liked: boolean;
        daysLeft: number;
    }

    const [projects, setProjects] = useState<Project[]>([]);

    const loadProjects = async () => {
        setIsLoading(true);
        // fetch(loadUrl).then(
        //   response => response.json().then(
        //     data => {
        //       setProjects(data.projects);
        //       setTotalCount(data.totalCount);
        //       setIsLoading(false);
        //       setMorePage(data.morePage);
        //     }
        //   )
        // );
        setProjects(Array(20).fill({}).map((_, index) => (
          {
              id: index * 2 + 1,
              image: "/project-test.png",
              sellerName: "John Doe",
              projectName: "Project 1",
              achievementRate: 50,
              description: "This is a description of the projectThis is a description of the projectThis is a description of the project",
              liked: false,
              daysLeft: 10
          }
      )));
        setTotalCount(999999);
        setIsLoading(false);
        setMorePage(true);
    }

    const loadMoreProjects = async () => {
        // await loadProjects(currentPage + 1);
        setCurrentPage(prevPage => prevPage + 1);
        setProjects(prevProjects => [...prevProjects, ...Array(20).fill({}).map((_, index) => (
            {
                id: index * 2 + 1,
                image: "/project-test.png",
                sellerName: "John Doe",
                projectName: "Project 1",
                achievementRate: 50,
                description: "This is a description of the projectThis is a description of the projectThis is a description of the project",
                liked: false,
                daysLeft: 10
            }
        )
        )])
        setIsLoading(false);
    }

    const handleSortClick = (sort: "new" | "deadline" | "recommend" | "view" | "achievement") => {
        setSort(sort);
    }
    // 옵저버로 loading bar 나오면 loadMore 동작
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && morePage) {
          setIsLoading(true);
          loadMoreProjects();
        }
      },
      { threshold: 0.8 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }
    return () => observer.disconnect();
  }, [isLoading, morePage]);


  useEffect(() => {
    loadProjects();
    setTotalCount(999999);
    // 페이지 불러오기 로직
    // currentPage 변경, morePage 변경
  }, []);

  useEffect(() => {
    setCurrentPage(0);
    loadProjects();
    setTotalCount(999999);
    // 새 정렬로 페이지 불러오기 로직
  }, [sort])

  return (
    <div className="w-full">
        <ListHeader
            type={type}
            count={totalCount}
            searchWord={searchWord}
            sort={sort as "new" | "deadline" | "recommend" | "view" | "achievement" | null}
            onClickSort={handleSortClick}
        /> 
        <ProjectsList projects={projects} isLoading={isLoading} />
        { 
            morePage && 
            <div className="w-full py-20 flex justify-center items-center" ref={loader}>
                <Spinner message="더 불러오는 중입니다..." />
            </div>
        }
    </div>
  )
}