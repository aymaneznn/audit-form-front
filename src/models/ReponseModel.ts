import FormulaireModel from './FormulaireModel';
import QuestionModel from './QuestionModel';
import TypeQuestionModel from './TypeQuestionModel';
import UtilisateurModel from './UtilisateurModel';

export default class ReponseModel {
  id?: number;
  formulaire?: FormulaireModel;
  question?: QuestionModel;
  typeReponse?: TypeQuestionModel;
  utilisateur?: UtilisateurModel;
  posterLe?: Date;
  donnees_reponse?: object;
  id_group_reponse?: string;
}
