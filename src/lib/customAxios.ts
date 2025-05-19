import axios from "axios";
import useAuthStore from "@/stores/auth"

const customAxios = axios.create({
baseURL: 'https://athena.i-am-jay.com',
headers: {
    "withCredentials": true,
},
});

const getAccessTokenPromise = () => {
return new Promise((resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('refresh_token')
        resolve(accessToken);
    } catch (err) {
        reject(err);
    }
});
};

// 요청 인터셉터
customAxios.interceptors.request.use(
    config => {
        // 쿠키에서 access_token 가져오기
        const accessToken = localStorage.getItem('access_token');

        // access_token이 있으면 헤더에 추가
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    error => {
        // 요청 오류가 있는 경우 처리
        return Promise.reject(error);
    }
);

// 응답 인터셉터: refresh 로직 구현 시 주석 풀어주세요.
// customAxios.interceptors.response.use(async function (response) {
//     // 2xx 범위에 있는 상태 코드인 경우
//     return response;
// }, async error => {
//     const originalRequest = error.config;
//     const logout = useAuthStore(s => s.logout)
//     if (error.response && error.response.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;
//         try {
//             const newAccessToken = await getAccessTokenPromise();
//             if (newAccessToken) {
//                 originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//                 await new Promise((resolve) => setTimeout(resolve, 1000));
//                 return customAxios(originalRequest);
//             } else {
//                 // Access token retrieval failed (e.g., expired or invalid refresh token)
//                 throw new Error('Failed to retrieve access token');
//             }
//         } catch (err) {
//             // Refresh token also failed, delete cookies and logout
//             logout()
//             return Promise.reject(err);
//         }
//     }
//     return Promise.reject(error);
// });

export default customAxios;