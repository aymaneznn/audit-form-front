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
          <div v-for="(item, i) in checkboxs[question.id_option ?? 0]" :key="i" class="checkbox-item">
            <Checkbox v-model="checkbox[question.id_option ?? 0]" inputId="p" :value="item.label" />
            <label for="p" class="ml-2">{{ item.label }}</label>
          </div>
        </div>
        <div v-else-if="question.type_question?.type === 'text'">
          <Textarea rows="5" cols="30" class="w-full border rounded p-2" v-model="text[0]" />
        </div>
        <template v-else-if="question.type_question?.type === 'dropdown'">
          <Dropdown
            v-model="dropdown[question.id_option ?? 0]"
            :options="dropdowns[question.id_option ?? 0]"
            optionLabel="name"
            placeholder="Sélectionnez un élément"
            class="w-full md:w-14rem"
          />
        </template>
        <div v-else-if="question.type_question?.type === 'inputNumber'">
          <InputNumber v-model="inputNumber[0]" inputId="minmaxfraction" :minFractionDigits="1" :maxFractionDigits="2" />
        </div>
        <div v-else-if="question.type_question?.type === 'inputText'">
          <InputText v-model="inputText[0]" />
        </div>
        <div v-else-if="question.type_question?.type === 'multiSelect'">
          <MultiSelect
            v-model="multiSelect[question.id_option ?? 0]"
            :options="multiSelects[question.id_option ?? 0]"
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
import type FormulaireModel from '@/models/FormulaireModel';
import type ReponseModel from '@/models/ReponseModel';
import type TypeQuestionModel from '@/models/TypeQuestionModel';
const apiService = useApiService();

const router = useRouter();
const id = ref();

type CheckboxType = { label: string; value: string };

const checkbox = ref<{ label: string; value: string }[]>([]);
const checkboxs = ref<CheckboxType[]>([]);
const text = ref<string[]>([]);
const dropdown = ref<{ name: string; code: string }[]>([]);
const dropdowns = ref<unknown[]>([]);

const multiSelect = ref<{ name: string; code: string }[]>([]);
const multiSelects = ref<unknown[]>([]);

const inputNumber = ref<number[]>([]);
const inputText = ref<string[]>([]);

type QuestionEdited = {
  id?: number;
  formulaire?: FormulaireModel;
  question?: string;
  type_question?: TypeQuestionModel;
  options_question?: string;
  reponses?: ReponseModel[];
  id_option?: number;
};

const questions = ref<QuestionEdited[]>([]);

const indexChecked = ref(0);
const indexDropdown = ref(0);
const indexMultiSelect = ref(0);

onMounted(async () => {
  const routeParams = router.currentRoute.value.params;
  id.value = routeParams.id;

  if (id.value === undefined) {
    id.value = 1;
  }

  questions.value = await apiService.getQuestionsByFormulaire(id.value);

  questions.value.forEach((question) => {
    if (question.type_question?.type === 'checkbox') {
      if (question.options_question) {
        checkboxs.value.push(JSON.parse(question.options_question));
        question.id_option = indexChecked.value;
        indexChecked.value++;
      }
    }
    if (question.type_question?.type === 'dropdown') {
      if (question.options_question) {
        dropdowns.value.push(JSON.parse(question.options_question));
        question.id_option = indexDropdown.value;
        indexDropdown.value++;
      }
    }
    if (question.type_question?.type === 'multiSelect') {
      if (question.options_question) {
        multiSelects.value.push(JSON.parse(question.options_question));
        question.id_option = indexMultiSelect.value;
        indexMultiSelect.value++;
      }
    }
  });
  console.log(checkboxs.value);
  console.log(dropdowns.value);
  console.log(multiSelects.value);
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
