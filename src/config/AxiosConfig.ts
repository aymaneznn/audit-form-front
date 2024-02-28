import axios, { type InternalAxiosRequestConfig } from 'axios';
import { useUserService } from '@/composables/user/UserService';
import { useDateUtils } from '@/utils/DateUtils';

const { convertStringDatesToJS } = useDateUtils();
const axiosInstance = axios.create({});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const userService = useUserService();
  if (userService.userModel.value) {
    config.headers!.Authorization = `Bearer ${userService.userModel.value.token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    // Do something with response data
    response.data = convertStringDatesToJS(response.data);
    return response;
  },
  (error) => {
    // Do something with response error
    return Promise.reject(error);
  },
);

export default axiosInstance;
