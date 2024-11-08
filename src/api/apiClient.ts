import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.API_URL
})

if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('FASSET_TOKEN');
    apiClient.defaults.headers.common = { Authorization: `Bearer ${token}`};
}

export default apiClient;
