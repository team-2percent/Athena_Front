import type { Metadata } from "next";
import localFont from "next/font/local"; // 지정한 폰트를 사용하기 위해 불러옴
import "./globals.css";
import HeaderLoader from "@/components/HeaderLoader";
import RegisterPageButtonLoader from "@/components/RegisterPageButtonLoader";
import AuthProvider from "@/components/AuthProvider";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import FCMMessageListener from "@/components/FcmMessageListener";
import AlertLoader from "@/components/AlertLoader";

// Pretendard 폰트를 사용하기 위해 불러옴
const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: "아테나",
  description: "아테나: 크라우드펀딩 이커머스",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${pretendard.variable} font-pretendard`} // Pretendard 사용
      >
        <ServiceWorkerRegistration />
        <AuthProvider>
          <AlertLoader />
          <HeaderLoader />
          <main className="flex-1 bg-white m-none w-full">
            <div className="flex justify-center mx-auto">
            {children}
            </div>
            <RegisterPageButtonLoader />
            <FCMMessageListener />
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
