"use client"

import ErrorTopToast from "./common/ErrorTopToast";
import useErrorToastStore from "@/stores/useErrorToastStore";

export default function AlertLoader() {
    const { isVisible, title, body } = useErrorToastStore()
    if (isVisible) {
        return <ErrorTopToast title={title} body={body} />
    }
    return null;
}