# vue-template

Template développé avec :

- [Vue.js 3.+](https://vuejs.org/) (Composition API, syntaxe script setup)
- [Vue Router](https://router.vuejs.org/) : système de routeur de Vue.js
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) : outil de build
- [Vitest](https://vitest.dev/) et [vue-test-utils](https://test-utils.vuejs.org/) : tests unitaires
- [pnpm](https://pnpm.io/fr/) : gestionnaire de dépendances
- [Prettier](https://prettier.io/) : formattage de code
- [ESLint](https://eslint.org/) : linter
- [Sass](https://sass-lang.com/) : préprocesseur CSS
- [PrimeVue](https://primefaces.org/primevue/) : librairie de composants
- [PrimeFlex](https://www.primefaces.org/primeflex/) : librairie utilitaire CSS
- [VeeValidate](https://vee-validate.logaretm.com/v4/) : validation des formulaires
- [axios](https://axios-http.com/fr/docs/intro) : client HTTP
- [Font Awesome](https://fontawesome.com/v5/search) : librairie d'icônes
- [PrimeIcons](https://primefaces.org/primevue/icons) : librairie d'icônes
- [date-fns](https://date-fns.org/) : librairie utilitaire pour les dates
- [keycloak-js](https://www.npmjs.com/package/keycloak-js) : adapteur pour Keycloak
- [Cypress](https://www.cypress.io/) : tests End-to-End

## Environnement de développement recommandé

### IDE :

[VSCode](https://code.visualstudio.com/)

### Extensions :

- [Volar](https://marketplace.visualstudio.com/items?itemName=vue.volar) (désactiver Vetur si activé) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=vue.vscode-typescript-vue-plugin).
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Vitest](https://marketplace.visualstudio.com/items?itemName=ZixuanChen.vitest-explorer)
- [Vue VSCode Snippets](https://marketplace.visualstudio.com/items?itemName=sdras.vue-vscode-snippets)

## Configuration de Vite

[Vite Configuration Reference](https://vitejs.dev/config/).

## Commandes utiles

### Installation du projet

```sh
pnpm install
```

### Compiler le projet et lancer le serveur de développement

```sh
pnpm dev
```

### Vérification des types, compilation et minification pour la mise en production

```sh
pnpm build
```

### Lancer les tests unitaires avec [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
pnpm test:unit:ci # pour avoir le coverage
```

### Lancer les tests End-to-End avec [Cypress](https://www.cypress.io/)

```sh
pnpm build
pnpm test:e2e # or `pnpm test:e2e:ci` for headless testing
```

### Lancer un scan du linter [ESLint](https://eslint.org/)

```sh
pnpm lint
```

### Lancer une vérification des types TypeScript

```sh
pnpm typecheck
```

## Utilisation de VueUse

VueUse propose des centaines de fonctions utilitaires : https://vueuse.org.  
Vous pouvez l'installer comme ceci si besoin :

```sh
pnpm i @vueuse/core
```

## Mise à jour de PrimeVue

Après chaque mise à jour de PrimeVue, il est nécessaire d'écraser les deux thèmes situés dans `public/themes/.../theme.css` par ceux présent dans le dossier `node_modules/primevue/resources/themes/.../theme.css`. Nous sommes obligés de figer les thèmes pour gérer le thème clair et le thème sombre avec le système actuel.
