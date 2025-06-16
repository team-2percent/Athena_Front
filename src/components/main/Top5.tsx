"use client"

import { cn } from "@/lib/utils"
import { useApi } from "@/hooks/useApi"
import { MainProject } from "@/lib/projectInterface"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import ProjectOverlayItem from "../common/ProjectOverlayItem"
import { SecondaryButton } from "../common/Button"

interface Response {
  allTopView: MainProject[],
  categoryTopView: CategoryItem[]
}

interface CategoryItem {
  categoryId: number,
  categoryName: string,
  items: MainProject[]
}

export default function TopFive() {
  const router = useRouter()
  const { isLoading, apiCall } = useApi()
  const [activeTab, setActiveTab] = useState(0) 
  const [categories, setCategories] = useState<{ [key: number]: string }>({
    0: "전체"
  })
  const [categoryProjects, setCategoryProjects] = useState<{ [key: number]: MainProject[] }>({
    0: []
  })
  const rank1Project = categoryProjects[activeTab] ? categoryProjects[activeTab][0] : null;
  const restProject = categoryProjects[activeTab] ? categoryProjects[activeTab].slice(1) : [];
  const top5Projects = categoryProjects[activeTab] || [];

  const loadProjects = () => {
    apiCall<Response>("/api/project/categoryRankingView", "GET").then(({ data }) => {
      if (data?.allTopView && data.categoryTopView) {
        setCategoryProjects({
          ...categoryProjects,
          0: data?.allTopView
        })
        data.categoryTopView.map(categoryItem => {
          setCategories(prev => {
            prev[categoryItem.categoryId] = categoryItem.categoryName
            return prev
          })
          setCategoryProjects(prev => {
            prev[categoryItem.categoryId] = categoryItem.items
            return prev
          })
        })
      }
      
    })
  }

  const moveToPage = (categoryId: number) => {
    if (categoryId) router.push(`/category/${categoryId}`)
  }

  const moveToProjectPage = (projectId: number) => {
    router.push(`/project/${projectId}`)
  }

  useEffect(() => {
    loadProjects();
  }, [])

  if (isLoading || top5Projects.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <h2 className="text-2xl font-bold">
            BEST <span className="text-main-color">TOP 5</span> <span className="text-2xl">🏆</span>
          </h2>
        </div>
        <div className="flex justify-between mb-8">
          <div className="flex flex-wrap gap-2">
            {[0,1,2].map(i => (
              <div key={i} className="px-4 py-2 rounded-full bg-gray-200 animate-pulse w-20 h-8" />
            ))}
          </div>
          <div className="px-4 py-2 rounded bg-gray-200 animate-pulse w-32 h-8" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1등 (큰 카드) */}
          <div className="flex flex-col items-start animate-pulse w-full">
            <div className="w-full aspect-square bg-gray-200 rounded-lg" />
          </div>
          {/* 2~5등 (2x2 그리드) */}
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            {[0,1,2,3].map(i => (
              <div key={i} className="flex flex-col items-start animate-pulse w-full">
                <div className="w-full aspect-square bg-gray-200 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <h2 className="text-2xl font-bold">
          BEST <span className="text-main-color">TOP 5</span> <span className="text-2xl">🏆</span>
        </h2>
      </div>

      {/* Category filters */}
      <div className="flex justify-between mb-8">
      <div className="flex flex-wrap gap-2">
        {Object.keys(categories).map((categoryId) => (
          <button
            key={categoryId}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              +categoryId === activeTab ? "bg-main-color text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300",
            )}
            onClick={() => setActiveTab(+categoryId)}
          >
            {categories[+categoryId]}
          </button>
        ))}
      </div>
      <SecondaryButton
          onClick={() => moveToPage(activeTab)}
          // className="inline-flex items-center px-4 py-2 border border-main-color text-main-color rounded hover:bg-pink-50 transition-colors"
        >
          프로젝트 전체보기 →
        </SecondaryButton>
      </div>
      

      {/* Top projects grid - revised layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        { rank1Project && 
          <ProjectOverlayItem
            key={rank1Project.projectId}
            className="w-full"
            id={rank1Project.projectId}
            imageUrl={rank1Project.imageUrl}
            sellerName={rank1Project.sellerName}
            projectName={rank1Project.title}
            achievementRate={rank1Project.achievementRate}
            description={rank1Project.description}                        
          />
        }

        {/* Regular projects (smaller) - takes up the other half in a 2x2 grid */}
        {restProject && <div className="grid grid-cols-2 grid-rows-2 gap-4">
          {restProject.map((project, idx) => 
            <ProjectOverlayItem
            key={project.projectId}
            className="w-full"
            id={project.projectId}
            imageUrl={project.imageUrl}
            sellerName={project.sellerName}
            projectName={project.title}
            achievementRate={project.achievementRate}
            description={project.description}                        
          />
          )}
        </div>}
      </div>

      {/* View all projects button */}
      <div className="flex justify-end mt-8">
        
      </div>
    </div>
  )
}
