import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, password } = data;

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
      "accessToken": "string",
      "refreshToken": "string",
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
