"use client"

import PlanProjects from "@/components/main/PlanProjects";
import Top5 from "@/components/main/Top5";

export default function Home() {
    return (
      <div className="min-h-screen w-full bg-white text-black">
        <PlanProjects />
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <Top5 />
        </div>
      </div>
    );
}
