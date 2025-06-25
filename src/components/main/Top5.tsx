"use client"

import { cn } from "@/lib/utils"
import { MainProject } from "@/lib/projectInterface"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ProjectOverlayItem from "../common/ProjectOverlayItem"
import { SecondaryButton } from "../common/Button"
import { CategoryItem } from "@/app/page"
import Top5Skeleton from "./Top5Skeleton";
import dynamic from "next/dynamic"

function TopFiveComponent({ allProjects, categoryProjects }: { allProjects: MainProject[], categoryProjects: CategoryItem[] }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(0)
  const [projects, setProjects] = useState<MainProject[]>(allProjects);
  const [isClient, setIsClient] = useState(false);

  const rank1Project = projects[0] ? projects[0] : null;
  const restProject = projects.slice(1) || [];

  const moveToPage = (categoryId: number) => {
    if (categoryId) router.push(`/category/${categoryId}`)
  }

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setProjects(activeTab === 0 ? allProjects : categoryProjects[activeTab].items)
  }, [activeTab, allProjects, categoryProjects])

  // 클라이언트 사이드에서만 렌더링
  if (!isClient) {
    return (
      <Top5Skeleton />
    );
  }
  
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12" data-cy="category-top5">
      <div className="flex items-center mb-8">
        <h2 className="text-2xl font-bold">
          BEST <span className="text-main-color">TOP 5</span> <span className="text-2xl">🏆</span>
        </h2>
      </div>

      {/* Category filters */}
      <div className="flex justify-between mb-8">
      <div className="flex flex-wrap gap-2">
        {Object.keys(categoryProjects).map((categoryId) => (
          <button
            key={categoryId}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              +categoryId === activeTab ? "bg-main-color text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300",
            )}
            onClick={() => setActiveTab(+categoryId)}
          >
            {categoryProjects[+categoryId].categoryName}
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
          {restProject.map((project: MainProject) => 
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

const TopFive = dynamic(
  () => Promise.resolve(({ allProjects, categoryProjects }: { allProjects: MainProject[], categoryProjects: CategoryItem[] }) => {
    return (
      <TopFiveComponent allProjects={allProjects} categoryProjects={categoryProjects} />
    )
  }),
  {
    ssr: false,
    loading: () => <Top5Skeleton />
  }
)

export default TopFive