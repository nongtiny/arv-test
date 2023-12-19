import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://random-data-api.com/api'
});