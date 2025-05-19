import type { ReactNode } from "react"
import ProjectCard from "../common/ProjectGridItem"

interface CategoryProjectProps {
    id: number
    image: string
    sellerName: string
    projectName: string
    achievementRate: number
    liked: boolean
    daysLeft: number
}

const CategoryProject = ({ id, image, sellerName, projectName, achievementRate, liked, daysLeft }: CategoryProjectProps) => {
    return (
        <ProjectCard 
            id={id}
            image={image}
            sellerName={sellerName}
            projectName={projectName}
            achievementRate={achievementRate}
            liked={liked}
            size={180}
            daysLeft={daysLeft}
            
        />
    )
}

export default CategoryProject