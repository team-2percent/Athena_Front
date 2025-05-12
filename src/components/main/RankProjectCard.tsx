import type { ReactNode } from "react"
import ProjectCard from "../common/ProjectCard"

interface RankProjectProps {
    id: number
    image: string
    sellerName: string
    projectName: string
    achievementRate: number
    liked: boolean
    size: number
    daysLeft: number
    rankElement?: ReactNode
}

const RankProject = ({ id, image, sellerName, projectName, achievementRate, liked, size, daysLeft, rankElement }: RankProjectProps) => {
    return (
        <ProjectCard 
            id={id}
            image={image}
            sellerName={sellerName}
            projectName={projectName}
            achievementRate={achievementRate}
            liked={liked}
            size={size}
            daysLeft={daysLeft}
            rankElement={rankElement}
        />
    )
}

export default RankProject