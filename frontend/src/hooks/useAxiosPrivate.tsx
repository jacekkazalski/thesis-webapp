import {axiosPrivate} from "../api/axios.ts";
import useRefreshToken from "./useRefreshToken.tsx";
import useAuth from "./useAuth.tsx";
import {useEffect} from "react";

// Attach interceptors to automatically refresh access token
const useAxiosPrivate = () => {
    const refresh = useRefreshToken()
    const {auth} = useAuth()

    useEffect(() => {
        // Add authorization header if it's missing
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if(!config.headers['Authorization']) {
                    console.log('Inteceptor Attaching headers')
                    config.headers['Authorization'] = `Bearer ${auth.accessToken}`
                }
                return config
            }, (error) => Promise.reject(error)
        )
        // Retry request after trying to refresh the access token
        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                // Expired access token && prevent endless loop
                if (error?.response.status === 403 && !prevRequest?.sent) {
                    console.log('Interceptor attempting token refresh')
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                    return axiosPrivate(prevRequest)
                }
                return Promise.reject(error)
            }
        );
        return () => {
            axiosPrivate.interceptors.response.eject(responseIntercept);
            axiosPrivate.interceptors.response.eject(requestIntercept)
        }
    }, [auth, refresh]);

    return axiosPrivate;
}

export default useAxiosPrivate;