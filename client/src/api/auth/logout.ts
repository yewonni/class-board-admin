import axiosInstance from "../axiosInstance";

export const logout = () => {
  return axiosInstance.post("/auth/logout");
};
