# Documentation technique pour la bibliothèque Creation de formualaires

## Introduction
Cette bibliothèque combine Vue.js 3 pour la partie front-end et Spring Boot pour l'API. Elle propose des composants prêts à l'emploi pour la création de formulaires et la gestion des réponses.

## Composants

### 1. CreateForm
Le composant `CreateForm` permet de créer des formulaires avec les fonctionnalités suivantes :
- Ajout d'un titre et d'une description.
- Section pour ajouter des questions avec différents types :
  - Checkbox
  - Texte
  - Menu déroulant
  - Champ numérique
  - Champ de texte
  - Sélection multiple
- Possibilité de publier le formulaire une fois créé.

### 2. TableauDeBord
Le composant `TableauDeBord` permet de consulter les formulaires créés. Il offre les fonctionnalités suivantes :
- Modification du titre et de la description des formulaires et la suppression du formulaire avec ses réponses.
- Consultation des questions associées à chaque formulaire.
- Liens pour répondre au formulaire et voir les réponses.

### 3. RepondreFormulaire
Le composant `RepondreFormulaire` permet de répondre aux formulaires. Il affiche un récapitulatif de la réponse une fois envoyée.

### 4. ReponseFormulaire
Le composant `ReponseFormulaire` affiche un tableau avec la liste des réponses par utilisateur. Il permet de consulter en détail les réponses reçues pour chaque formulaire avec une mulititudes de `Charts` pour voir les statistiques en détails des réponses.

## Utilisation
1. Importez les composants nécessaires dans vos fichiers Vue.
2. Utilisez-les dans vos templates comme suit :
   ```vue
   <template>
     <CreateForm />
     <TableauDeBord />
     <RepondreFormulaire />
     <ReponseFormulaire />
   </template>
   ```
