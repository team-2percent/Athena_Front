import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, password } = data;
    const adminJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQURNSU4ifQ.29eLEIGd2z128wIMmHaMfmN-OeZn2YYJEE6fuxgjmBI"
    const userJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiVVNFUiJ9.Bibp8a-_pYZyitTT2Jy41pD12GESwe4x6EiJ1OGVkAI"

    // 이메일과 비밀번호 유효성 검사
    if (!email || !password) {
      return NextResponse.json(
        { message: "이메일과 비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    // TODO: 실제 로그인 로직 구현 필요
    // 예시 응답
    const mockResponse = {
      "accessToken": userJWT,
      "refreshToken": userJWT,
      "userId": 9007199254740991
    };

    return NextResponse.json(mockResponse, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { message: "로그인 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
