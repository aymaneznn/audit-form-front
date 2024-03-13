<template>
  <FormCreator @formCreated="handleFormCreated" />
  <RepondreFormulaire v-if="isSubmited" :questionss="questions" @questionSubmited="handleQuestionSubmited" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

// import des composants
import FormCreator from '@/views/indep-comp/FormCreator.vue';
import RepondreFormulaire from '@/views/indep-comp/RepondreFormulaire.vue';

// import des models
import FormulaireModel from '@/models/FormulaireModel';
import QuestionModel from '@/models/QuestionModel';
import type ReponseModel from '@/models/ReponseModel';

// types de retour du composant FormCreator
type Formulaire = {
  formulaire: FormulaireModel;
  questions: QuestionModel[];
};

// variable formulaire qui contiendra le formulaire
const formulaire = ref<Formulaire>();

// variable questions qui contiendra les questions du formulaire
const questions = ref();

// variable reponses qui contiendra les reponses du formulaire
const reponses = ref();

// variable isSubmited qui contiendra l'état de soumission du formulaire
const isSubmited = ref(false);

// fonctions de gestion de l'enregistrement du formulaire
function handleFormCreated(json: Formulaire) {
  formulaire.value = json;
  questions.value = formulaire.value.questions;
  isSubmited.value = true;
}

// fonction de gestion de la soumission des questions
function handleQuestionSubmited(json: ReponseModel[]) {
  reponses.value = json;
}
</script>
