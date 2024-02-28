/// <reference types="vite/client" />

import type { RouterView, RouterLink } from 'vue-router';
import Users from '@/components/Users.vue';
import LoadingSpinner from '@/components/ui-elements/LoadingSpinner.vue';

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    RouterLink: typeof RouterLink;
    RouterView: typeof RouterView;
    Users: typeof Users;
    LoadingSpinner: typeof LoadingSpinner;
  }
}
