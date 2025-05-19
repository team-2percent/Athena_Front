"use client"

import Carousel from "@/components/main/Carousel";
// import CategorySlider from "@/components/main/CategorySlider";
import RankProjectCard from "@/components/main/RankProjectCard";
import { Trophy } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import Spinner from "@/components/common/Spinner";

interface Project {
  id: number;
  title: string;
  views: number;
  sellerName: string;
  achievementRate: number;
  startAt: string;
  endAt: string;
  imageUrl: string;
  createdAt: string;
}

export default function Home() {
  const { isLoading, apiCall } = useApi();
  const [projects, setProjects] = useState<Project[]>([]);
  const loadRankProjects = () => {
    apiCall<Project[]>("/api/projects/all", "GET").then(({ data }) => {
      if (data !== null) setProjects(data);
    })
  }

  useEffect(() => {
    loadRankProjects();
  }, []);

  const categories = [
    {
      id: 1,
      name: "다재한 문구",
      image: "/project-test.png",
    },
    {
      id: 2,
      name: "다재한 문구2",
      image: "/project-test.png",
    },
    // More categories...
  ]
  const categoryProjects: Record<number, { id: number; image: string; sellerName: string; projectName: string; achievementRate: number; daysLeft: number; liked: boolean; }[]> = {
    // 다재한 문구 카테고리 상품
    1: [
      {
        id: 101,
        image: "/project-test3.png",
        sellerName: "문구천국1212312",
        projectName: "귀여운 동물 스티커 세트",
        achievementRate: 0.5,
        daysLeft: 5,
        liked: true,
      },
      {
        id: 102,
        image: "/project-test3.png",
        sellerName: "문구천국",
        projectName: "귀여운 동물 스티커 세트",
        achievementRate: 0.5,
        daysLeft: 5,
        liked: true,
      },
      {
        id: 103,
        image: "/project-test3.png",
        sellerName: "문구천국",
        projectName: "귀여운 동물 스티커 세트",
        achievementRate: 0.5,
        daysLeft: 5,
        liked: true,
      },
      {
        id: 104,
        image: "/project-test3.png",
        sellerName: "문구천국",
        projectName: "귀여운 동물 스티커 세트",
        achievementRate: 0.5,
        daysLeft: 5,
        liked: true,
      },
      {
        id: 56,
        image: "/project-test3.png",
        sellerName: "문구천국",
        projectName: "귀여운 동물 스티커 세트",
        achievementRate: 0.5,
        daysLeft: 5,
        liked: true,
      },
      {
        id: 545,
        image: "/project-test3.png",
        sellerName: "문구천국",
        projectName: "귀여운 동물 스티커 세트",
        achievementRate: 0.5,
        daysLeft: 5,
        liked: true,
      },
      {
        id: 23,
        image: "/project-test3.png",
        sellerName: "문구천국",
        projectName: "귀여운 동물 스티커 세트",
        achievementRate: 0.5,
        daysLeft: 5,
        liked: true,
      },
      {
        id: 123123,
        image: "/project-test3.png",
        sellerName: "문구천국",
        projectName: "귀여운 동물 스티커 세트",
        achievementRate: 0.5,
        daysLeft: 5,
        liked: true,
      },
    ],
    2: [
      {
        id: 9,
        image: "/project-test2.png",
        sellerName: "문구천국",
        projectName: "귀여운 동물 스티커 세트",
        achievementRate: 0.5,
        daysLeft: 5,
        liked: true,
      },
      {
        id: 14324,
        image: "/project-test2.png",
        sellerName: "문구천국",
        projectName: "귀여운 동물 스티커 세트",
        achievementRate: 0.5,
        daysLeft: 5,
        liked: true,
      },
      {
        id: 1243243,
        image: "/project-test2.png",
        sellerName: "문구천국",
        projectName: "귀여운 동물 스티커 세트",
        achievementRate: 0.5,
        daysLeft: 5,
        liked: true,
      },
      {
        id: 7656,
        image: "/project-test2.png",
        sellerName: "문구천국",
        projectName: "귀여운 동물 스티커 세트",
        achievementRate: 1,
        daysLeft: 5,
        liked: true,
      },
    ],
  }

  const renderRankProjects = () => {
    if (isLoading || projects === null || projects.length < 3) {
      return <Spinner message="상품을 불러오는 중"/>
    }
    return (
      <>
        <div className="flex flex-col md:flex-row gap-4 md:gap-20 mb-10 md:mb-2 md:items-end md:justify-center items-center">
            {/* 2nd Place */}
            <div className="h-fit w-fit order-2 md:order-1">
              <div className="flex items-end w-fit mb-2">
                <Trophy className="text-[rgb(204,204,204)] w-12 h-12" />
                <div className="text-left font-bold text-2xl text-[rgb(204,204,204)]">2위</div>
              </div>
              <RankProjectCard
                projectName={projects[1].title} daysLeft={100} {...projects[1]}
                liked={false}
                size={280}
                // className="mx-auto md:mx-0"
              />
            </div>

            {/* 1st Place */}
            <div className="h-fit order-1 md:order-2">
              <div className="flex items-end w-fit mb-2">
                <Trophy className="text-[rgb(251,229,162)] w-14 h-14" />
                <div className="text-left font-bold text-3xl text-[rgb(251,229,162)]">1위</div>
              </div>
              <RankProjectCard
                projectName={projects[0].title} daysLeft={100} {...projects[0]}
                liked={false}
                size={320}
                // className="mx-auto md:mx-0"
              />
            </div>

            {/* 3rd Place */}
            <div className="h-fit order-3">
              <div className="flex items-end w-fit mb-2">
                <Trophy className="text-[rgb(222,169,155)] w-10 h-10" />
                <div className="text-left font-bold text-xl text-[rgb(222,169,155)]">3위</div>
              </div>
              <RankProjectCard
                projectName={projects[2].title} daysLeft={100} {...projects[2]}
                liked={false}
                size={240}
                // className="mx-auto md:mx-0"
              />
            </div>
          </div>

          {/* Project Grid - Responsive */}
          <div className="flex items-center justify-center mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
              {projects.slice(3).map((project, index) => (
                <div key={project.id} className="mb-4">
                  <RankProjectCard
                  projectName={project.title} daysLeft={100} {...project}
                  liked={false}
                  size={200}
                  // className="mx-auto"
                  rankElement={<div className="font-medium text-base">{index + 3}</div>}                  />
                </div>
              ))}
            </div>
          </div>
      </>
    )
  }

    return (
      <div className="w-full h-fit flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-6 text-left w-full max-w-[900px]"><span className="text-main-color">카테고리 1위!</span> 추천 프로젝트</h2>
        <Carousel />
        {/* Popular Projects */}
        <section className="mt-16 px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">인기 프로젝트</h2>

          {/* Top 3 Projects - Responsive */}
          {renderRankProjects()}
        </section>

        {/* Category Projects */}
        {/* <section className="mt-16 px-4">
          <h2 className="text-2xl font-bold mb-14 text-center">카테고리별 상품</h2>
          {
            categories.map((category) => {
              const projects = categoryProjects[category.id] || [];
              return (
                <CategorySlider
                  key={category.id}
                  category={category}
                  projects={projects}
                  className="mb-10"
                />
              )
            })
          }
        </section> */}
    </div>
  );
}
