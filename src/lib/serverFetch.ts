const serverFetch = async (url: string, options: RequestInit): Promise<{ data: any | null, error: boolean }> => {
  const fetchOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include', // 쿠키를 포함하기 위한 설정
    cache: 'no-store', // SSR을 위한 캐시 설정
    ...options,
  };

  try {
    // SSR 환경에서는 상대 경로 대신 절대 URL 사용
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const fullUrl = url.startsWith('http') ? url : `${apiUrl}${url}`;
    
    const response = await fetch(fullUrl, fetchOptions);
    
    if (!response.ok) {
      return { data: null, error: true };
    }
    
    return { data: await response.json(), error: false };
  } catch (error) {
    return { data: null, error: true };
  }
}

export default serverFetch;