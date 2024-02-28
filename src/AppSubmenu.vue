<template>
  <ul v-if="items">
    <template v-for="(item, i) of items">
      <li
        v-if="visible(item) && !item.separator"
        :key="item.label?.toString() || i"
        :class="[
          {
            'layout-menuitem-category': root,
            'active-menuitem': activeIndex === i && !item.to && !item.disabled,
          },
        ]"
        role="none"
      >
        <template v-if="root">
          <div class="layout-menuitem-root-text" :aria-label="item.label?.toString()">
            {{ item.label }}
          </div>
          <AppSubmenu :items="visible(item) ? item.items : []" @menuitemClick="$emit('menuitem-click', $event)"></AppSubmenu>
        </template>
        <template v-else>
          <router-link
            v-if="item.to"
            :to="item.to"
            :class="[item.class, 'p-ripple', { 'p-disabled': item.disabled }]"
            :style="item.style"
            @click="onMenuItemClick($event, item, i)"
            :target="item.target"
            :aria-label="item.label"
            exact
            role="menuitem"
            v-ripple
          >
            <em :class="item.icon"></em>
            <span>{{ item.label }}</span>
            <em v-if="item.items" class="pi pi-fw pi-angle-down menuitem-toggle-icon"></em>
            <Badge v-if="item.badge" :value="item.badge"></Badge>
          </router-link>
          <a
            v-if="!item.to"
            :href="item.url || '#'"
            :style="item.style"
            :class="[item.class, 'p-ripple', { 'p-disabled': item.disabled }]"
            @click="onMenuItemClick($event, item, i)"
            :target="item.target"
            :aria-label="item.label?.toString()"
            role="menuitem"
            v-ripple
          >
            <em :class="item.icon"></em>
            <span>{{ item.label }}</span>
            <em v-if="item.items" class="pi pi-fw pi-angle-down menuitem-toggle-icon"></em>
            <Badge v-if="item.badge" :value="item.badge"></Badge>
          </a>
          <transition name="layout-submenu-wrapper">
            <AppSubmenu
              v-show="activeIndex === i"
              :items="visible(item) ? item.items : []"
              @menuitem-click="$emit('menuitem-click', $event)"
            ></AppSubmenu>
          </transition>
        </template>
      </li>
      <li class="p-menu-separator" :style="item.style" v-if="visible(item) && item.separator" :key="'separator' + i" role="separator"></li>
    </template>
  </ul>
</template>

<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem';
import { type PropType, ref } from 'vue';

defineProps({
  items: { type: Array as PropType<Array<MenuItem>>, default: () => [] },
  root: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits<{
  (e: 'menuitem-click', v: { originalEvent: Event; item: MenuItem }): void;
}>();

const activeIndex = ref<number | null>(null);

function onMenuItemClick(event: Event, item: MenuItem, index: number) {
  if (item.disabled) {
    event.preventDefault();
    return;
  }

  if (!item.to && !item.url) {
    event.preventDefault();
  }

  //execute command
  if (item.command) {
    item.command({ originalEvent: event, item: item });
  }

  activeIndex.value = index === activeIndex.value ? null : index;

  emit('menuitem-click', {
    originalEvent: event,
    item: item,
  });
}

function visible(item: MenuItem) {
  return typeof item.visible === 'function' ? item.visible() : item.visible !== false;
}
</script>

<style lang="scss" scoped>
.layout-menu li a {
  font-size: 1.2rem;
  i,
  em {
    width: 2.2rem;
  }
}
</style>
