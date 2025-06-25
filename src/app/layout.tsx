import type { Metadata } from "next";
import "./globals.css";
import HeaderLoader from "@/components/HeaderLoader";
import RegisterPageButtonLoader from "@/components/RegisterPageButtonLoader";
import AuthProvider from "@/components/AuthProvider";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import FCMMessageListener from "@/components/FcmMessageListener";
import AlertLoader from "@/components/AlertLoader";

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
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="font-pretendard">
        <ServiceWorkerRegistration />
        <AuthProvider />
        <AlertLoader />
        <HeaderLoader />
        <main className="flex-1 bg-white m-none w-full">
          <div className="flex justify-center mx-auto">
          {children}
          </div>
          <RegisterPageButtonLoader />
          <FCMMessageListener />
        </main>
      </body>
    </html>
  );
}
