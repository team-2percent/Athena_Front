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
    const [hasError, setHasError] = useState(false);

    const loadProjects = () => {
        setHasError(false);
        apiCall<ResponseItem[]>('/api/project/planRankingView', "GET").then(({ data, error }) => {
            if (error) {
                console.error('Failed to load plan projects:', error);
                setHasError(true);
                return;
            }
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

    // 에러가 있으면 아무것도 렌더링하지 않음
    if (hasError) {
        return null;
    }

    return (
        <>
            <Carousel projects={projectsPremium} isLoading={isLoading} />
            <EditorPicks projects={projectsPro} isLoading={isLoading} />
        </>
    )
}