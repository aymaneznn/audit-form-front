import axiosInstance from '@/config/AxiosConfig';
import type UserModel from '@/models/UserModel';
import { ApiUrlListUsers } from '@/constants/ApiUrls';

export function useUserApi() {
  return {
    async listUsers(): Promise<Array<UserModel>> {
      const res = await axiosInstance.get<Array<UserModel>>(ApiUrlListUsers);
      return res.data;
    },
  };
}
