import axiosInstance from "./axiosInstance";

export const fetchGet = async <T>(
  endpoint: string,
  params = {}
): Promise<T> => {
  const response = await axiosInstance.get<T>(endpoint, { params });
  return response.data;
};

export const fetchPost = async <T>(
  endpoint: string,
  data = {},
  headers = {}
): Promise<T> => {
  const response = await axiosInstance.post<T>(endpoint, data, { headers });
  return response.data;
};