import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.API_URL,
    headers: {
        'X-API-KEY': process.env.FASSET_API_KEY
    }
})

export default apiClient;
