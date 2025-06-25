import Carousel from "@/components/main/Carousel";
import EditorPicks from "@/components/main/EditorPicks";
import Top5 from "@/components/main/Top5";
import { MainProject } from "@/lib/projectInterface";
import serverFetch from "@/lib/serverFetch";
import ServerErrorComponent from "@/components/common/ServerErrorComponent";

type PlanResponse = PlanResponseItem[];

interface PlanResponseItem {
  planName: "PREMIUM" | "PRO",
  items: MainProject[];
}

type Top5Response = {
  allTopView: MainProject[],
  categoryTopView: CategoryItem[]
}

export interface CategoryItem {
  categoryId: number,
  categoryName: string,
  items: MainProject[]
}

async function getPlanData() {
  const planData: {
    data: PlanResponse,
    error: boolean } = await serverFetch('/api/project/planRankingView', {
  });
  return planData;
}

async function getTop5Data() {
  const top5Data: {
    data: Top5Response,
    error: boolean } = await serverFetch('/api/project/categoryRankingView', {
  });
  return top5Data;
}


export default async function Home() {
  const planData = await getPlanData();
  const top5Data = await getTop5Data();

  const premiumProjects = planData.data?.find((plan: PlanResponseItem) => plan.planName === "PREMIUM")?.items || [];
  const proProjects = planData.data?.find((plan: PlanResponseItem) => plan.planName === "PRO")?.items || [];

  if (planData.error || top5Data.error) {
    return (
      <ServerErrorComponent message={"다시 시도해 주세요."} />
    )
  }

  return (
    <div className="min-h-screen w-full bg-white text-black">
      <Carousel projects={premiumProjects} />
      <EditorPicks projects={proProjects} />
      <Top5 allProjects={top5Data.data.allTopView} categoryProjects={top5Data.data.categoryTopView} />
    </div>
  );
}
