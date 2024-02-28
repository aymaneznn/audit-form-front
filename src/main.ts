import { createApp, reactive } from 'vue';
import AppWrapper from './AppWrapper.vue';
import router from './router';
import Locale_FR from '@/config/Locale_FR';
import Message from 'primevue/message';
import Button from 'primevue/button';
import Card from 'primevue/card';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Avatar from 'primevue/avatar';
import InputSwitch from 'primevue/inputswitch';
import StyleClass from 'primevue/styleclass';
import Ripple from 'primevue/ripple';
import Badge from 'primevue/badge';
import Dialog from 'primevue/dialog';
import ConfirmPopup from 'primevue/confirmpopup';
import Toast from 'primevue/toast';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';
import MultiSelect from 'primevue/multiselect';

import LoadingSpinner from './components/ui-elements/LoadingSpinner.vue';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import './assets/styles/layout.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@/assets/styles/global.scss';

const app = createApp(AppWrapper);

app.config.globalProperties.$appState = reactive({
  theme: 'lara-light-indigo',
  darkTheme: false,
});

app.use(PrimeVue, { ripple: true, inputStyle: 'outlined', locale: Locale_FR });
app.use(ConfirmationService);
app.use(ToastService);
app.use(router);

app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);

// PrimeVue components
app.component('Avatar', Avatar);
app.component('Badge', Badge);
app.component('PButton', Button);
app.component('PCard', Card);
app.component('InputSwitch', InputSwitch);
app.component('Message', Message);
app.component('PDialog', Dialog);
app.component('ConfirmPopup', ConfirmPopup);
app.component('Toast', Toast);
app.component('InputText', InputText);
app.component('PTextarea', Textarea);
app.component('Dropdown', Dropdown);
app.component('Checkbox', Checkbox);
app.component('InputNumber', InputNumber);
app.component('MultiSelect', MultiSelect);

// Global custom components
app.component('LoadingSpinner', LoadingSpinner);

import CreateForm from '@/views/CreateForm.vue';

export { CreateForm };

app.component('CreateForm', CreateForm);

app.mount('#app');
