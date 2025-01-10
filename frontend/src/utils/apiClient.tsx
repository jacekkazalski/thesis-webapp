
const BASE_URL = "http://localhost:3000/api";

const apiClient = async (url: string, options: RequestInit = {}) => {
    try {
        const response = await fetch(`${BASE_URL}${url}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
            }
        });
        return await response.json();
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export default apiClient;