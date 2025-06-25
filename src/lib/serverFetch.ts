const serverFetch = async (url: string, options: RequestInit): Promise<{ data: any | null, error: boolean }> => {
  const fetchOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include', // 쿠키를 포함하기 위한 설정
    ...options,
  };

  try {
    // SSR 환경에서는 상대 경로 대신 절대 URL 사용
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const fullUrl = url.startsWith('http') ? url : `${apiUrl}${url}`;
    console.log('➡️ SSR Fetch URL:', fullUrl);
    
    const response = await fetch(fullUrl, fetchOptions);
    console.log('📦 SSR Response status:', response.status);
    
    if (!response.ok) {
      console.error('❌ Response not OK:', response.statusText);
      return { data: null, error: true };
    }
    
    return { data: await response.json(), error: false };
  } catch (error) {
    console.error('🔥 SSR fetch exception:', error);
    return { data: null, error: true };
  }
}

export default serverFetch;