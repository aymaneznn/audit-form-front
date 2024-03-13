<template>
  <div class="response-page" v-if="!formSubmited">
    <h4 class="dialog-title">Réponses au formulaire :</h4>
    <div
      v-for="question in questions"
      :key="question.id"
      class="question-item"
      :style="{ 'border-top': question.question === questionCordonnes ? '9px solid #8a2be2' : '' }"
    >
      <div>
        <div v-if="question.question === questionCordonnes" class="mb-3 p-text-secondary" style="color: rgb(216, 96, 96)">
          <p>Champ obligatoire</p>
        </div>
      </div>
      <div class="question-header">
        <h3>{{ question.question }} <span v-if="question.question === questionCordonnes" style="color: red"> *</span></h3>
      </div>
      <div class="question-body">
        <div v-if="question.type_question?.type === 'checkbox'">
          <div v-for="(item, i) in checkboxs[question.id_option ?? 0]" :key="i" class="checkbox-item mb-2">
            <Checkbox v-model="checkbox[question.id_option ?? 0]" inputId="p" :value="returnString(item)" />
            <label for="p" class="ml-2">{{ returnString(item) }}</label>
          </div>
        </div>
        <div v-else-if="question.type_question?.type === 'text'">
          <Textarea rows="5" cols="30" class="w-full border rounded p-2" v-model="text[question.id_option ?? 0]" />
        </div>
        <template v-else-if="question.type_question?.type === 'dropdown'">
          <Dropdown
            v-model="dropdown[question.id_option ?? 0]"
            :options="dropdowns[question.id_option ?? 0] as any[]"
            optionLabel="name"
            placeholder="Sélectionnez un élément"
            class="w-full md:w-14rem"
          />
        </template>
        <div v-else-if="question.type_question?.type === 'inputNumber'">
          <InputNumber
            v-model="inputNumber[question.id_option ?? 0]"
            inputId="minmaxfraction"
            :minFractionDigits="1"
            :maxFractionDigits="2"
          />
        </div>
        <div v-else-if="question.type_question?.type === 'inputText'">
          <InputText v-model="inputText[question.id_option ?? 0]" />
        </div>
        <div v-else-if="question.type_question?.type === 'multiSelect'">
          <MultiSelect
            v-model="multiSelect[question.id_option ?? 0]"
            :options="multiSelects[question.id_option ?? 0] as any[]"
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
  <div class="p-5" v-if="formSubmited">
    <div class="card">
      <Toast />
      <p style="color: green; font-weight: bold">Réponses envoyées avec succès</p>
      <h4 class="dialog-title">Récapitulatif de la réponse au formulaire :</h4>
      <Panel v-for="question in questions" :key="question.id" class="response-item" toggleable>
        <template #header>
          <div class="flex align-items-center gap-2">
            <span class="font-bold">{{ question.question }}</span>
          </div>
        </template>
        <p class="m-0">
          {{ getAnswer(question) }}
        </p>
      </Panel>
    </div>
  </div>

  <Toast />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';
import MultiSelect from 'primevue/multiselect';
import Panel from 'primevue/panel';

import type FormulaireModel from '@/models/FormulaireModel';
import type ReponseModel from '@/models/ReponseModel';
import type TypeQuestionModel from '@/models/TypeQuestionModel';

const router = useRouter();
const id = ref();

const emit = defineEmits(['questionSubmited']);

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
const formSubmited = ref(false);

const indexChecked = ref(0);
const indexDropdown = ref(0);
const indexMultiSelect = ref(0);
const indexInputNumber = ref(0);
const indexInputText = ref(0);
const indexText = ref(0);

const idGroupResponse = ref('');

const questionCordonnes = ref('Vos coordonnées : ');

const props = defineProps({
  questionss: {
    type: Array<QuestionEdited>,
    required: true,
  },
});

onMounted(async () => {
  const routeParams = router.currentRoute.value.params;
  id.value = routeParams.id;

  if (id.value === undefined) {
    id.value = 1;
  }

  idGroupResponse.value = generateRandomIdWithLength(10);

  questions.value = props.questionss;

  questions.value.sort((a, b) => {
    if (a.question === questionCordonnes.value) {
      return -1;
    } else if (b.question === questionCordonnes.value) {
      return 1;
    } else {
      return 0;
    }
  });

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
    if (question.type_question?.type === 'inputNumber') {
      question.id_option = indexInputNumber.value;
      indexInputNumber.value++;
    }
    if (question.type_question?.type === 'inputText') {
      question.id_option = indexInputText.value;
      indexInputText.value++;
    }
    if (question.type_question?.type === 'text') {
      question.id_option = indexText.value;
      indexText.value++;
    }
  });
});

const returnString = (i: unknown) => {
  return (i as { label: string }).label;
};

enum QuestionType {
  Checkbox = 1,
  Text = 2,
  Dropdown = 3,
  InputNumber = 4,
  InputText = 5,
  MultiSelect = 6,
  SansType = 0,
}

function resetValues() {
  checkbox.value = [];
  text.value = [];
  dropdown.value = [];
  multiSelect.value = [];
  inputNumber.value = [];
  inputText.value = [];
}

function generateRandomIdWithLength(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const submitResponse = () => {
  try {
    // Check if the coordinates question is present and filled
    const coordinatesQuestion = questions.value.find((question) => question.question === questionCordonnes.value);
    const coordinatesResp = coordinatesQuestion ? (inputText.value as string[])[coordinatesQuestion.id_option ?? 0] : null;
    const isCoordinatesFilled = coordinatesResp && coordinatesResp.trim() !== '';

    const reponses: ReponseModel[] = [];

    if (coordinatesQuestion && !isCoordinatesFilled) {
      showError('Erreur', 'Veuillez remplir le champ obligatoire');
    } else {
      let resp: unknown;
      let id_type_question: number;
      questions.value.forEach((question) => {
        if (question.type_question?.type === 'checkbox') {
          resp = (checkbox.value as { label: string; value: string }[])[question.id_option ?? 0];
          id_type_question = QuestionType.Checkbox;
        }
        if (question.type_question?.type === 'dropdown') {
          resp = (dropdown.value as { [key: number]: { name: string; code: string } })[question.id_option ?? 0];
          id_type_question = QuestionType.Dropdown;
        }
        if (question.type_question?.type === 'multiSelect') {
          resp = multiSelect.value[question.id_option ?? 0];
          id_type_question = QuestionType.MultiSelect;
        }
        if (question.type_question?.type === 'inputNumber') {
          resp = inputNumber.value[question.id_option ?? 0];
          id_type_question = QuestionType.InputNumber;
        }
        if (question.type_question?.type === 'inputText') {
          resp = (inputText.value as string[])[question.id_option ?? 0];
          id_type_question = QuestionType.InputText;
        }
        if (question.type_question?.type === 'text') {
          resp = (text.value as string[])[question.id_option ?? 0];
          id_type_question = QuestionType.Text;
        }

        const json_resp = { data: resp };

        const reponse: ReponseModel = {
          id: 0,
          formulaire: question.formulaire,
          question: question,
          typeReponse: { id: id_type_question, type: question.type_question?.type } as TypeQuestionModel,
          utilisateur: question.formulaire?.creer_par,
          poster_le: new Date(),
          donnees_reponse: json_resp,
          id_group_reponse: idGroupResponse.value,
        };
        reponses.push(reponse);
      });
      showSuccess('', 'Réponse enregistrée avec succès');
      emit('questionSubmited', reponses);
      formSubmited.value = true;
      console.table(reponses);
    }
  } catch (error) {
    console.error(error);
    showError('Erreur', "Erreur lors de l'enregistrement de la réponse");
  }
};

function getAnswer(question: QuestionEdited) {
  if (question.type_question?.type === 'checkbox') {
    return (checkbox.value as { label: string; value: string }[])[question.id_option ?? 0];
  }
  if (question.type_question?.type === 'dropdown') {
    return (dropdown.value as { [key: number]: { name: string; code: string } })[question.id_option ?? 0]?.name ?? '';
  }
  if (question.type_question?.type === 'multiSelect') {
    const res: string[] = [];

    (multiSelect.value[question.id_option ?? 0] as unknown as { name: string; code: string }[])?.forEach((element) => {
      res.push(element.name);
    });
    return res ?? '';
  }
  if (question.type_question?.type === 'inputNumber') {
    return inputNumber.value[question.id_option ?? 0] ?? '';
  }
  if (question.type_question?.type === 'inputText') {
    return (inputText.value as string[])[question.id_option ?? 0] ?? '';
  }
  if (question.type_question?.type === 'text') {
    return (text.value as string[])[question.id_option ?? 0] ?? '';
  }

  resetValues();
}

import { useToast } from 'primevue/usetoast';

const toast = useToast();

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

/* Style for success message */
.success-message {
  color: #4caf50;
}

/* Style for the response summary container */
.response-summary {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 20px;
  border: 1px solid #ddd;
  padding: 3%;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Style for the question and answer items */
.response-item {
  list-style-type: none;
  margin-bottom: 10px;
}

/* Style for the summary list */
.summary-list {
  padding: 0;
}

/* Style for the question text */
.question {
  font-weight: bold;
  margin-right: 5px;
}

/* Style for the answer text */
.answer {
  color: #333;
}

.form-header {
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 1rem;
  width: 80%;
  border-top: 9px solid #8a2be2;
  cursor: pointer;
}

.form-header,
.other-header {
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 1rem;
  width: 80%;
  border-top: 9px solid #8a2be2;
  cursor: pointer;
  transition: border-left 0.1s ease-in-out;
}
</style>
