'use client'

import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/auth";

export default function RegisterPageButton() {
    const { isLoggedIn } = useAuthStore();
    const router = useRouter();

    if (!isLoggedIn) {
        return null;
    }

    return (
        <button
            onClick={() => router.push('/project/register')}
            className="fixed bottom-8 right-8 w-20 h-20 bg-main-color hover:bg-secondary-color-dark rounded-full shadow-lg flex items-center justify-center transition-colors duration-200"
            aria-label="프로젝트 등록"
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-9 w-9 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                />
            </svg>
        </button>
    )
}