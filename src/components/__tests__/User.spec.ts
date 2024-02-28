import { describe, expect, test } from 'vitest';
import { mount } from '@vue/test-utils';
import User from '@/components/User.vue';
import type UserModel from '@/models/UserModel';

describe('User.vue', () => {
  test('should display a user name and its email', () => {
    const userModel = {
      id: '1',
      firstname: 'Brazier',
      lastname: 'Arnaud',
      email: 'abrazier@okteo.fr',
    } as UserModel;

    const wrapper = mount(User, { props: { userModel } });

    // You need an h2 element for the user name
    const userName = wrapper.get('h2');
    // The h2 element should contain the user name
    expect(userName.text()).toContain('Brazier');
    // You need a h3 element for the email
    const userEmail = wrapper.get('h3');
    // The h3 element should contain the email
    expect(userEmail.text()).toContain('abrazier@okteo.fr');
  });
});
