import ProjectCard from "../common/ProjectCard"


interface ListProjectProps {
    id: number
    image: string
    sellerName: string
    projectName: string
    achievementRate: number
    description: string
    liked: boolean
    daysLeft: number
}

export default function ListProject({ id, image, sellerName, projectName, achievementRate, description, liked, daysLeft }: ListProjectProps) {
  return (
    <ProjectCard
      id={id}
      image={image}
      sellerName={sellerName}
      projectName={projectName}
      achievementRate={achievementRate}
      description={description}
      liked={liked}
      daysLeft={daysLeft}
      showProgressBar={true}
    />
  )
}