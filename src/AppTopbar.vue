<template>
  <div class="layout-topbar">
    <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
      <em :class="iconeBouton"></em>
    </button>
    <router-link to="/" class="layout-topbar-logo">
      <img alt="Logo" :src="topbarImage()" />
      <span>SAKAI</span>
    </router-link>

    <button
      class="p-link layout-topbar-menu-button layout-topbar-button"
      v-styleclass="{
        selector: '@next',
        enterClass: 'hidden',
        enterActiveClass: 'scalein',
        leaveToClass: 'hidden',
        leaveActiveClass: 'fadeout',
        hideOnOutsideClick: true,
      }"
    >
      <em class="pi pi-ellipsis-v"></em>
    </button>
    <ul class="layout-topbar-menu hidden lg:flex origin-top">
      <li>
        <div class="layout-topbar-button" :class="{ 'w-6rem border-radius-2rem': windowInnerWidth >= 992 }">
          <em class="fas fa-moon" :class="{ 'mr-2': windowInnerWidth >= 992 }"></em>
          <InputSwitch v-model="themeSombreActive" @change="changerTheme" />
        </div>
      </li>
      <li>
        <button class="p-link layout-topbar-button">
          <em class="fas fa-cog"></em>
          <span>Paramètres</span>
        </button>
      </li>
      <li>
        <button class="p-link layout-topbar-button">
          <em class="fas fa-bell"></em>
          <span>Notifications</span>
        </button>
      </li>
      <li>
        <div class="p-link layout-topbar-button">
          <Avatar size="large" shape="circle"><div>AZ</div></Avatar>
          <span class="ml-3">Profil</span>
        </div>
      </li>
      <li>
        <button class="p-link layout-topbar-button" @click="seDeconnecter()">
          <em class="fas fa-sign-out"></em>
          <span>Se déconnecter</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue';
import EventBus from '@/AppEventBus';

const props = defineProps<{
  staticMenuInactive: boolean;
  mobileMenuActive: boolean;
}>();
const emit = defineEmits<{
  (e: 'menu-toggle', v: Event): void;
  (e: 'topbar-menu-toggle', v: Event): void;
}>();

const app = getCurrentInstance();

const windowInnerWidth = ref(window.innerWidth);
window.addEventListener('resize', storeWindowInnerWidth);
const themeSombreActive = ref(false);

const iconeBouton = computed(() => {
  let icone = 'pi pi-times';
  if ((windowInnerWidth.value >= 992 && props.staticMenuInactive) || (windowInnerWidth.value < 992 && !props.mobileMenuActive)) {
    icone = 'pi pi-bars';
  }
  return icone;
});

onMounted(() => {
  if (window.localStorage.getItem('dark-mode')) {
    themeSombreActive.value = window.localStorage.getItem('dark-mode') === 'true';
    if (themeSombreActive.value) changerTheme();
  }
});

function onMenuToggle(event: Event) {
  emit('menu-toggle', event);
}

function topbarImage() {
  return app?.appContext.config.globalProperties.$appState.darkTheme ? 'images/logo-white.svg' : 'images/logo-dark.svg';
}

function storeWindowInnerWidth() {
  windowInnerWidth.value = window.innerWidth;
}

function changerTheme() {
  EventBus.emit('theme-change', {
    theme: themeSombreActive.value ? 'lara-dark-indigo' : 'lara-light-indigo',
    dark: themeSombreActive.value,
  });
  window.localStorage.setItem('dark-mode', themeSombreActive.value.toString());
}

function seDeconnecter() {
  app?.appContext.config.globalProperties.keycloakInstance.logout();
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', storeWindowInnerWidth);
});
</script>

<style lang="scss" scoped>
.border-radius-2rem {
  border-radius: 2rem !important;
}
</style>
