<template>
  <FormCreator @formCreated="handleFormCreated" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FormCreator from '@/views/indep-comp/FormCreator.vue';

const createdFormJson = ref();

function handleFormCreated(json: string) {
  createdFormJson.value = json;
  console.log(createdFormJson.value);
}
</script>
