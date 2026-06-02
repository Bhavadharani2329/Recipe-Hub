import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

// Create a globally configured Axios instance for ease of use
export const api = axios.create({
  baseURL: API_BASE
});
