import axios from 'axios';

const baseURL = '/api';

export const axiosClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});
