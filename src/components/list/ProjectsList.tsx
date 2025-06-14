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
    }[] | undefined
    isLoading: boolean
}) {
    const renderList = () => {
        if (projects === undefined) return (
            <div className="w-full min-h-[300px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-20 gap-x-[10px] justify-items-center" data-cy="project-list-skeleton">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="flex flex-col rounded-lg overflow-hidden animate-pulse w-full min-w-[160px] max-w-[95vw] sm:min-w-[180px] sm:max-w-xs p-2">
                        <div className="relative overflow-hidden rounded-lg aspect-square bg-gray-200 mb-3" />
                        <div className="flex flex-col flex-1 justify-between p-1 pt-2">
                            <div>
                                <div className="h-3 w-1/3 bg-gray-200 rounded mb-1" />
                                <div className="h-4 w-2/3 bg-gray-300 rounded mb-1" />
                                <div className="h-3 w-1/2 bg-gray-100 rounded mb-14" />
                            </div>
                            <div>
                                <div className="h-3 w-1/3 bg-gray-200 rounded mb-1" />
                                <div className="mt-1">
                                    <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-1" />
                                    <div className="flex justify-end mt-1">
                                        <div className="h-3 w-1/4 bg-gray-200 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
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