<template>
  <div>
    <h2>{{ userModel.firstname }} {{ userModel.lastname }}</h2>
    <h3 class="email">{{ userModel.email }}</h3>
  </div>
</template>

<script lang="ts" setup>
import type UserModel from '@/models/UserModel';

defineProps<{
  userModel: UserModel;
}>();
</script>

<style scoped>
.email {
  color: blueviolet;
}
</style>
