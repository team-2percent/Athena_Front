import EmptyMessage from "../common/EmptyMessage"
import Spinner from "../common/Spinner"
import ListProject from "./ListProjectCard"

export default function ProjectsList({ projects, isLoading }: {
    projects: {
        id: number
        image: string
        sellerName: string
        projectName: string
        achievementRate: number
        description: string
        liked: boolean
        daysLeft: number
    }[]
    isLoading: boolean
}) {
    const renderList = () => {
        if (projects.length === 0 && isLoading) return <Spinner message="프로젝트를 불러오는 중입니다." />
        else if (projects.length === 0) return <EmptyMessage message="프로젝트가 없습니다." />
        else 
        return (
            <div className="w-fit grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-20 gap-x-[10px] justify-items-center">
                {projects.map((project) => (
                <ListProject 
                    key={project.id}
                    id={project.id}
                    image={project.image}
                    sellerName={project.sellerName}
                    projectName={project.projectName}
                    achievementRate={project.achievementRate}
                    description={project.description}
                    liked={false}
                    daysLeft={project.daysLeft} />
                ))}
            </div>
        )
    }
  return (
    <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
        {
            renderList()
        }
    </div>
  )
}