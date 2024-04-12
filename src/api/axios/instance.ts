import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:31299/",
  // baseURL: 'http://localhost:3000/'
});

// work with token
// const apiInterseptorSetJWTToken = () => api.interceptors.request.use((config))=>{
//   const token = localStorage.getItem('token');
//   if(token){
//     config?.headers?.Authorization = `Bearer ${token}` ?? '';
//   }
//   return config;
// }

// apiInterseptorSetJWTToken()

// work with errors
// const apiInterseptorSetError = () => api.interceptors.response.use(undefined, (error) => {
//   if(error.response.status === 401){
//     localStorage.removeItem('token');
//     window.location.reload();
//   }
//   return Promise.reject(error);
// }

// apiInterseptorSetError()
