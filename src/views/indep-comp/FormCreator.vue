<template>
  <div style="margin-left: 9.3%">
    <SplitButton class="p-button-small p-button-info" label="Modele de formulaire" @click="model" :model="itemsModels" />
  </div>
  <div class="form-container">
    <!-- En-tête du formulaire -->
    <PCard class="form-header" :class="{ active: activeHeader === 'form' }" @click="activateHeader('form')">
      <template #title>
        <span class="p-float-label">
          <InputText v-model="formName" class="form-title" @click="formName = ''" />
          <label>Titre du formulaire</label>
        </span>
      </template>
      <template #content>
        <span class="p-float-label">
          <PTextarea v-model="formDescription" rows="5" cols="30" class="w-full border rounded p-2" @click="formDescription = ''" />
          <label>Description du formulaire</label>
        </span>
      </template>
    </PCard>

    <!-- Visualiseur de questions -->
    <div
      v-if="questions.length > 0"
      class="form-body"
      :class="{ active: activeHeader === 'other-header' }"
      @click="activateHeader('other-header')"
    >
      <!-- Visualiseur de questions créées -->
      <div class="created-questions" @dragover.prevent @dragenter.prevent>
        <div
          v-for="(q, index) in questions"
          :key="index"
          style="border: 0.5px solid rgba(3, 3, 3, 0.123); border-radius: 6px"
          class="question-item p-4 rounded-md shadow-md bg-white mb-4"
          draggable="true"
        >
          <div class="flex items-center justify-content-end">
            <div class="icon-container bg-gray-200 rounded-full p-2 mr-2">
              <i @click="editQuestion(index)" class="pi pi-pencil cursor-pointer"></i>
            </div>
            <ConfirmPopup></ConfirmPopup>
            <div class="icon-container bg-gray-200 rounded-full p-2">
              <i @click="confirmerSuppression($event, index)" class="pi pi-trash cursor-pointer"></i>
            </div>
          </div>
          <p class="text-lg font-semibold mb-2"><strong>Question:</strong> {{ q.question }}</p>
          <template v-if="q.type === 'checkbox'">
            <div v-for="(option, optionIndex) in q.options" :key="optionIndex" class="flex items-center mt-2">
              <Checkbox :disabled="true" class="mr-2" />
              <p class="text-base">{{ option.label }}</p>
            </div>
          </template>
          <template v-if="q.type === 'text'">
            <PTextarea rows="5" cols="30" class="w-full border rounded p-2" />
          </template>
          <template v-if="q.type === 'dropdown'">
            <Dropdown :options="q.options" optionLabel="name" placeholder="Sélectionnez un élément" class="w-full md:w-14rem" />
          </template>
          <template v-if="q.type === 'inputNumber'">
            <InputNumber inputId="minmaxfraction" :minFractionDigits="1" :maxFractionDigits="2" class="w-full border rounded p-2" />
          </template>
          <template v-if="q.type === 'inputText'">
            <InputText class="w-full border rounded p-2" />
          </template>
          <template v-if="q.type === 'multiSelect'">
            <MultiSelect
              :options="q.options"
              optionLabel="name"
              placeholder="Sélectionnez un élément"
              :maxSelectedLabels="3"
              class="w-full md:w-20rem"
            ></MultiSelect>
          </template>
        </div>
      </div>
    </div>

    <!-- Corps du formulaire -->
    <PCard class="form-body" :class="{ active: activeHeader === 'other' }" @click="activateHeader('other')">
      <template #title>
        <div class="question-title"></div>
        <span class="p-float-label">
          <InputText v-model="question" class="form-title mr-3" @click="question = ''" />
          <label>Question</label>
        </span>
      </template>
      <template #content>
        <div class="relative">
          <Dropdown
            class="mb-3"
            v-model="selectedType"
            :options="types"
            optionLabel="label"
            optionValue="value"
            placeholder="Sélectionner le type de question"
            @change="reset()"
          >
            <!-- Utilisez des balises i directement dans p-dropdown-item -->
            <template v-if="selectedType"> <i :class="selectedType.icon" style="margin-right: 5px"></i>{{ selectedType.label }} </template>
            <!-- Utilisez des balises i directement dans p-dropdown-item -->
            <template #option="{ option }"> <i :class="option.icon" style="margin-right: 5px"></i>{{ option.label }} </template>
          </Dropdown>

          <!-- Checkbox -->
          <div v-if="selectedType === 'checkbox'" class="card">
            <div class="checkbox-container">
              <div v-for="(item, index) in checkbox" :key="index" class="checkbox-item">
                <Checkbox v-model="checkboxModel" :inputId="`item${index}`" :name="item.value" :value="item.value" />
                <label :for="`ingredient${index}`" class="ml-2">{{ item.label }}</label>
              </div>
            </div>

            <div class="button-container">
              <PButton label="Ajouter Checkbox" @click="dialogVisibleAddCheckbox = true" class="p-button-small p-button-info" />
            </div>
          </div>

          <!-- Text -->
          <div v-if="selectedType === 'text'" class="card">
            <div class="text-container">
              <div class="text-item">
                <PTextarea v-model="text" rows="5" cols="30" class="w-full border rounded p-2" />
              </div>
            </div>
          </div>

          <!-- Dropdown -->
          <div v-if="selectedType === 'dropdown'" class="card">
            <div class="dropdown-container">
              <div class="text-item">
                <Dropdown
                  v-model="dropdown"
                  :options="optionsDropdown"
                  optionLabel="name"
                  placeholder="Selectionnez un élément"
                  class="w-full md:w-14rem"
                />
              </div>
              <div class="button-container">
                <PButton label="Ajouter options" @click="dialogVisibleAddOptionDropDown = true" class="p-button-small p-button-info" />
              </div>
            </div>
          </div>

          <!-- InputNumber -->
          <div v-if="selectedType === 'inputNumber'" class="card">
            <div class="inputNumber-container">
              <div class="text-item">
                <InputNumber v-model="inputNumber" inputId="minmaxfraction" :minFractionDigits="1" :maxFractionDigits="2" />
              </div>
            </div>
          </div>

          <!-- InputText -->
          <div v-if="selectedType === 'inputText'" class="card">
            <div class="inputText-container">
              <div class="inputText-item">
                <InputText v-model="inputText" />
              </div>
            </div>
          </div>

          <!-- Multiselect -->
          <div v-if="selectedType === 'multiSelect'" class="card">
            <div class="multiSelect-container">
              <div class="multiSelect-item">
                <MultiSelect
                  v-model="dropdown"
                  :options="optionsDropdown"
                  optionLabel="name"
                  placeholder="Selectionnez un élément"
                  :maxSelectedLabels="3"
                  class="w-full md:w-20rem"
                />
              </div>
              <div class="button-container">
                <PButton label="Ajouter options" @click="dialogVisibleAddOptionDropDown = true" class="p-button-small p-button-info" />
              </div>
            </div>
          </div>

          <!-- Icônes d'outils pour modifier la question -->
          <div class="static" style="min-width: 300px; min-height: 50px">
            <div class="static md:absolute bottom-0 right-0" style="min-width: 120px; min-height: 10px">
              <div class="question-tools">
                <PButton icon="pi pi-trash" class="p-button-rounded p-button-danger mr-3" @click="deleteQuestion"></PButton>
                <PButton icon="pi pi-plus" text raised rounded aria-label="add" @click="addQuestion(selectedType)" />
              </div>
            </div>
          </div>

          <!-- Dialog checkbox -->
          <PDialog
            v-model:visible="dialogVisibleAddCheckbox"
            :showHeader="true"
            :baseZIndex="1000"
            class="custom-dialog"
            @keydown.enter="addCheckbox"
          >
            <div class="dialog-content">
              <h4 class="dialog-title">Entrez le nom de la checkbox :</h4>
              <InputText v-model="nomCheckbox" id="name" class="input-text" />

              <div class="dialog-buttons">
                <PButton label="Confirmer" @click="addCheckbox" class="p-button-success" />
                <PButton label="Annuler" @click="dialogVisibleAddCheckbox = false" class="p-button-secondary" />
              </div>
            </div>
          </PDialog>

          <!-- Dialog dropdown -->
          <PDialog
            v-model:visible="dialogVisibleAddOptionDropDown"
            :showHeader="true"
            :baseZIndex="1000"
            class="custom-dialog"
            @keydown.enter="addOptionDropDown"
          >
            <div class="dialog-content">
              <h4 class="dialog-title">Entrez le nom de l'option :</h4>
              <InputText v-model="nomOptionDropDown" id="name" class="input-text" />

              <div class="dialog-buttons">
                <PButton label="Confirmer" @click="addOptionDropDown" class="p-button-success" />
                <PButton label="Annuler" @click="dialogVisibleAddOptionDropDown = false" class="p-button-secondary" />
              </div>
            </div>
          </PDialog>

          <!-- Dialog edit checkbox -->
          <PDialog v-model:visible="dialogVisibleEditCheckBox" :showHeader="true" :baseZIndex="1000" class="custom-dialog">
            <div class="dialog-content">
              <!-- Checkbox -->
              <div v-if="indexToEdit !== undefined">
                <h4 class="dialog-title">Modifier la question</h4>
                <div class="question-container">
                  <div class="text-item">
                    <PTextarea
                      v-model="editedQuestion"
                      @change="confirmTitleEdit"
                      autoResize
                      rows="5"
                      cols="1"
                      class="w-full border rounded p-2 max-h-3rem w-24rem"
                    />
                  </div>
                </div>
                <div class="options-container">
                  <h4 class="dialog-title mt-4">
                    Modifier les options
                    <i
                      v-if="
                        indexToEdit !== undefined &&
                        (questions[indexToEdit]?.type === 'dropdown' || questions[indexToEdit]?.type === 'multiSelect')
                      "
                      @click="dialogVisibleAddOptionDropDown = true"
                      class="pi pi-plus-circle cursor-pointer"
                    ></i>
                    <i v-else @click="dialogVisibleAddCheckbox = true" class="pi pi-plus-circle cursor-pointer"></i>
                  </h4>

                  <div v-for="(item, index) in questions[indexToEdit]?.options" :key="index" class="option-item">
                    <InputText v-if="questions[indexToEdit]?.type === 'checkbox'" v-model="item.label" placeholder="Nouvelle option" />
                    <InputText
                      v-if="questions[indexToEdit]?.type === 'dropdown' || questions[indexToEdit]?.type === 'multiSelect'"
                      v-model="item.name"
                      placeholder="Nouvelle option"
                    />
                    <i
                      v-if="indexToEdit !== undefined"
                      @click="deleteOptionAt(index)"
                      class="rounded-full p-2 pi pi-trash cursor-pointer"
                    ></i>
                  </div>
                </div>
                <div class="dialog-buttons">
                  <PButton label="Retour" @click="dialogVisibleEditCheckBox = false" />
                </div>
              </div>
            </div>
          </PDialog>

          <!-- Dialog edit sans options -->
          <PDialog v-model:visible="dialogVisibleEditNoOption" :showHeader="true" :baseZIndex="1000" class="custom-dialog">
            <div class="dialog-content" v-if="indexToEdit !== undefined">
              <h4 class="dialog-title">Modifier la question</h4>
              <div class="question-container">
                <div class="text-item">
                  <PTextarea
                    v-model="editedQuestion"
                    @change="confirmTitleEdit"
                    autoResize
                    rows="5"
                    cols="1"
                    class="w-full border rounded p-2 max-h-3rem w-24rem"
                  />
                </div>
              </div>
              <div class="dialog-buttons">
                <PButton label="Retour" @click="dialogVisibleEditNoOption = false" />
              </div>
            </div>
          </PDialog>
        </div>
      </template>
    </PCard>

    <div class="flex">
      <div class="button-container">
        <PButton
          label="Publiez le formulaire et générer un lien"
          @click="publieForm()"
          class="p-button-small p-button-info question-creator"
        />
      </div>
    </div>
  </div>
  <Toast />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import FormulaireModel from '@/models/FormulaireModel';
import SplitButton from 'primevue/splitbutton';

const emit = defineEmits(['formCreated']);

const toast = useToast();

const questionCordonnes = ref('Vos coordonnées : ');

const editingTitle = ref(false);
const editedQuestion = ref<string | undefined>('');

const formName = ref<string>('Formulaire sans titre');
const formDescription = ref<string>('Formulaire sans description');

const activeHeader = ref<string | null>(null);
const question = ref<string>('Question');
const checkboxModel = ref<string>('');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const questions = ref<{ question: string; type: string; options: any }[]>([]);
const selectedType = ref();
const nomCheckbox = ref();
const nomOptionDropDown = ref();

const dialogVisibleAddCheckbox = ref();
const dialogVisibleAddOptionDropDown = ref();
const dialogVisibleEditCheckBox = ref();
const dialogVisibleEditNoOption = ref();

const checkbox = ref<{ label: string; value: string }[]>([]);
const text = ref<string>('');
const dropdown = ref<{ name: string; code: string }>();
const optionsDropdown = ref<{ name: string; code: string }[]>([]);
const inputNumber = ref<number>(0);
const inputText = ref<string>('');
const indexToEdit = ref<number>();

const confirm = useConfirm();

const createdFormJson = ref();

onMounted(async () => {
  questions.value = [
    {
      question: questionCordonnes.value,
      type: 'inputText',
      options: null,
    },
  ];
});

const confirmTitleEdit = () => {
  if (indexToEdit.value !== undefined && editedQuestion.value !== undefined) {
    questions.value[indexToEdit.value].question = editedQuestion.value;
  }
  editingTitle.value = false;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const confirmerSuppression = (event: { currentTarget: any }, index: number) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Voulez-vous supprimer cette question ?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Annuler',
    acceptLabel: 'Supprimer',
    accept: () => {
      deleteQuestionAt(index);
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejeté', detail: 'Vous avez rejeté', life: 3000 });
    },
  });
};

const types = ref([
  { label: 'Checkbox', value: 'checkbox', icon: 'pi pi-check-square' },
  { label: 'Text', value: 'text', icon: 'pi pi-pencil' },
  { label: 'Dropdown', value: 'dropdown', icon: 'pi pi-caret-down' },
  { label: 'Input Number', value: 'inputNumber', icon: 'pi pi-sort-numeric-up' },
  { label: 'Input Text', value: 'inputText', icon: 'pi pi-align-left' },
  { label: 'Multi Select', value: 'multiSelect', icon: 'pi pi-bars' },
]);

const itemsModels = [
  {
    label: 'Avis clients',
    command: () => {
      avisClientModel();
    },
  },
  {
    label: 'Demande de devis',
    command: () => {
      demandeDevisModel();
    },
  },
];

function reset() {
  checkbox.value = [];
  text.value = '';
  optionsDropdown.value = [];
  inputNumber.value = 0;
  inputText.value = '';
}

function addCheckbox() {
  if (!dialogVisibleEditCheckBox.value) {
    checkbox.value.push({
      label: nomCheckbox.value,
      value: nomCheckbox.value,
    });
  } else {
    if (indexToEdit.value !== undefined) {
      questions.value[indexToEdit.value]?.options.push({
        label: nomCheckbox.value,
        value: nomCheckbox.value,
      });
    }
  }
  nomCheckbox.value = '';
  dialogVisibleAddCheckbox.value = false;
  showSuccess('', 'Option ajouté');
}

function addOptionDropDown() {
  if (!dialogVisibleEditCheckBox.value) {
    optionsDropdown.value.push({
      name: nomOptionDropDown.value,
      code: nomOptionDropDown.value,
    });
  } else {
    if (indexToEdit.value !== undefined) {
      questions.value[indexToEdit.value]?.options.push({
        name: nomOptionDropDown.value,
        code: nomOptionDropDown.value,
      });
    }
  }
  nomOptionDropDown.value = '';
  dialogVisibleAddOptionDropDown.value = false;
  showSuccess('', 'Option ajouté');
}

function deleteQuestion() {
  if (!question.value && (!selectedType.value || selectedType.value === '')) {
    showInfo('', 'Aucune question à supprimer');
  } else {
    question.value = '';
    selectedType.value = '';
    showInfo('', 'Question supprimée');
  }
}

function deleteQuestionAt(index: number) {
  if (index >= 0 && index < questions.value.length) {
    questions.value.splice(index, 1);
    showSuccess('', 'Question supprimé');
  }
}

function deleteOptionAt(index: number) {
  const options = questions.value[indexToEdit.value]?.options;

  if (index >= 0 && index < questions.value.length && indexToEdit.value !== undefined && options) {
    options.splice(index, 1);
    showSuccess('', 'Option supprimé');
  }
}

const activateHeader = (headerName: string) => {
  activeHeader.value = headerName;
};

const editQuestion = (index: number) => {
  indexToEdit.value = index;
  const questionType = questions.value[index]?.type;

  if (questionType === 'checkbox' || questionType === 'dropdown' || questionType === 'multiSelect') {
    dialogVisibleEditCheckBox.value = true;
  } else if (questionType === 'text' || questionType === 'inputNumber' || questionType === 'inputText') {
    dialogVisibleEditNoOption.value = true;
  }

  editedQuestion.value = questions.value[index]?.question;
};

function addQuestion(type: string) {
  if (!question.value) {
    showWarn('', 'Entrez une question');
    return;
  }

  let options: string | { label: string; value: string }[] = '';
  switch (type) {
    case 'checkbox':
      options = checkbox.value;
      checkbox.value = [];
      break;
    case 'text':
      options = '';
      text.value = '';
      break;
    case 'dropdown':
    case 'multiSelect':
      options = optionsDropdown.value;
      optionsDropdown.value = [];
      break;
    case 'inputNumber':
      options = '';
      inputNumber.value = 0;
      break;
    case 'inputText':
      options = '';
      inputText.value = '';
      break;
  }

  questions.value.push({ question: question.value, type, options });
  question.value = '';
  selectedType.value = '';

  showSuccess('', 'Question ajouté');

  // Scroll to the bottom of the page
  setTimeout(() => {
    const element = document.querySelector('.question-creator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, 0);
}

const showToast = (severity: string, title: string, detail: string) => {
  if (title === '') {
    switch (severity) {
      case 'success':
        title = 'Succès';
        break;
      case 'info':
        title = 'Information';
        break;
      case 'warn':
        title = 'Attention';
        break;
      case 'error':
        title = 'Erreur';
        break;
    }
  }
  toast.add({ severity, summary: title, detail, life: 3000 });
};

const showSuccess = (title: string, detail: string) => {
  showToast('success', title, detail);
};

const showInfo = (title: string, detail: string) => {
  showToast('info', title, detail);
};

const showWarn = (title: string, detail: string) => {
  showToast('warn', title, detail);
};

const showError = (title: string, detail: string) => {
  showToast('error', title, detail);
};

function generateRandomIdWithLength(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function publieForm() {
  const localId = generateRandomIdWithLength(50);
  if (formName.value === '' || formDescription.value === '' || questions.value.length === 0) {
    showError('', 'Impossible de créer le formulaire');
    if (formName.value === '') {
      showWarn('', 'Le titre du formulaire est vide');
    } else if (formDescription.value === '') {
      showWarn('', 'La description du formulaire est vide');
    } else if (questions.value.length === 0) {
      showWarn('', 'Formulaire sans questions');
    }
    return;
  }

  const formulaire: FormulaireModel = {
    id: localId,
    titre: formName.value,
    description: formDescription.value,
    creer_par: {
      id: 1,
      nom: 'Zen',
      prenom: 'Aymane',
      password: 'azerty',
    },
    creerLe: new Date(),
    modifieLe: new Date(),
  };

  showSuccess('', 'Formulaire créé');
  // Emit the event with the created form as JSON
  const formData = {
    formulaire: formulaire,
    questions: questions.value,
  };

  createdFormJson.value = JSON.stringify(formData);
  emit('formCreated', createdFormJson.value);

  formName.value = 'Formulaire sans titre';
  formDescription.value = 'Formulaire sans description';
  questions.value = [];
}

function model() {
  questions.value = [
    {
      question: questionCordonnes.value,
      type: 'inputText',
      options: null,
    },
    {
      question: 'Quelle est votre couleur préférée ?',
      type: 'dropdown',
      options: [
        { name: 'Bleu', code: 'bleu' },
        { name: 'Rouge', code: 'rouge' },
        { name: 'Vert', code: 'vert' },
        { name: 'Jaune', code: 'jaune' },
      ],
    },
    {
      question: 'Quel est votre animal préféré ?',
      type: 'checkbox',
      options: [
        { label: 'Chien', value: 'chien' },
        { label: 'Chat', value: 'chat' },
        { label: 'Oiseau', value: 'oiseau' },
        { label: 'Lion', value: 'lion' },
      ],
    },
    {
      question: 'Quel est votre plat préféré ?',
      type: 'multiSelect',
      options: [
        { name: 'Pizza', code: 'pizza' },
        { name: 'Pâtes', code: 'pates' },
        { name: 'Sushi', code: 'sushi' },
        { name: 'Burger', code: 'burger' },
      ],
    },
    {
      question: 'Donnez une courte description de vous-même.',
      type: 'text',
      options: '',
    },
    {
      question: 'Quel est votre nombre préféré ?',
      type: 'inputNumber',
      options: '',
    },
  ];
  showSuccess('', 'Modele chargé');
  // Scroll to the bottom of the page
  setTimeout(() => {
    const element = document.querySelector('.question-creator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, 0);
}

function avisClientModel() {
  questions.value = [
    {
      question: questionCordonnes.value,
      type: 'inputText',
      options: null,
    },
    {
      question: 'Quelle est votre satisfaction globale concernant nos services ?',
      type: 'dropdown',
      options: [
        { name: 'Très satisfait', code: 'tres_satisfait' },
        { name: 'Satisfait', code: 'satisfait' },
        { name: 'Neutre', code: 'neutre' },
        { name: 'Insatisfait', code: 'insatisfait' },
        { name: 'Très insatisfait', code: 'tres_insatisfait' },
      ],
    },
    {
      question: 'Quels aspects de nos services avez-vous appréciés ?',
      type: 'checkbox',
      options: [
        { label: 'Qualité des produits', value: 'qualite_produits' },
        { label: 'Service client', value: 'service_client' },
        { label: 'Prix compétitifs', value: 'prix_competitifs' },
        { label: 'Livraison rapide', value: 'livraison_rapide' },
      ],
    },
    {
      question: 'Quels aspects de nos services pourrions-nous améliorer ?',
      type: 'text',
      options: '',
    },
  ];
  showSuccess('', 'Modèle "Avis client" chargé');
  // Scroll to the bottom of the page
  setTimeout(() => {
    const element = document.querySelector('.question-creator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, 0);
}

function demandeDevisModel() {
  questions.value = [
    {
      question: questionCordonnes.value,
      type: 'inputText',
      options: null,
    },
    {
      question: 'Quel est votre nom complet ?',
      type: 'inputText',
      options: null,
    },
    {
      question: 'Quelle est votre adresse e-mail ?',
      type: 'inputText',
      options: null,
    },
    {
      question: 'Quel est votre numéro de téléphone ?',
      type: 'inputText',
      options: null,
    },
    {
      question: 'Quel est le type de service que vous recherchez ?',
      type: 'dropdown',
      options: [
        { name: 'Développement web', code: 'developpement_web' },
        { name: 'Design graphique', code: 'design_graphique' },
        { name: 'Marketing digital', code: 'marketing_digital' },
        { name: 'Consulting', code: 'consulting' },
      ],
    },
    {
      question: 'Décrivez brièvement votre projet ou vos besoins.',
      type: 'text',
      options: '',
    },
  ];
  showSuccess('', 'Modèle "Demande de devis" chargé');
  // Scroll to the bottom of the page
  setTimeout(() => {
    const element = document.querySelector('.question-creator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, 0);
}
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
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

.form-header.active,
.other-header.active {
  border-left: 6px solid #4285f4;
}

.form-title {
  font-size: 24px;
  margin: 0;
  font-weight: bold;
}

.form-body {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  padding: 1rem;
  width: 80%;
}

.custom-dialog {
  width: 300px;
  border-radius: 8px;
}

.dialog-content {
  padding: 16px;
}

.dialog-title {
  font-size: 18px;
  color: #333;
}

.input-text {
  width: 100%;
}

.dialog-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.p-button-success {
  background-color: #28a745;
  color: #fff;
}

.p-button-secondary {
  background-color: #dc3545;
  color: #fff;
}

.custom-button-container {
  margin-top: 10px;
}

.p-button-small {
  font-size: 12px;
  padding: 8px 12px;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 100px;
}

.card {
  display: flex;
  flex-direction: column;
}

.checkbox-container {
  display: flex;
  flex-wrap: wrap;
}

.checkbox-item {
  margin-right: 20px;
}

.button-container {
  margin-top: 10px;
  align-self: flex-end;
}
</style>
