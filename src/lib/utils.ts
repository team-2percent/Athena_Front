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