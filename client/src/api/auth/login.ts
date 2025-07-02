import axiosInstance from "../axiosInstance";

export const login = (email: string, password: string) => {
  return axiosInstance.post("/auth/login", {
    email,
    password,
  });
};
