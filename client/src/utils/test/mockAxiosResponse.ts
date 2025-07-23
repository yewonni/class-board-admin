import { AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from "axios";

export function createAxiosResponse<T>(
  data: T,
  status = 200,
  statusText = "OK",
  config?: Partial<InternalAxiosRequestConfig>
): AxiosResponse<T> {
  return {
    data,
    status,
    statusText,
    headers: new AxiosHeaders(),
    config: {
      headers: new AxiosHeaders(),
      method: "get",
      url: "",
      ...config,
    } as InternalAxiosRequestConfig,
  };
}
