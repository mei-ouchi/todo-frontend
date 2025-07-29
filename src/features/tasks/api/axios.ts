import axios from 'axios';
import { Configuration, DefaultApi } from '../../../api';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiConfig = new Configuration({
  basePath: 'http://localhost:8080',
});

export const defaultApi = new DefaultApi(apiConfig, undefined, axiosInstance);