import useAuth from "./useAuth";
import axios from "../api/axios";
import { AuthState } from "../utils/types";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.get("/auth/refresh", {
        withCredentials: true,
      });
      const accessToken = response.data.accessToken;

      setAuth((prev: AuthState) => ({ ...prev, accessToken: accessToken }));
      return accessToken;
    } catch (err) {
      setAuth({});
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };
  return refresh;
};

export default useRefreshToken;
