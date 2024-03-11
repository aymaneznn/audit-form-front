<template>
  <div class="p-7">
    <PCard class="p-5">
      <template #content>
        <h1 class="title mb-6">Réponses</h1>

        <!-- Statistics -->
        <div class="mb-4">
          <p class="mb-2"><strong>Total de Réponses:</strong> {{ reponsesToDataTable.length }}</p>
          <p><strong>Questions Non Répondues:</strong> {{ nbQuestionNonRepondue }}</p>
        </div>

        <!-- DataTable -->
        <DataTable :value="reponsesToDataTable" tableStyle="min-width: 50rem">
          <Column field="id_group_reponse" header="Utilisateur"></Column>
          <Column field="formulaire.titre" header="Formulaire"></Column>
          <Column field="posterLe" header="Date de la réponse"></Column>
          <Column header="Actions">
            <template #body="{ data }">
              <PButton icon="pi pi-search" @click="showResponseDialog(data)" class="p-button-info"></PButton>
            </template>
          </Column>
        </DataTable>

        <!-- Dialog for Detailed Responses -->
        <PDialog v-model="responseDialogVisible" :visible="responseDialogVisible" style="width: 50%" class="custom-dialog">
          <div>
            <h3>Détails de la Réponse</h3>
            <div class="card">
              <Panel v-for="question in reponses" :key="question.id" class="response-item mb-2" toggleable>
                <template #header>
                  <div class="flex align-items-center gap-2">
                    <span class="font-bold">{{ question.question?.question }}</span>
                  </div>
                </template>
                <p class="m-0">{{ question.donnees_reponse?.data }}</p>
              </Panel>
            </div>
            <PButton label="Fermer" @click="closeResponseDialog" class="p-button-secondary"></PButton>
          </div>
        </PDialog>
      </template>
    </PCard>
  </div>

  <Toast />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApiService } from '@/composables/GestionFormulaireService';
import FormulaireModel from '@/models/FormulaireModel';
import ReponseModel from '@/models/ReponseModel';
import { useToast } from 'primevue/usetoast';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import PDialog from 'primevue/dialog';
import PButton from 'primevue/button';
import PCard from 'primevue/card';
import Panel from 'primevue/panel';

const apiService = useApiService();

const router = useRouter();

const toast = useToast();
const id = ref();

const formulaires = ref<FormulaireModel[]>([]);
const reponses = ref<ReponseModel[]>([]);
const reponsesToDataTable = ref<ReponseModel[]>([]);
const responseDialogVisible = ref(false);
const selectedRowData = ref(null);
const nbQuestionNonRepondue = ref(0);

const chartData = ref();
const chartOptions = ref();

onMounted(async () => {
  const routeParams = router.currentRoute.value.params;
  id.value = routeParams.id;

  if (id.value === undefined) {
    id.value = 1;
  }
  formulaires.value = await apiService.getAllFormulaires();
  reponses.value = await apiService.getReponsesByFormulaire(id.value);
  loadReponse();
  reponsesToDataTable.value = groupReponsesByGroup(reponses.value);
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        type: 'bar',
        label: 'Dataset 1',
        backgroundColor: documentStyle.getPropertyValue('--cyan-500'),
        data: [50, 25, 12, 48, 90, 76, 42],
      },
      {
        type: 'bar',
        label: 'Dataset 2',
        backgroundColor: documentStyle.getPropertyValue('--gray-500'),
        data: [21, 84, 24, 75, 37, 65, 34],
      },
      {
        type: 'bar',
        label: 'Dataset 3',
        backgroundColor: documentStyle.getPropertyValue('--orange-500'),
        data: [41, 52, 24, 74, 23, 21, 32],
      },
    ],
  };
};
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
};

function groupReponsesByGroup(reponses: ReponseModel[]): ReponseModel[] {
  const groupedReponses: ReponseModel[] = [];
  const groups: Record<string, ReponseModel[]> = {};

  for (const reponse of reponses) {
    const groupId = reponse.id_group_reponse;

    if (!groups[groupId ?? 0]) {
      groups[groupId ?? 0] = [];
    }

    groups[groupId ?? 0].push(reponse);
  }

  for (const groupId in groups) {
    if (Object.prototype.hasOwnProperty.call(groups, groupId)) {
      const groupReponses = groups[groupId];
      const groupReponse: unknown = {
        id_group_reponse: groupId,
        formulaire: groupReponses[0].formulaire,
        question: groupReponses[0].question,
        posterLe: groupReponses[0].poster_le,
      };

      groupedReponses.push(groupReponse as ReponseModel);
    }
  }

  return groupedReponses;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function showResponseDialog(rowData: any) {
  selectedRowData.value = rowData;
  responseDialogVisible.value = true;
  reponses.value = await apiService.getReponsesByFormulaire(id.value);

  reponses.value.forEach((reponse) => {
    if (!reponse.donnees_reponse?.data) {
      reponse.donnees_reponse.data = 'Non répondu';
    } else if (typeof reponse.donnees_reponse.data === 'object' && 'code' in reponse.donnees_reponse.data) {
      reponse.donnees_reponse.data = reponse.donnees_reponse.data.code;
    } else if (
      Array.isArray(reponse.donnees_reponse.data) &&
      reponse.donnees_reponse.data.every((item) => typeof item === 'object' && 'code' in item && 'name' in item)
    ) {
      reponse.donnees_reponse.data = reponse.donnees_reponse.data.map((item) => item.code);
    }
  });
  reponses.value = reponses.value.filter((reponse) => reponse.id_group_reponse === rowData?.id_group_reponse);
}

function loadReponse() {
  reponses.value.forEach((reponse) => {
    if (!reponse.donnees_reponse?.data) {
      reponse.donnees_reponse.data = 'Non répondu';
      nbQuestionNonRepondue.value++;
    } else if (typeof reponse.donnees_reponse.data === 'object' && 'code' in reponse.donnees_reponse.data) {
      reponse.donnees_reponse.data = reponse.donnees_reponse.data.code;
    } else if (
      Array.isArray(reponse.donnees_reponse.data) &&
      reponse.donnees_reponse.data.every((item) => typeof item === 'object' && 'code' in item && 'name' in item)
    ) {
      reponse.donnees_reponse.data = reponse.donnees_reponse.data.map((item: { code: unknown }) => item.code);
    }
  });
}

function closeResponseDialog() {
  responseDialogVisible.value = false;
  selectedRowData.value = null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const showSuccess = (title: string, detail: string) => {
  if (title === '') {
    title = 'Succès';
  }
  toast.add({ severity: 'success', summary: title, detail: detail, life: 3000 });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const showInfo = (title: string, detail: string) => {
  if (title === '') {
    title = 'Information';
  }
  toast.add({ severity: 'info', summary: title, detail: detail, life: 3000 });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const showWarn = (title: string, detail: string) => {
  if (title === '') {
    title = 'Attention';
  }
  toast.add({ severity: 'warn', summary: title, detail: detail, life: 3000 });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const showError = (title: string, detail: string) => {
  if (title === '') {
    title = 'Erreur';
  }
  toast.add({ severity: 'error', summary: title, detail: detail, life: 3000 });
};
</script>

<style scoped>
.custom-dialog {
  font-family: 'Arial', sans-serif;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.custom-dialog h3 {
  color: var(--main-color);
  margin-bottom: 20px;
  font-size: 18px;
}

.custom-dialog p {
  margin: 0;
  color: #333;
}

.custom-dialog .p-button-secondary {
  margin-top: 20px;
  background-color: #ccc;
  color: #333;
}
</style>
