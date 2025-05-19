import type { ReactNode } from "react"
import ProjectCard from "../common/ProjectGridItem"

interface RankProjectProps {
    id: number
    imageUrl: string
    sellerName: string
    projectName: string
    achievementRate: number
    liked: boolean
    size: number
    daysLeft: number
    rankElement?: ReactNode
}

const RankProject = ({ id, imageUrl, sellerName, projectName, achievementRate, liked, size, daysLeft, rankElement }: RankProjectProps) => {
    return (
        <ProjectCard 
            id={id}
            image={imageUrl}
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