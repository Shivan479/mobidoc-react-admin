import { configure } from 'axios-hooks';
import axios from 'axios';
import Notiflix from 'notiflix';

// const API_URL = 'http://localhost:3333/api/v1/';
const API_URL = 'http://mobidoctor.org:8033/api/v1/';

let APIService = axios.create({
  baseURL: API_URL,
});

if(sessionStorage.getItem('user')){
  let user = sessionStorage.getItem('user');
  user = JSON.parse(user)
  let username =  user.username;
  let pwd = atob(sessionStorage.getItem('pwd'))
  APIService = axios.create({
      baseURL: `${API_URL}/`,
      auth: {
          username,
          password: pwd
      }
  });
}


APIService.interceptors.request.use((config)=>{
  Notiflix.Loading.circle('Loading/Sending data.');
  return config;
},(error) => {
  Notiflix.Loading.remove();
  Notiflix.Notify.failure(error.toString());
  return Promise.reject(error);
});

APIService.interceptors.response.use((config) => {
  Notiflix.Loading.remove();
  return config;
},(error) => {
  Notiflix.Loading.remove();
  Notiflix.Notify.failure(error.toString());
  return Promise.reject(error);
});

// configure({
//   APIService,
//   // defaultOptions: {
//   //   manual: false,
//   //   useCache: false,
//   //   ssr: false,
//   // },
// });

export { APIService };