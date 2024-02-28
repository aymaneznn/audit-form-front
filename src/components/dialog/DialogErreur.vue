<template>
  <PDialog header="Erreur" v-model:visible="afficherDialogErreur" :modal="true" :closable="false">
    <p class="m-0 flex align-items-center">
      <i class="pi pi-exclamation-circle mr-3" aria-hidden="true" />
      <span id="libelleErreur" v-if="libelleErreur">
        <pre>{{ libelleErreur }}</pre>
      </span>
      <span id="libelleErreur" v-else>Une erreur s'est produite.</span>
    </p>
    <template #footer>
      <PButton id="btnFermerDialogErreur" label="Fermer" @click="fermerDialog()" class="mr-0" />
    </template>
  </PDialog>
</template>

<script lang="ts" setup>
import { computed, type WritableComputedRef } from 'vue';

const props = defineProps<{ afficherDialogErreur: boolean; libelleErreur: string }>();
const emit = defineEmits<{
  (e: 'update:afficherDialogErreur', p: boolean): void;
  (e: 'update:libelleErreur', p: string): void;
}>();

const afficherDialogErreur: WritableComputedRef<boolean> = computed({
  get(): boolean {
    return props.afficherDialogErreur;
  },
  set(nouvelleValeur: boolean): void {
    emit('update:afficherDialogErreur', nouvelleValeur);
  },
});

const libelleErreur: WritableComputedRef<string> = computed({
  get(): string {
    return props.libelleErreur;
  },
  set(nouvelleValeur: string): void {
    emit('update:libelleErreur', nouvelleValeur);
  },
});

function fermerDialog() {
  afficherDialogErreur.value = false;
  libelleErreur.value = '';
}
</script>

<style scoped>
i {
  font-size: 2rem;
}

span pre {
  font-family: var(--font-family);
}
</style>
