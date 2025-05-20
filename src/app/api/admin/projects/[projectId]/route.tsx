import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const params = request.nextUrl.pathname.split("/");
    const projectId = params[params.length - 1];
    console.log(projectId)
    const markdown = `# 프로젝트 기본 정보\n**프로젝트입니다!**\n## 프로젝트 기본 정보\n\n## 프로젝트 기본 정보\n\n## 프로젝트 기본 정보\n`
    const project = {
        "id": 9007199254740991,
        "category": {
          "id": 9007199254740991,
          "categoryName": "string"
        },
        "title": "string",
        "description": "string",
        "goalAmount": 9007199254740991,
        "totalAmount": 9007199254740991,
        "markdown": markdown,
        "startAt": "2025-05-15T12:11:24.864Z",
        "endAt": "2025-05-15T12:11:24.864Z",
        "shippedAt": "2025-05-15T12:11:24.864Z",
        "createdAt": "2025-05-15T12:11:24.864Z",
        "approvalStatus": "PENDING",
        "imageUrls": [
          "https://img.freepik.com/free-photo/closeup-hands-using-computer-laptop-with-screen-showing-analysis-data_53876-23014.jpg?ga=GA1.1.1561605491.1745197152&semt=ais_hybrid&w=740",
          "https://img.freepik.com/free-photo/close-up-hand-holding-futuristic-screen_23-2149126945.jpg?ga=GA1.1.1561605491.1745197152&semt=ais_hybrid&w=740",
          "https://img.freepik.com/free-vector/big-data-blue-plot-visualization-futuristic-infographic-information-aesthetic-design-visual-data-complexity-complex-data-threads-graphic-visualization_1217-2183.jpg?ga=GA1.1.1561605491.1745197152&semt=ais_hybrid&w=740",
          "https://img.freepik.com/free-photo/information-improvement-data-report_53876-138583.jpg?ga=GA1.1.1561605491.1745197152&semt=ais_hybrid&w=740",
          "https://img.freepik.com/free-vector/data-report-illustration-concept_114360-883.jpg?ga=GA1.1.1561605491.1745197152&semt=ais_hybrid&w=740"
        ],
        "sellerResponse": {
          "id": 9007199254740991,
          "nickname": "string",
          "sellerIntroduction": "string",
          "linkUrl": "https://img.freepik.com/free-psd/flat-design-data-privacy-poster-template_23-2149353496.jpg?ga=GA1.1.1561605491.1745197152&semt=ais_hybrid&w=740"
        },
        "productResponses": [
          {
            "id": 9007199254740991,
            "name": "string",
            "description": "string",
            "price": 9007199254740991,
            "stock": 9007199254740991,
            "options": [
              "string"
            ]
          }
        ]
      }
    
    return NextResponse.json(project);
}