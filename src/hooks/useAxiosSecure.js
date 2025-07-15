import axios from "axios";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { app } from "../firebase/firebase.config";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
});

const useAxiosSecure = () => {
  const auth = getAuth(app);

  useEffect(() => {
    const requestIntercept = axiosSecure.interceptors.request.use(
      async (config) => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const token = await currentUser.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestIntercept);
    };
  }, [auth]);

  return [axiosSecure];
};

export default useAxiosSecure;
