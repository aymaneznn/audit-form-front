import { ref } from 'vue';
import type UserModel from '@/models/UserModel';
import { useUserApi } from './UserAPI';

const userModel = ref<UserModel | null>();
const userApi = useUserApi();

export function useUserService() {
  return {
    userModel,
    getUser() {
      return userModel.value;
    },
    setUser(user: UserModel) {
      userModel.value = user;
    },
    setToken(token: string | undefined) {
      if (userModel.value) userModel.value.token = token;
    },
    async getAllUsers(): Promise<Array<UserModel>> {
      return userApi.listUsers();
    },
  };
}
