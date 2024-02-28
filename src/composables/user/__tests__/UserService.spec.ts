import { describe, expect, test, vi } from 'vitest';
import { type AxiosResponse } from 'axios';
import axiosInstance from '@/config/AxiosConfig';
import { useUserService } from '@/composables/user/UserService';
import type UserModel from '@/models/UserModel';
import { ApiUrlListUsers } from '@/constants/ApiUrls';

describe('userService', () => {
  test('should list users', async () => {
    const response = { data: [{ firstname: 'Brazier' }, { firstname: 'Gimaret' }] } as AxiosResponse<Array<UserModel>>;
    vi.spyOn(axiosInstance, 'get').mockResolvedValue(response);

    const userService = useUserService();
    const users = await userService.getAllUsers();

    // It should get the pending usets from the API
    expect(axiosInstance.get).toHaveBeenCalledWith(ApiUrlListUsers);
    // It should return two users for the `listUsers()` function
    expect(users).toHaveLength(2);
  });
});
