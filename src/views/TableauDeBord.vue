<template>
  <PCard>
    <template #content>
      <h1 class="title mb-6">Tableau de bord</h1>
      <div class="grid">
        <template v-for="formulaire in formulaires" :key="formulaire.id">
          <PCard class="form-card">
            <template #content>
              <div class="flex justify-content-between h-auto">
                <div class="" @click="handleFormClick(formulaire)">
                  <h2 class="form-title">{{ formulaire.titre }}</h2>
                  <div class="form-item mb-3">
                    <p class="form-creator" v-if="formulaire.creer_par">Créé par: {{ formulaire.creer_par?.nom ?? 'Unknown' }}</p>
                  </div>
                  <div class="form-footer">
                    <a class="form-url" :href="url" @click="getUrlForm(formulaire.id ? formulaire.id.toString() : '')">
                      URL du formulaire
                    </a>
                  </div>
                </div>
                <div class="question-tools">
                  <PButton
                    icon="pi pi-pencil"
                    class="mr-3 mb-3"
                    text
                    raised
                    rounded
                    aria-label="add"
                    @click="
                      showEditDialog = true;
                      formulaireSelected = formulaire;
                      formName = formulaire.titre ?? '';
                      formDescription = formulaire.description ?? '';
                    "
                  />
                  <PButton
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-danger mb-3"
                    @click="
                      formulaireSelected = formulaire;
                      deleteFormulaire();
                    "
                  ></PButton>
                </div>
              </div>
              <PDialog @keydown.enter="updateForm" v-model="showEditDialog" :visible="showEditDialog" style="min-width: 30%">
                <div class="dialog-content">
                  <h4 class="dialog-title">Modifier le formulaire</h4>
                  <div class="form-group flex mb-4" style="flex-direction: column">
                    <label for="form-name">Nom du formulaire</label>
                    <InputText type="text" id="form-name" v-model="formName" class="form-control" />
                  </div>
                  <div class="form-group flex mb-5" style="flex-direction: column">
                    <label for="form-description">Description du formulaire</label>
                    <PTextarea id="form-description" v-model="formDescription" class="form-control"></PTextarea>
                  </div>
                  <div class="form-actions">
                    <PButton class="mr-3" @click="updateForm">Enregistrer</PButton>
                    <PButton @click="showEditDialog = false">Annuler</PButton>
                  </div>
                </div>
              </PDialog>
            </template>
          </PCard>
        </template>
      </div>
    </template>
  </PCard>

  <PDialog v-model="showDialog" :visible="showDialog" :modal="true" class="custom-dialog" style="min-width: 30%">
    <div class="dialog-content">
      <h4 class="dialog-title">Questions:</h4>
      <div
        v-for="question in questions"
        :key="question.id"
        class="question-item"
        @mouseenter="getReponsesByQuestion(question)"
        @mouseleave="hideResponses"
      >
        <div class="question-header">
          <h3>{{ question.question }}</h3>
          <p class="question-type">Type: {{ question.type_question?.type }}</p>
        </div>
        <div class="question-body">
          <p v-if="question.formulaire" class="form-info">Formulaire: {{ question.formulaire.titre }}</p>
        </div>
        <div class="additional-info">
          <p v-if="question.formulaire?.creer_par">Créé par: {{ question.formulaire.creer_par?.nom }}</p>
        </div>
      </div>
      <PButton class="mt-3" @click="showDialog = false">Fermer</PButton>
    </div>
  </PDialog>
  <Toast />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useApiService } from '@/composables/GestionFormulaireService';
import FormulaireModel from '@/models/FormulaireModel';
import QuestionModel from '@/models/QuestionModel';
import ReponseModel from '@/models/ReponseModel';
import { useToast } from 'primevue/usetoast';
const apiService = useApiService();

const toast = useToast();

const formulaires = ref<FormulaireModel[]>([]);
const questions = ref<QuestionModel[]>([]);
const reponses = ref<ReponseModel[]>([]);

const showDialog = ref(false);
const showEditDialog = ref(false);
const reponseShow = ref(false);

const url = ref('');
const formName = ref('');
const formDescription = ref('');
const formulaireSelected = ref<FormulaireModel>();

onMounted(async () => {
  formulaires.value = await apiService.getAllFormulaires();
});

function updateForm() {
  if (formulaireSelected.value) {
    formulaireSelected.value.titre = formName.value;
    formulaireSelected.value.description = formDescription.value;
    apiService.createFormulaire(formulaireSelected.value);
    showEditDialog.value = false;
    showSuccess('Succès', 'Formulaire modifié avec succès');
  }
}

async function deleteFormulaire() {
  if (formulaireSelected.value) {
    try {
      // Supprimer toutes les réponses associées
      const reponses = await apiService.getReponsesByFormulaire(formulaireSelected.value.id ?? 0);
      for (const reponse of reponses) {
        await apiService.deleteReponseByID(reponse.id ?? 0);
      }

      // Supprimer toutes les questions associées
      const questions = await apiService.getQuestionsByFormulaire(formulaireSelected.value.id ?? 0);
      for (const question of questions) {
        await apiService.deleteQuestionByID(question.id ?? 0);
      }

      // Supprimer le formulaire
      await apiService.deleteFormulaireByID(formulaireSelected.value.id ?? 0);

      formulaires.value = await apiService.getAllFormulaires();

      showSuccess('Succès', 'Formulaire supprimé avec succès');
    } catch (error) {
      showError('Erreur', 'Erreur lors de la suppression du formulaire');
    }
  }
}

async function getUrlForm(id: string) {
  url.value = window.location.href;
  url.value = url.value.split('/').slice(0, -1).join('/');
  url.value = url.value + '/reponse/' + id;
}

const handleFormClick = async (formulaire: FormulaireModel) => {
  questions.value = await apiService.getQuestionsByFormulaire(formulaire.id ?? 0);
  showDialog.value = true;
};

async function getReponsesByQuestion(question: QuestionModel) {
  reponses.value = await apiService.getReponsesByQuestion(question.id ?? 0);
  reponseShow.value = true;
}

function hideResponses() {
  reponseShow.value = false;
}

const showSuccess = (title: string, detail: string) => {
  if (title === '') {
    title = 'Succès';
  }
  toast.add({ severity: 'success', summary: title, detail: detail, life: 3000 });
};

const showError = (title: string, detail: string) => {
  if (title === '') {
    title = 'Erreur';
  }
  toast.add({ severity: 'error', summary: title, detail: detail, life: 3000 });
};
</script>

<style scoped>
/* Variables */
:root {
  --main-color: #3498db;
  --secondary-color: #f39c12;
}

/* Grid styles */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

/* PCard styles */
.form-card {
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }
}

/* Typography */
.title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--main-color);
  margin-bottom: 1rem;
}

.title::after {
  content: '';
  display: block;
  width: 100%;
  height: 3px;
  background-color: var(--main-color);
}

.form-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
}

.form-creator {
  margin: 0;
  font-size: 1rem;
  color: #555;
}

.form-description {
  margin: 0;
  color: #666;
}

.form-url {
  color: var(--secondary-color);
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
}

/* Question-specific styles */
.question-item {
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.question-type {
  margin: 0;
  font-size: 1rem;
  color: #777;
}

/* Response-specific styles */
.reponses-list {
  list-style-type: none;
  padding: 0;
  margin: 10px 0;
}

.reponse-item {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Dialog styles */
.custom-dialog {
  font-family: 'Arial', sans-serif;
  border-radius: 10px;
  overflow: hidden;
}
.dialog-title {
  color: var(--main-color);
  margin-bottom: 15px;
  font-size: 18px;
}

.mt-3 {
  background-color: #edf1fc;
  color: var(--main-color);
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #e5e9eb;
  }
}
</style>
