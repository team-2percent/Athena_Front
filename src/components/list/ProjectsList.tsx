import EmptyMessage from "../common/EmptyMessage"
import ProjectCard from "../common/ProjectGridItem"
import Spinner from "../common/Spinner"

export default function ProjectsList({ projects, isLoading }: {
    projects: {
        id: number
        imageUrl: string
        sellerName: string
        title: string
        description: string
        achievementRate: number
        createdAt: string | null
        endAt: string
        daysLeft: number
        views: number
    }[]
    isLoading: boolean
}) {
    const renderList = () => {
        if (projects.length === 0 && isLoading) return <Spinner message="프로젝트를 불러오는 중입니다." />
        else if (projects.length === 0) return <EmptyMessage message="프로젝트가 없습니다." />
        else 
        return (
            <div
                className="w-fit grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-20 gap-x-[10px] justify-items-center"
                data-cy="project-list"
            >
                {projects.map((project) => (
                    <ProjectCard
                    className="w-full"
                    key={project.id}
                    id={project.id}
                    imageUrl={project.imageUrl}
                    sellerName={project.sellerName}
                    projectName={project.title}
                    achievementRate={project.achievementRate}
                    description={project.description}
                    daysLeft={project.daysLeft}
                    showProgressBar={true}
                  />
                ))}
            </div>
        )
    }
  return (
    <div className="flex flex-col items-center">
        {
            renderList()
        }
    </div>
  )
}