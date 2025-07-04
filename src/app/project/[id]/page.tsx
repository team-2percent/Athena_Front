import { Suspense } from "react"
import ProjectDetail from "@/components/projectDetail/ProjectDetail"
import ProjectDetailSkeleton from "@/components/projectDetail/client/ProjectDetailSkeleton"
import DonateDock from "@/components/projectDetail/client/DonateDock"

async function getProjectData(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/project/${id}`, {
    cache: "no-store"
  })
  if (!res.ok) {
    return { data: null, error: "프로젝트 정보를 불러올 수 없습니다." }
  }
  const data = await res.json()
  return { data, error: null }
}

async function ProjectDetailContent({ id }: { id: string }) {
  const { data, error } = await getProjectData(id)
  
  return (
    <ProjectDetail
      projectData={data}
      error={error}
    />
  )
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return (
    <main className="min-h-screen bg-white w-[var(--content-width)]">
      <div className="container mx-auto py-8">
        {/* 상품 상세 페이지 영역 */}
        <Suspense fallback={<ProjectDetailSkeleton />}>
          <ProjectDetailContent id={id} />
        </Suspense>
      </div>
      {/* 후원하기 독 영역 */}
      <DonateDock />
    </main>
  )
}
