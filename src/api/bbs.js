import api from './axios'

export const fetchBbsList = ({ page = 0, size = 10, keyword=''} = {}) => {
   const params = { page, size }
   if(keyword && keyword.trim() !== '') params.keyword = keyword;
   return api.get("/bbs", { params });
} 

export const getBbs = ( id ) => api.get(`bbs/${id}`);
export const createBbs = ( payload ) => api.post(`/bbs`, payload);  //글쓰기
export const updateBbbs = (id, payload) => api.put(`/bbs/${id}`, payload);  //수정
export const deleteBbs = (id, pass) => api.delete(`bbs/${id}`, { params: { pass }});