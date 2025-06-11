import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateInAdmin(date: string) {
  return new Date(date).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(/\. /g, '.')
}

export function getByteLength(str: string): number {
  // TextEncoder를 사용하여 UTF-8 인코딩된 바이트 길이 계산
  const encoder = new TextEncoder();
  const encoded = encoder.encode(str);
  return encoded.length;
}

// 천 단위 콤마 포맷팅 (문자열/숫자 모두 지원)
export function formatNumberWithComma(value: string | number): string {
  const str = typeof value === "number" ? value.toString() : value;
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 숫자만 남기기
export function parseNumberInput(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

// 앞자리 0 제거 (단, 빈 문자열이면 "0" 반환)
export function removeLeadingZeros(value: string): string {
  return value.replace(/^0+/, "") || "0";
}

// 최대값 제한
export function limitNumber(value: number, max: number): number {
  return value > max ? max : value;
}

// 날짜를 YYYY. MM. DD. 형식으로 포맷팅 (한국 시간 기준)
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}. ${month}. ${day}.`;
}

export function getRidOfNonNumber(str: string): string {
  return str.replace(/[^\d]/g, "")
}

export function getRidOfZero(str: string): string {
  return str.replace(/^0+/, "")
}
