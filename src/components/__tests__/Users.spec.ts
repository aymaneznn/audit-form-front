import { describe, expect, test, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import type UserModel from '@/models/UserModel';
import Users from '@/components/Users.vue';
import User from '@/components/User.vue';

const mockUserService = {
  getAllUsers: vi.fn(),
};
vi.mock('@/composables/user/UserService', () => ({
  useUserService: () => mockUserService,
}));

const AsyncWrapper = defineComponent({
  components: { Users },
  template: `<Suspense><Users/></Suspense>`,
});

describe('Users.vue', () => {
  test('should display every user name in a title', async () => {
    mockUserService.getAllUsers.mockResolvedValue([
      { firstname: 'Brazier', lastname: 'Arnaud' },
      { firstname: 'Gimaret', lastname: 'Florent' },
    ] as Array<UserModel>);
    const asyncWrapper = mount(AsyncWrapper);
    await flushPromises();

    const wrapper = asyncWrapper.findComponent(Users);
    const userComponents = wrapper.findAllComponents(User);
    // You should have a `User` component per Users
    expect(userComponents).toHaveLength(2);
  });
});
