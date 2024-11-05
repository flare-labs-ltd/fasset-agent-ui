import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.API_URL,
    // removed atm, all api endpoints are public
    /*headers: {
        'X-API-KEY': process.env.FASSET_API_KEY
    }*/
})

export default apiClient;
