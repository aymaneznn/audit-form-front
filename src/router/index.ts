import { createRouter, createWebHistory } from 'vue-router';
import App from '@/App.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'app',
      component: App,
      children: [
        {
          path: '',
          name: 'tableau-de-bord',
          component: () => import('@/views/TableauDeBord.vue'),
        },
        {
          path: '/create-form',
          name: 'create-form',
          component: () => import('@/views/CreateForm.vue'),
        },
      ],
    },
    {
      path: '/:notFound(.*)',
      redirect: '/',
    },
    {
      path: '/reponse/:id',
      name: 'reponse',
      component: () => import('@/views/RepondreFormulaire.vue'),
    },
    {
      path: '/dashboard-reponse/:id',
      name: 'reponse-formulaire',
      component: () => import('@/views/ReponseFormulaire.vue'),
    },
  ],
});

export default router;
