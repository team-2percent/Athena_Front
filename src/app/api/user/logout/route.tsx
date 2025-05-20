import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = cookies();
    (await cookieStore).delete("refreshToken");

    return NextResponse.json({ message: "로그아웃 되었습니다." }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "로그아웃 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
