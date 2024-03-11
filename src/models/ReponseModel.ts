import FormulaireModel from './FormulaireModel';
import QuestionModel from './QuestionModel';
import TypeQuestionModel from './TypeQuestionModel';
import UtilisateurModel from './UtilisateurModel';

type DonneesReponse = {
  data: unknown;
};

export default class ReponseModel {
  id?: number;
  formulaire?: FormulaireModel;
  question?: QuestionModel;
  typeReponse?: TypeQuestionModel;
  utilisateur?: UtilisateurModel;
  poster_le?: Date;
  donnees_reponse?: DonneesReponse;
  id_group_reponse?: string;
}
