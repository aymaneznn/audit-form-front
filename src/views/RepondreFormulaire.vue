<template>
  <div class="response-page">
    <PButton class="nav-button" @click="goBack" style="background-color: #007bff; color: #fff; margin-right: 10px">
      <i class="pi pi-arrow-left mr-3"></i> Retour
    </PButton>
    <h4 class="dialog-title">Réponses au formulaire :</h4>
    <div v-for="question in questions" :key="question.id" class="question-item">
      <div class="question-header">
        <h3>{{ question.question }}</h3>
        <p>Type : {{ question.type_question?.type }}</p>
      </div>
      <div class="question-body">
        <div v-if="question.type_question?.type === 'checkbox'">
          <Checkbox
            v-model="checkbox"
            :inputId="`item${question.id}`"
            :name="JSON.parse(question.options_question as any)?.value ?? ''"
            :value="JSON.parse(question.options_question as any)?.value ?? ''"
          />
          <label :for="`item${question.id}`" class="ml-2">{{ JSON.parse(question.options_question as any)?.label ?? '' }}</label>
        </div>
        <div v-else-if="question.type_question?.type === 'text'">
          <Textarea rows="5" cols="30" class="w-full border rounded p-2" v-model="text" />
        </div>
        <template v-else-if="question.type_question?.type === 'dropdown'">
          <Dropdown
            v-model="dropdown"
            :options="JSON.parse(question.options_question as any)"
            optionLabel="name"
            placeholder="Sélectionnez un élément"
            class="w-full md:w-14rem"
          />
        </template>
        <div v-else-if="question.type_question?.type === 'inputNumber'">
          <InputNumber v-model="inputNumber" inputId="minmaxfraction" :minFractionDigits="1" :maxFractionDigits="2" />
        </div>
        <div v-else-if="question.type_question?.type === 'inputText'">
          <InputText v-model="inputText" />
        </div>
        <div v-else-if="question.type_question?.type === 'multiSelect'">
          <MultiSelect
            v-model="dropdown"
            :options="JSON.parse(question.options_question as any)"
            optionLabel="name"
            placeholder="Selectionnez un élément"
            :maxSelectedLabels="3"
            class="w-full md:w-20rem"
          />
        </div>
      </div>
    </div>

    <PButton class="response-button" @click="submitResponse" style="background-color: #28a745; color: #fff; border: none">Répondre</PButton>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';
import MultiSelect from 'primevue/multiselect';

import { useApiService } from '@/composables/GestionFormulaireService';
import QuestionModel from '@/models/QuestionModel';
const apiService = useApiService();

const router = useRouter();
const id = ref();

const checkbox = ref<{ label: string; value: string }[]>([]);
const text = ref<string>('');
const dropdown = ref<{ name: string; code: string }[]>([]);
const inputNumber = ref<number>(0);
const inputText = ref<string>('');

const questions = ref<QuestionModel[]>([]);

onMounted(async () => {
  const routeParams = router.currentRoute.value.params;
  id.value = routeParams.id;

  if (id.value === undefined) {
    id.value = 1;
  }

  questions.value = await apiService.getQuestionsByFormulaire(id.value);
});

const goBack = () => {
  // Utilisez le routeur pour revenir à la page précédente
  router.go(-1);
};

const submitResponse = () => {
  // Logique pour soumettre les réponses
};
</script>

<style scoped>
.response-page {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.dialog-title {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.question-item {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 15px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.question-header h3 {
  color: #007bff;
  font-size: 1.2rem;
}

.question-body {
  margin-bottom: 10px;
}

.form-info {
  color: #28a745;
}

.additional-info p {
  color: #6c757d;
}

.response-container {
  margin-top: 10px;
}

.response-button {
  margin-top: 20px;
}
</style>
