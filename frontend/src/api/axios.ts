import axios from "axios";
const BASE_URL = "http://localhost:3000/api";
export default axios.create({
    baseURL: BASE_URL,
})

export const axiosCustom = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})