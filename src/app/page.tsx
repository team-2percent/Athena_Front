"use client"

import PlanProjects from "@/components/main/PlanProjects";
import Top5 from "@/components/main/Top5";

export default function Home() {
    return (
      <div className="min-h-screen w-full bg-white text-black">
        <PlanProjects />
        <Top5 />
      </div>
    );
}
