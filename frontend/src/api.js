import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/auth'
});

export const googleAuth = (code) => 
 {
  return axios.post('http://localhost:8080/api/auth/google', { code }, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
  });
};
