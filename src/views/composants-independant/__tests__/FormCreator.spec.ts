import { mount } from '@vue/test-utils';
import QuestionForm from '@/views/indep-comp/FormCreator.vue';

describe('QuestionForm', () => {
  it('renders the form initially', () => {
    const wrapper = mount(QuestionForm);
    expect(wrapper.find('form').exists()).true;
  });

  it('adds a new question', async () => {
    const wrapper = mount(QuestionForm);
    await wrapper.setData({ newQuestion: 'How are you?' });
    wrapper.find('.add-question-button').trigger('click');
    expect(wrapper.findAll('.question').length).equal(1);
    expect(wrapper.find('.question').text()).contain('How are you?');
  });

  it('deletes a question', async () => {
    const wrapper = mount(QuestionForm);
    await wrapper.setData({ newQuestion: 'How are you?' });
    wrapper.find('.add-question-button').trigger('click');
    wrapper.find('.delete-question-button').trigger('click');
    expect(wrapper.find('.question').exists()).false;
  });

  it('submits the form', async () => {
    const wrapper = mount(QuestionForm);
    await wrapper.setData({ newQuestion: 'How are you?' });
    wrapper.find('.add-question-button').trigger('click');
    wrapper.find('.submit-button').trigger('click');
    expect(wrapper.emitted('form-submitted')).true;
  });

  it('edits a question', async () => {
    const wrapper = mount(QuestionForm);
    await wrapper.setData({ newQuestion: 'How are you?' });
    wrapper.find('.add-question-button').trigger('click');
    await wrapper.find('.question').setValue('How old are you?');
    expect(wrapper.find('.question').text()).text('How old are you?');
  });

  it('loads a form model', async () => {
    const wrapper = mount(QuestionForm);
    await wrapper.setProps({ formModel: { questions: ['What is your name?'] } });
    expect(wrapper.findAll('.question').length).equal(1);
    expect(wrapper.find('.question').text()).contain('What is your name?');
  });

  it('validates user inputs', async () => {
    const wrapper = mount(QuestionForm);
    await wrapper.setData({ newQuestion: '' });
    wrapper.find('.add-question-button').trigger('click');
    expect(wrapper.find('.error-message').exists()).true;
  });

  it('handles errors', async () => {});

  it('handles user interactions', async () => {});
});
