<template>
  <div class="p-5">
    <TabView>
      <TabPanel header="Reponses">
        <PCard class="p-5">
          <template #content>
            <!-- Statistics -->
            <div
              class="mb-4 flex justify-content-center"
              style="color: #007bff; font-weight: bold; border: 1px solid black; padding: 0.5rem"
            >
              <p class="mr-5 mt-2">
                <strong style="text-decoration: underline">Total de réponses</strong>: {{ reponsesToDataTable.length }}
              </p>
              <p class="mr-5 mt-2" style="color: #dc3545">
                <strong style="text-decoration: underline">Questions vides</strong>: {{ nbQuestionNonRepondue }}
              </p>
              <p class="mt-2" style="color: #28a745">
                <strong style="text-decoration: underline">Questions répondues</strong>: {{ nbQuestionRepondue }}
              </p>
            </div>

            <!-- DataTable -->
            <DataTable :value="reponsesToDataTable" sortField="poster_le" :sortOrder="-1" tableStyle="min-width: 50rem">
              <Column field="id_group_reponse" header="Utilisateur"></Column>
              <Column field="formulaire.titre" header="Formulaire"></Column>
              <Column field="poster_le" header="Date de la réponse"></Column>
              <Column header="Actions">
                <template #body="{ data }">
                  <PButton icon="pi pi-search" @click="showResponseDialog(data)" class="p-button-info"></PButton>
                </template>
              </Column>
            </DataTable>

            <!-- Dialog for Detailed Responses -->
            <PDialog v-model:visible="responseDialogVisible" style="width: 50%" class="custom-dialog">
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
                <PButton
                  label="Fermer"
                  @click="closeResponseDialog"
                  class="p-button-secondary bg-red-500 border-transparent text-white"
                ></PButton>
              </div>
            </PDialog>
          </template>
        </PCard>
      </TabPanel>
      <TabPanel header="Statistiques">
        <div class="card mt-3">
          <Chart type="bar" :data="chartData1" :options="chartOptions1" class="h-30rem" />
        </div>
        <div class="flex" style="flex-wrap: wrap; justify-content: space-between">
          <div class="card flex justify-content-center" style="width: 49%">
            <Chart type="doughnut" :data="chartData2" :options="chartOptions2" class="w-full md:w-30rem" />
          </div>
          <div class="card" style="width: 50%">
            <Chart type="line" :data="chartData3" :options="chartOptions3" class="h-30rem" />
          </div>
        </div>
      </TabPanel>
    </TabView>
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
import Chart from 'primevue/chart';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

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
const nbQuestionRepondue = ref(0);

const chartData1 = ref();
const chartOptions1 = ref();

const chartData2 = ref();
const chartOptions2 = ref();

const chartData3 = ref();
const chartOptions3 = ref();

type QuestionStat = {
  question: string;
  nombreDeReponse: number;
  nombreDeNonReponse: number;
};

const statQuestions = ref<QuestionStat[]>([]);

onMounted(async () => {
  const routeParams = router.currentRoute.value.params;
  id.value = routeParams.id;

  if (id.value === undefined) {
    id.value = 1;
  }
  formulaires.value = await apiService.getAllFormulaires();
  reponses.value = await apiService.getReponsesByFormulaire(id.value);
  loadReponse();
  loadStats();
  reponsesToDataTable.value = groupReponsesByGroup(reponses.value);

  chartData1.value = setChartData1();
  chartOptions1.value = setChartOptions1();

  chartData2.value = setChartData2();
  chartOptions2.value = setChartOptions2();

  chartData3.value = setChartData3();
  chartOptions3.value = setChartOptions3();
});

const label = ref<string[]>([]);
const dataNbReponse = ref<number[]>([]);
const dataNbNonReponse = ref<number[]>([]);

const setChartData1 = () => {
  for (let i = 0; i < statQuestions.value.length; i++) {
    const question = statQuestions.value[i];
    label.value.push(question.question);
    dataNbReponse.value.push(question.nombreDeReponse);
    dataNbNonReponse.value.push(question.nombreDeNonReponse);
  }

  return {
    labels: label.value,
    datasets: [
      {
        type: 'bar',
        label: 'nombre de réponses',
        backgroundColor: 'rgba(6, 182, 212, 0.5)',
        hoverBackgroundColor: 'rgba(6, 182, 212, 1)',
        data: dataNbReponse.value,
      },
      {
        type: 'bar',
        label: 'nombre de réponses vides',
        backgroundColor: 'rgba(249, 115, 22, 0.5)',
        hoverBackgroundColor: 'rgba(249, 115, 22, 1)',
        data: dataNbNonReponse.value,
      },
    ],
  };
};
const setChartOptions1 = () => {
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

const setChartData2 = () => {
  return {
    labels: ['Nombre de questions répondues', 'Nombre de questions non répondues'],
    datasets: [
      {
        data: [nbQuestionRepondue.value, nbQuestionNonRepondue.value],
        backgroundColor: ['rgba(6, 182, 212, 0.4)', 'rgba(249, 115, 22, 0.4)'],
        hoverBackgroundColor: ['rgba(6, 182, 212, 1)', 'rgba(249, 115, 22, 1)'],
      },
    ],
  };
};
const setChartOptions2 = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');

  return {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor,
        },
      },
    },
  };
};

const setChartData3 = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  const datesSet = new Set(reponsesToDataTable.value.map((reponse) => reponse.poster_le));
  const dates = Array.from(datesSet).map((date) => new Date(date as Date).toLocaleDateString('fr-FR'));
  const statByDate: number[] = [];

  reponsesToDataTable.value.forEach((reponse) => {
    dates.forEach((date) => {
      if (new Date(reponse.poster_le as Date).toLocaleDateString('fr-FR') === date) {
        statByDate[dates.indexOf(date)] = (statByDate[dates.indexOf(date)] || 0) + 1;
      }
    });
  });

  return {
    labels: dates,
    datasets: [
      {
        label: 'Nombre de réponses',
        data: statByDate,
        fill: false,
        borderColor: documentStyle.getPropertyValue('--cyan-500'),
        tension: 0.4,
      },
    ],
  };
};
const setChartOptions3 = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
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
        poster_le: new Date(groupReponses[0].poster_le as Date).toLocaleDateString('fr-FR'),
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
      reponse.donnees_reponse = { data: 'Non répondu' };
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
      reponse.donnees_reponse = { data: 'Non répondu' };
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
  nbQuestionRepondue.value = reponses.value.length - nbQuestionNonRepondue.value;
}

function groupReponsesByQuestion(reponses: ReponseModel[]): Record<string, ReponseModel[]> {
  const groupedReponses: Record<string, ReponseModel[]> = {};

  for (const reponse of reponses) {
    const questionId = reponse.question?.id ?? '';

    if (!groupedReponses[questionId]) {
      groupedReponses[questionId] = [];
    }

    groupedReponses[questionId].push(reponse);
  }
  return groupedReponses;
}

function loadStats() {
  const groupedReponses = groupReponsesByQuestion(reponses.value);

  for (const questionId in groupedReponses) {
    if (Object.prototype.hasOwnProperty.call(groupedReponses, questionId)) {
      const questionReponses = groupedReponses[questionId];

      const questionStat: QuestionStat = {
        question: groupedReponses[questionId][0].question?.question ?? '',
        nombreDeReponse: 0,
        nombreDeNonReponse: 0,
      };

      for (const reponse of questionReponses) {
        if (reponse.donnees_reponse?.data === 'Non répondu') {
          questionStat.nombreDeNonReponse++;
        } else {
          questionStat.nombreDeReponse++;
        }
      }

      statQuestions.value.push(questionStat as QuestionStat);
    }
  }
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
