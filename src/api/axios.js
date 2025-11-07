import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    withCredentials: false,  //세션,쿠키 필요하면 true
    timeout: 10000
});

//요청 인터셉트 (예:회원토큰)
api.interceptors.request.use((config)=>{
    //인터셉트 문 작성
    return config;
});

//응답 인터셉트 (공통 에러 핸들링)
api.interceptors.response.use(
    (res) => res,
    (err) => {
        console.error('API Error', err?.response || err.message);
        return Promise.reject(err);
    }
);

export default api;