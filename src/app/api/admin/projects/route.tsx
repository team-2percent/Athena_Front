import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const keyword = searchParams.get("keyword") ? searchParams.get("keyword") : ""
  const direction = searchParams.get("direction") ? searchParams.get("direction") : "asc"
  const page = searchParams.get("page") ? parseInt(searchParams.get("page") as string) : 1

  console.log(keyword, direction, page)
  
  return NextResponse.json({
    "content": [
      {
        "projectId": 13,
        "title": "추가 프로젝트 3",
        "createdAt": "2025-05-01 00:00:00.000000",
        "sellerName": "rmvmf",
        "approvalStatus": "PENDING"
      },
      {
        "projectId": 20,
        "title": "추가 프로젝트 10",
        "createdAt": "2025-07-11 00:00:00.000000",
        "sellerName": "rmvmf",
        "approvalStatus": "APPROVED"
      },
    ],
    "pageInfo": {
      "currentPage": page,
      "totalPages": 1
    },
    "pendingCount": 1
  });
}