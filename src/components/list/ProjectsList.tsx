import EmptyMessage from "../common/EmptyMessage"
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
  return (
    <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
        {
            projects.length === 0 && !isLoading ?
            <EmptyMessage message="상품이 없습니다." /> :
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
        }
    </div>
  )
}