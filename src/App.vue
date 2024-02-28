<template>
  <div :class="containerClass" @click="onWrapperClick">
    <DialogErreur v-model:afficherDialogErreur="afficherDialogErreur" v-model:libelleErreur="libelleErreur" />
    <Toast />
    <ConfirmPopup />
    <AppTopBar :staticMenuInactive="staticMenuInactive" :mobileMenuActive="mobileMenuActive" @menuToggle.prevent="onMenuToggle" />
    <div class="layout-sidebar" @click="onSidebarClick">
      <AppMenu :model="menu" @menuitemClick="onMenuItemClick" />
    </div>

    <div class="layout-main-container">
      <div class="layout-main" :class="{ 'flex align-items-stretch': isFallbackDisplayed }">
        <RouterView v-slot="{ Component }">
          <div :class="{ 'flex align-items-stretch flex-1': isFallbackDisplayed }">
            <ReloadPWA />
            <Suspense timeout="0" @fallback="onFallback()" @resolve="onResolve()">
              <component :is="Component" />
              <template #fallback>
                <LoadingSpinner />
              </template>
            </Suspense>
          </div>
        </RouterView>
      </div>
      <AppFooter />
    </div>

    <transition name="layout-mask">
      <div class="layout-mask p-component-overlay" v-if="mobileMenuActive"></div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import AppFooter from '@/AppFooter.vue';
import AppMenu from '@/AppMenu.vue';
import AppTopBar from '@/AppTopbar.vue';
import DialogErreur from '@/components/dialog/DialogErreur.vue';
import ReloadPWA from '@/components/ReloadPWA.vue';
import { useErreurService } from '@/composables/ErreurService';
import { usePrimeVue } from 'primevue/config';
import type { MenuItem } from 'primevue/menuitem';
import { useToast } from 'primevue/usetoast';
import { computed, onBeforeUpdate, onErrorCaptured, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ErrorCause from './constants/ErrorCause';
import { useUtilsService } from '@/composables/UtilsService';

defineEmits<{
  (e: 'change-theme', v: (event: { theme: string; dark: boolean }) => void): void;
}>();

const route = useRoute();
const primevue = usePrimeVue();
const toast = useToast();
const { afficherDialogErreur, libelleErreur } = useErreurService();
const { isLoading, isLoading2, isDialogLoading, isButtonLoading } = useUtilsService();

onErrorCaptured((e) => {
  if (!afficherDialogErreur.value) {
    afficherDialogErreur.value = true;
    if (e.cause && e.cause === ErrorCause.CUSTOM_UNEXPECTED_ERROR) {
      libelleErreur.value = e.message;
    } else {
      libelleErreur.value = "Une erreur s'est produite.";
    }
  }
  isLoading.value = false;
  isLoading2.value = false;
  isDialogLoading.value = false;
  isButtonLoading.value = false;
  return false;
});

const layoutMode = ref('static');
const staticMenuInactive = ref(false);
const overlayMenuActive = ref(false);
const mobileMenuActive = ref(false);
const menuActive = ref();
const menuClick = ref();
const isFallbackDisplayed = ref(false);
const menu = ref([
  {
    label: 'Accueil',
    items: [
      {
        label: 'Tableau de bord',
        icon: 'pi pi-fw pi-home',
        to: '/',
      },
    ],
  },
  {
    label: 'Section 1',
    icon: 'pi pi-fw pi-sitemap',
    items: [{ label: 'Creation formulaire', icon: 'pi pi-fw pi-circle-off', to: '/create-form' }],
  },
]);

const containerClass = computed(() => {
  return [
    'layout-wrapper',
    {
      'layout-overlay': layoutMode.value === 'overlay',
      'layout-static': layoutMode.value === 'static',
      'layout-static-sidebar-inactive': staticMenuInactive.value && layoutMode.value === 'static',
      'layout-overlay-sidebar-active': overlayMenuActive.value && layoutMode.value === 'overlay',
      'layout-mobile-sidebar-active': mobileMenuActive.value,
      'p-input-filled': primevue.config.inputStyle === 'filled',
      'p-ripple-disabled': primevue.config.ripple === false,
    },
  ];
});

watch(route, () => {
  menuActive.value = false;
  toast.removeAllGroups();
});

function onWrapperClick() {
  if (!menuClick.value) {
    overlayMenuActive.value = false;
    mobileMenuActive.value = false;
  }

  menuClick.value = false;
}

function onMenuToggle() {
  menuClick.value = true;

  if (isDesktop()) {
    if (layoutMode.value === 'overlay') {
      if (mobileMenuActive.value === true) {
        overlayMenuActive.value = true;
      }

      overlayMenuActive.value = !overlayMenuActive.value;
      mobileMenuActive.value = false;
    } else if (layoutMode.value === 'static') {
      staticMenuInactive.value = !staticMenuInactive.value;
    }
  } else {
    mobileMenuActive.value = !mobileMenuActive.value;
  }
}

function onSidebarClick() {
  menuClick.value = true;
}

function onMenuItemClick(event: { item: MenuItem }) {
  if (event.item && !event.item.items) {
    overlayMenuActive.value = false;
    mobileMenuActive.value = false;
  }
}

function addClass(element: HTMLElement, className: string) {
  if (element.classList) element.classList.add(className);
  else element.className += ' ' + className;
}

function removeClass(element: HTMLElement, className: string) {
  if (element.classList) element.classList.remove(className);
  else element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

function isDesktop() {
  return window.innerWidth >= 992;
}

function onFallback() {
  isFallbackDisplayed.value = true;
}

function onResolve() {
  isFallbackDisplayed.value = false;
}

onBeforeUpdate(() => {
  if (mobileMenuActive.value) addClass(document.body, 'body-overflow-hidden');
  else removeClass(document.body, 'body-overflow-hidden');
});
</script>
