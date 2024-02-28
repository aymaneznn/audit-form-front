<template>
  <div class="layout-footer">
    <img alt="Logo" :src="footerImage()" height="20" class="mr-2" />
    by
    <span class="font-medium ml-2">Okteo SAS</span>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue';

const app = getCurrentInstance();

function footerImage() {
  return app?.appContext.config.globalProperties.$appState.darkTheme ? 'images/logo-white.svg' : 'images/logo-dark.svg';
}
</script>
