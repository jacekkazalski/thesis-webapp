import useAuth from "./useAuth.tsx";

const useRefreshToken = () => {
    const {setAuth} = useAuth()

    const refresh = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/auth/refresh", {
                method: "GET",
                credentials: "include"
            })
            if (!response.ok) {
                throw new Error("Refresh token failed")
            }
            const data = await response.json()
            const accessToken = data.accessToken;

            setAuth(prev => ({...prev, accessToken: accessToken}))
            return accessToken
        } catch (err) {
            console.error(err.message)
        }
    }
    return refresh;
}

export default useRefreshToken