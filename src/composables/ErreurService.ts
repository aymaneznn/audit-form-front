import { ref } from 'vue';

const afficherDialogErreur = ref(false);
const libelleErreur = ref('');

export function useErreurService() {
  return {
    afficherDialogErreur,
    libelleErreur,
  };
}
