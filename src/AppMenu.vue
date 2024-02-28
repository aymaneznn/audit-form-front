<template>
  <div class="layout-menu-container">
    <AppSubmenu :items="model" class="layout-menu" :root="true" @menuitemClick="onMenuItemClick" @keydown="onKeyDown" />
  </div>
</template>

<script setup lang="ts">
import AppSubmenu from '@/AppSubmenu.vue';
import type { MenuItem } from 'primevue/menuitem';

defineProps<{
  model: Array<MenuItem>;
}>();
const emit = defineEmits<{
  (e: 'menuitem-click', v: { item: MenuItem }): void;
}>();

function onMenuItemClick(event: { item: MenuItem }) {
  emit('menuitem-click', event);
}

function onKeyDown(event: KeyboardEvent) {
  const nodeElement = event.target as HTMLElement;
  if (event.code === 'Enter' || event.code === 'Space') {
    nodeElement.click();
    event.preventDefault();
  }
}
</script>
