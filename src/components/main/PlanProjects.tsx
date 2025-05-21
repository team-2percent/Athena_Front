"use client"

import { useState, useEffect } from 'react'
import { useApi } from "@/hooks/useApi"
import EditorPicks from './EditorPicks';
import Carousel from './Carousel';
import { MainProject } from '@/lib/projectInterface';

interface ResponseItem {
    planName: "PREMIUM" | "PRO",
    items: MainProject[];
}

export default function PlanProjects() {
    const { isLoading, apiCall } = useApi();

    const [projectsPremium, setProjectsPremium] = useState<MainProject[]>([]);
    const [projectsPro, setProjectsPro] = useState<MainProject[]>([]);

    const loadProjects = () => {
        apiCall<ResponseItem[]>('/api/project/planRankingView', "GET").then(({ data }) => {
            data?.map(plan => {
                if (plan.planName === "PREMIUM") {
                    setProjectsPremium(plan.items);
                } else if (plan.planName === "PRO") {
                    setProjectsPro(plan.items);
                }
            })
        })
    }

    useEffect(() => {
        loadProjects();
    }, [])

    return (
        <>
            <Carousel projects={projectsPremium} isLoading={isLoading} />
            <EditorPicks projects={projectsPro} isLoading={isLoading} />
        </>
    )
}