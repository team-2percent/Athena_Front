"use client"

import { useEffect, useRef, useState } from "react";
import ListHeader from "./ListHeader";
import ProjectsList from "./ProjectsList";
import Spinner from "../common/Spinner";
import { listProject } from "@/lib/projectInterface";
import { useApi } from "@/hooks/useApi";
import { listType, sortName } from "@/lib/listConstant";
import ServerErrorComponent from "../common/ServerErrorComponent";

interface ListPageProps {
    type: "new" | "deadline" | "category" | "search"
    categoryId?: number
    searchWord?: string
}

export default function ListPage({ type, categoryId, searchWord }: ListPageProps) {
  const { isLoading, apiCall } = useApi();
  const [projects, setProjects] = useState<listProject[] | undefined>(undefined);
  const [cursorValue, setCursorValue] = useState<string | null>(null);
  const [lastProjectId, setLastProjectId] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const loader = useRef(null);
  const [sort, setSort] = useState(type === "new" ? null : listType[type].sort[0]);

  const sortTypeParamName = type === "deadline" ? "sortTypeDeadline" : "sortType"
  const lastProjectIdName = type === "search" || type === "category" ? "cursorId" : "lastProjectId"

  const url = type === "category" ? 
    `${listType[type].apiUrl}${categoryId === 0 ? `${sort ? `?sortType=${sort}` : ""}` : `?categoryId=${categoryId}${sort ? `&sortType=${sort}` : ""}`}` : 
    `${listType[type].apiUrl}${sort ? `?${sortTypeParamName}=${sort}` : ""}${type === "search" && searchWord ? `${sort ? "&" : "?"}searchTerm=${searchWord}` : ""}`
  const morePage = lastProjectId !== null;
  const nextPageQueryParam = morePage ? `${type === "new" ? "?" : "&"}cursorValue=${cursorValue}&${lastProjectIdName}=${lastProjectId}` : "";

  const handleSortClick = (newSort: string) => {
      if(sort === newSort) return;
      setSort(newSort);
  }

  const loadProjects = () => {
    setLoadError(false);
    apiCall(url + nextPageQueryParam, "GET").then(({ data, error }: { data: any, error: string | null }) => {
      if (error) {
        console.log(error);
        setLoadError(true);
      } else {
        if ("content" in data) setProjects(prev => prev ? [...prev, ...(data.content as listProject[])] : [...(data.content as listProject[])]);
        else setProjects([]);
        if ("nextCursorValue" in data) setCursorValue(data.nextCursorValue as string | null);
        if ("nextProjectId" in data) setLastProjectId(data.nextProjectId as number | null); 
        if (totalCount === 0 && "total" in data) setTotalCount(data.total as number);
      }
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

  // 정렬 조건이 바뀌면 상태만 초기화
  useEffect(() => {
    setCursorValue(null);
    setLastProjectId(null);
    setProjects(undefined);
  }, [sort]);

  // cursorValue, lastProjectId가 null로 초기화된 후에만 loadProjects 실행
  useEffect(() => {
    if (cursorValue === null && lastProjectId === null) {
      loadProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorValue, lastProjectId, sort]);

  return (
    <div className="w-full w-[var(--content-width)]">
        <ListHeader
            type={type}
            count={totalCount}
            searchWord={searchWord}
            sort={sort}
            onClickSort={handleSortClick}
        /> 
        {(!loadError || (projects && projects.length > 0)) && <ProjectsList projects={projects} isLoading={isLoading} />}
        { 
            !loadError && morePage && 
            <div className="w-full py-20 flex justify-center items-center" ref={loader} data-cy="loading-spinner">
                <Spinner message="더 불러오는 중입니다..." />
            </div>
        }
        {
          loadError &&
          <ServerErrorComponent message="프로젝트를 불러오는 중 오류가 발생했습니다. 다시 시도 해주세요." onRetry={loadProjects} />
        }
    </div>
  )
}