import { ref } from 'vue';

const isLoading = ref(false);
const isLoading2 = ref(false);
const isDialogLoading = ref(false);
const isButtonLoading = ref(false);

export function useUtilsService() {
  return {
    isLoading,
    isLoading2,
    isDialogLoading,
    isButtonLoading,
  };
}
