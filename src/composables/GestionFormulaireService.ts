import axios from 'axios';
import FormulaireModel from '@/models/FormulaireModel';
import QuestionModel from '@/models/QuestionModel';
import ReponseModel from '@/models/ReponseModel';
import TypeQuestionModel from '@/models/TypeQuestionModel';
import ParametrageAvanceModel from '@/models/ParametrageAvanceModel';
import DonneesStatistiqueModel from '@/models/DonneesStatistiqueModel';
import GestionUtilisateurModel from '@/models/GestionUtilisateurModel';

import { ApiUrl } from '@/constants/ApiUrls';

const axiosInstance = axios.create({
  baseURL: ApiUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export function useApiService() {
  return {
    getAllFormulaires: async (): Promise<FormulaireModel[]> => {
      const response = await axiosInstance.get('/formulaire/all');
      return response.data.body;
    },

    getQuestionsByFormulaire: async (formulaireId: number): Promise<QuestionModel[]> => {
      const response = await axiosInstance.get(`/question/get-questions-by-formulaire/${formulaireId}`);
      return response.data.body;
    },

    getReponsesByQuestion: async (questionId: number): Promise<ReponseModel[]> => {
      const response = await axiosInstance.get(`/reponse/get-reponses-by-question/${questionId}`);
      return response.data.body;
    },

    getTypeQuestionByQuestion: async (questionId: number): Promise<TypeQuestionModel> => {
      const response = await axiosInstance.get(`/type-question-par-question/${questionId}`);
      return response.data.body;
    },

    getParametreAvanceByFormulaire: async (formulaireId: number): Promise<ParametrageAvanceModel[]> => {
      const response = await axiosInstance.get(`/parametrage-avance-par-formulaire/${formulaireId}`);
      return response.data.body;
    },

    getDonneesStatistiquesByFormulaire: async (formulaireId: number): Promise<DonneesStatistiqueModel[]> => {
      const response = await axiosInstance.get(`/donnees-statistiques-par-formulaire/${formulaireId}`);
      return response.data.body;
    },

    getGestionUtilisateurByFormulaire: async (formulaireId: number): Promise<GestionUtilisateurModel[]> => {
      const response = await axiosInstance.get(`/gestion-utilisateur-par-formulaire/${formulaireId}`);
      return response.data.body;
    },

    getReponsesByFormulaire: async (formulaireId: number): Promise<ReponseModel[]> => {
      const response = await axiosInstance.get(`/reponse/get-reponses-by-formulaire/${formulaireId}`);
      return response.data.body;
    },

    createFormulaire: async (formulaire: FormulaireModel): Promise<void> => {
      await axiosInstance.post('/formulaire/create-formulaire', formulaire);
    },

    createQuestion: async (question: QuestionModel): Promise<void> => {
      await axiosInstance.post('/question/create-question', question);
    },

    createReponse: async (reponse: ReponseModel): Promise<void> => {
      await axiosInstance.post('/reponse/create-reponse', reponse);
    },

    deleteFormulaireByID: async (formulaireId: number): Promise<void> => {
      await axiosInstance.delete(`/formulaire/delete-formulaire/${formulaireId}`);
    },

    deleteQuestionByID: async (questionId: number): Promise<void> => {
      await axiosInstance.delete(`/question/delete-question/${questionId}`);
    },

    deleteReponseByID: async (reponseId: number): Promise<void> => {
      await axiosInstance.delete(`/reponse/delete-reponse/${reponseId}`);
    },
  };
}
