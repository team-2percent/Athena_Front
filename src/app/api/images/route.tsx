import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const requiredKeys = ["imageGroupId", "files"];
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data") && !contentType.includes("application/x-www-form-urlencoded")) {
        return NextResponse.json({ error: "Invalid Content-Type" }, { status: 400 });
    }
    const formData = await request.formData();

    for (const key of requiredKeys) {
        if (!formData.has(key)) {
            return NextResponse.json({ error: `${key} is missing` }, { status: 400 });
        }
    }

    const files = formData.getAll("files");
    if (!Array.isArray(files) || files.length === 0) {
        return NextResponse.json({ error: "files must be a non-empty array" }, { status: 400 });
    }

    if (files.length > 5) {
        return NextResponse.json({ error: "You can upload up to 5 files only" }, { status: 400 });
    }

    return NextResponse.json({
        projectId: 98238942892489,
        imageGroupId: formData.get("imageGroupId"),
    });
}
