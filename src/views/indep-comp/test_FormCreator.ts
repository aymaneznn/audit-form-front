import { mount } from '@vue/test-utils';
import QuestionForm from '@/views/indep-comp/FormCreator.vue';

describe('QuestionForm', () => {
  it('renders the form initially', () => {
    const wrapper = mount(QuestionForm);
    expect(wrapper.find('form').exists()).toBe(true);
  });

  it('adds a new question', async () => {
    const wrapper = mount(QuestionForm);
    await wrapper.setData({ newQuestion: 'How are you?' });
    wrapper.find('.add-question-button').trigger('click');
    expect(wrapper.findAll('.question').length).toBe(1);
    expect(wrapper.find('.question').text()).contain('How are you?');
  });

  it('deletes a question', async () => {
    const wrapper = mount(QuestionForm);
    await wrapper.setData({ newQuestion: 'How are you?' });
    wrapper.find('.add-question-button').trigger('click');
    wrapper.find('.delete-question-button').trigger('click');
    expect(wrapper.find('.question').exists()).toBe(false);
  });

  it('submits the form', async () => {
    const wrapper = mount(QuestionForm);
    await wrapper.setData({ newQuestion: 'How are you?' });
    wrapper.find('.add-question-button').trigger('click');
    wrapper.find('.submit-button').trigger('click');
    expect(wrapper.emitted('form-submitted')).toBeTruthy();
  });

  it('edits a question', async () => {
    const wrapper = mount(QuestionForm);
    await wrapper.setData({ newQuestion: 'How are you?' });
    wrapper.find('.add-question-button').trigger('click');
    await wrapper.find('.question').setValue('How old are you?');
    expect(wrapper.find('.question').text()).toContain('How old are you?');
  });

  it('loads a form model', async () => {
    const wrapper = mount(QuestionForm);
    await wrapper.setProps({ formModel: { questions: ['What is your name?'] } });
    expect(wrapper.findAll('.question').length).toBe(1);
    expect(wrapper.find('.question').text()).contain('What is your name?');
  });

  it('validates user inputs', async () => {
    const wrapper = mount(QuestionForm);
    await wrapper.setData({ newQuestion: '' });
    wrapper.find('.add-question-button').trigger('click');
    expect(wrapper.find('.error-message').exists()).toBe(true);
  });

  it('handles errors', async () => {
    // Simulate an error scenario and test how the component handles it
  });

  it('handles user interactions', async () => {
    // Simulate various user interactions and test if the component behaves as expected
  });

  // Add more tests as needed for other functionalities or edge cases
});
