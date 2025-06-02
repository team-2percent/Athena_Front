"use client"

import { useState } from "react"
import ProfileInfo from "./ProfileInfo";
import PasswordInfo from "./PasswordInfo";

export default function UserInfo() {
    // 비밀번호 수정 모드
    const [editingPassword, setEditingPassword] = useState(false);

    const toEditingPassword = () => {
        setEditingPassword(true);
    }

    const toEditingProfile = () => {
        setEditingPassword(false);
    }

    if (editingPassword) return <PasswordInfo onBack={toEditingProfile} />
    return <ProfileInfo onTo={toEditingPassword} />
}