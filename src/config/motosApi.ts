import axios from 'axios';

export const motosApi = axios.create({
  baseURL: '/api',
});
