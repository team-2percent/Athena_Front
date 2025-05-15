"use client"

import { useEffect, useRef, useState } from "react";
import ListHeader from "./ListHeader";
import ProjectsList from "./ProjectsList";
import Spinner from "../common/Spinner";
import { listProject } from "@/lib/projectInterface";
import { useApi } from "@/hooks/useApi";
import { listType, sortName } from "@/lib/listConstant";

interface ListPageProps {
    type: "new" | "deadline" | "category" | "search"
    categoryId?: number
    searchWord?: string
}

export default function ListPage({ type, categoryId, searchWord }: ListPageProps) {
  const { isLoading, apiCall } = useApi();
  const [projects, setProjects] = useState<listProject[]>([]);
  const [cursorValue, setCursorValue] = useState<string | null>(null);
  const [lastProjectId, setLastProjectId] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const loader = useRef(null);
  const [sort, setSort] = useState(type === "new" ? null : listType[type].sort[0]);

  const url = type === "category" ? 
    `${listType[type].apiUrl}${categoryId && categoryId > 0 ? `/${categoryId}` : ""}${sort ? `?sortType=${sort}` : ""}` :
    `${listType[type].apiUrl}${sort ? `?sortType=${sort}` : ""}${type === "search" && searchWord ? `${sort ? "&" : "?"}searchWord=${searchWord}` : ""}`
  const morePage = lastProjectId !== null;
  const nextPageQueryParam = morePage ? `&cursorValue=${cursorValue}&lastProjectId=${lastProjectId}` : "";

  const handleSortClick = (newSort: string) => {
      if(sort === newSort) return;
      setCursorValue(null);
      setLastProjectId(null);
      setProjects([]);
      setSort(newSort);
  }

  const loadProjects = () => {
    apiCall(url + nextPageQueryParam, "GET").then(({ data }: { data: any }) => {
      if ("data" in data) setProjects([...projects, ...(data.data as listProject[])]);
      if ("nextCursorValue" in data) setCursorValue(data.nextCursorValue as string | null);
      if ("nextProjectId" in data) setLastProjectId(data.nextProjectId as number | null); 
      if ("total" in data) setTotalCount(data.total as number);
    }).catch((error) => {
      console.error("프로젝트 조회에 실패했습니다.", error);
    })
  }
    // 옵저버로 loading bar 나오면 loadMore 동작
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && morePage) {
          loadProjects();
        }
      },
      { threshold: 0.3 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }
    return () => observer.disconnect();
  }, [isLoading, morePage]);


  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    const resetAndLoad = async () => {
      setCursorValue(null);
      setLastProjectId(null);
      loadProjects();
    };
    resetAndLoad();
  }, [sort])

  return (
    <div className="w-full">
        <ListHeader
            type={type}
            count={totalCount}
            searchWord={searchWord}
            sort={sort}
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