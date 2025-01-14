import useAuth from "./useAuth.tsx";
import axios from "../api/axios.ts"
import {AuthState} from "../services/types.ts";

const useRefreshToken = () => {
    const {setAuth} = useAuth()

    const refresh = async () => {
        try {
            const response = await axios.get("/auth/refresh", {
                withCredentials: true
            })
            const accessToken = response.data.accessToken;

            setAuth((prev: AuthState) => ({...prev, accessToken: accessToken}))
            return accessToken
        } catch (err) {
            setAuth({})
            if(err instanceof Error) {
                console.error(err.message)
            }

        }
    }
    return refresh;
}

export default useRefreshToken