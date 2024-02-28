import { beforeEach, describe, expect, test, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import DialogErreur from '../DialogErreur.vue';
import { nextTick, ref } from 'vue';
import PButton from 'primevue/button';
import PDialog from 'primevue/dialog';
import PrimeVue from 'primevue/config';

const afficherDialogErreur = ref(true);
const libelleErreur = ref('');

function dialogErreurWrapper() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return mount<any>(DialogErreur, {
    components: { PButton, PDialog },
    props: { afficherDialogErreur: afficherDialogErreur.value, libelleErreur: libelleErreur.value },
    global: {
      stubs: {
        teleport: true,
      },
      plugins: [PrimeVue],
    },
  });
}

beforeEach(() => {
  // Permet de reset à true la prop 'afficherDialogErreur' avant chaque test
  afficherDialogErreur.value = true;
});

describe('DialogErreur.vue', () => {
  // PDialog
  test('the dialog should not be visible when the prop `afficherDialogErreur` is false', async () => {
    const wrapper = dialogErreurWrapper();
    const dialog = wrapper.findComponent(PDialog);

    expect(dialog.props('visible')).toBe(true);

    wrapper.setProps({ afficherDialogErreur: false });
    await nextTick();

    expect(dialog.props('visible')).toBe(false);
  });

  // Header
  test('should display a header `Erreur`', async () => {
    const wrapper = dialogErreurWrapper();
    await nextTick();

    expect(wrapper.get('.p-dialog-header').text()).toBe('Erreur');

    const dialog = wrapper.findComponent(PDialog);

    expect(dialog.props('header')).toBe('Erreur');
  });

  // #libelleErreur
  test('the div `#libelleErreur` should display the right text', async () => {
    const wrapper = dialogErreurWrapper();
    await nextTick();

    wrapper.setProps({ libelleErreur: "L'utilisateur est inconnu." });
    await nextTick();

    expect(wrapper.get('#libelleErreur').text()).toBe("L'utilisateur est inconnu.");

    wrapper.setProps({ libelleErreur: '' });
    await nextTick();

    expect(wrapper.get('#libelleErreur').text()).toBe("Une erreur s'est produite.");
  });

  // Bouton #btnFermerDialogErreur
  test('the button `#btnFermerDialogErreur` should have a label `Fermer`', async () => {
    const wrapper = dialogErreurWrapper();
    await nextTick();

    expect(wrapper.get('#btnFermerDialogErreur').text()).toBe('Fermer');
  });

  test('should trigger the function `fermerDialog()` clicking the button `#btnFermerDialogErreur`', async () => {
    const fermerDialog = vi.fn();
    const wrapper = mount(DialogErreur, {
      components: { PButton, PDialog },
      props: { afficherDialogErreur: afficherDialogErreur.value, libelleErreur: libelleErreur.value },
      global: {
        stubs: {
          teleport: true,
        },
        plugins: [PrimeVue],
        mocks: { fermerDialog },
      },
    });

    // Permet d'attendre la prise en compte de la prop `afficherDialogErreur`
    await nextTick();

    const btnFermerDialogErreur = wrapper.get('#btnFermerDialogErreur');

    await btnFermerDialogErreur.trigger('click');

    expect(fermerDialog).toHaveBeenCalledOnce();
  });

  // fermerDialog()
  test('`fermerDialog()` should reset the prop `libelleErreur` and close the dialog', async () => {
    const wrapper = dialogErreurWrapper();
    await nextTick();

    wrapper.vm.fermerDialog();

    expect(wrapper.emitted('update:afficherDialogErreur')?.at(0)?.at(0)).toBe(false);
    expect(wrapper.emitted('update:libelleErreur')?.at(0)?.at(0)).toBe('');
  });
});
