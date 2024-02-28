<template>
  <RouterView></RouterView>
</template>

<script setup lang="ts">
import { onMounted, ref, getCurrentInstance, onBeforeUnmount } from 'vue';
import EventBus from '@/AppEventBus';

const app = getCurrentInstance();

const themeChangeListener = ref<((event: { theme: string; dark: boolean }) => void) | null>(null);

onMounted(() => {
  themeChangeListener.value = (event: { theme: string; dark: boolean }) => {
    const elementId = 'theme-link';
    const linkElement = document.getElementById(elementId);
    const cloneLinkElement = linkElement?.cloneNode(true) as HTMLElement;
    const newThemeUrl = linkElement?.getAttribute('href')?.replace(app?.appContext.config.globalProperties.$appState.theme, event.theme);

    cloneLinkElement.setAttribute('id', elementId + '-clone');
    if (newThemeUrl) cloneLinkElement.setAttribute('href', newThemeUrl);
    cloneLinkElement.addEventListener('load', () => {
      linkElement?.remove();
      cloneLinkElement.setAttribute('id', elementId);
    });
    linkElement?.parentNode?.insertBefore(cloneLinkElement, linkElement.nextSibling);

    const overridesElementId = 'overrides-theme-link';
    const overridesLinkElement = document.getElementById(overridesElementId);
    const overridesCloneLinkElement = overridesLinkElement?.cloneNode(true) as HTMLElement;
    const newOverridesUrl = overridesLinkElement
      ?.getAttribute('href')
      ?.replace(app?.appContext.config.globalProperties.$appState.theme, event.theme);

    overridesCloneLinkElement.setAttribute('id', overridesElementId + '-clone');
    if (newOverridesUrl) overridesCloneLinkElement.setAttribute('href', newOverridesUrl);
    overridesCloneLinkElement.addEventListener('load', () => {
      overridesLinkElement?.remove();
      overridesCloneLinkElement.setAttribute('id', overridesElementId);
    });
    overridesLinkElement?.parentNode?.insertBefore(overridesCloneLinkElement, overridesLinkElement.nextSibling);

    if (app) {
      app.appContext.config.globalProperties.$appState.theme = event.theme;
      app.appContext.config.globalProperties.$appState.darkTheme = event.dark;
    }
  };

  EventBus.on('theme-change', themeChangeListener.value);
});

onBeforeUnmount(() => {
  EventBus.off('theme-change', themeChangeListener.value);
});
</script>
