import ProjectDetail from "@/components/projectDetail/ProjectDetail"
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

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data, error } = await getProjectData(id)
  return (
    <main className="min-h-screen bg-white w-[var(--content-width)]">
      <div className="container mx-auto py-8">
        {/* 상품 상세 페이지 영역 */}
        <ProjectDetail
          projectData={data}
          isLoading={false}
          error={error}
        />
      </div>
      {/* 후원하기 독 영역 */}
      <DonateDock />
    </main>
  )
}
