<template>
  <div v-for="user in users" :key="user.id">
    <User :userModel="user" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type UserModel from '@/models/UserModel';
import User from '@/components/User.vue';
import { useUserService } from '@/composables/user/UserService';

const users = ref<Array<UserModel>>([]);
const userService = useUserService();
users.value = await userService.getAllUsers();
</script>
