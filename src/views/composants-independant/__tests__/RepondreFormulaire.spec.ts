import { mount } from '@vue/test-utils';
import ResponsePage from '@/views/indep-comp/RepondreFormulaire.vue';

describe('ResponsePage.vue', () => {
  it('renders response form correctly when form not submitted', () => {
    const wrapper = mount(ResponsePage, {
      props: {
        questionss: [
          {
            id: 1,
            question: 'Quelle est votre nom?',
            type_question: { type: 'text' },
            options_question: null,
            reponses: [],
            id_option: null,
          },
        ],
      },
    });

    expect(wrapper.find('.response-page').exists()).true;
    expect(wrapper.find('.response-button').exists()).true;
  });

  it('renders success message when form submitted successfully', async () => {
    const wrapper = mount(ResponsePage, {
      props: {
        questionss: [
          {
            id: 1,
            question: 'Quelle est votre nom?',
            type_question: { type: 'text' },
            options_question: null,
            reponses: [],
            id_option: null,
          },
        ],
      },
    });

    await wrapper.find('.response-button').trigger('click');

    expect(wrapper.find('.p-5').exists()).true;
    expect(wrapper.find('.success-message').text()).text('Réponses envoyées avec succès');
  });

  it('displays error message if mandatory field not filled', async () => {
    const wrapper = mount(ResponsePage, {
      props: {
        questionss: [
          {
            id: 1,
            question: 'Quelle est votre nom?',
            type_question: { type: 'text' },
            options_question: null,
            reponses: [],
            id_option: null,
          },
        ],
      },
    });

    await wrapper.find('.response-button').trigger('click');

    expect(wrapper.find('.error-message').exists()).true;
    expect(wrapper.find('.error-message').text()).text('Veuillez remplir le champ obligatoire');
  });
});
