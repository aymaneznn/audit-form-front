import FormulaireModel from './FormulaireModel'
import TypeQuestionModel from './TypeQuestionModel'
import ReponseModel from './ReponseModel'

export default class QuestionModel {
  id?: number
  formulaire?: FormulaireModel
  question?: string
  type_question?: TypeQuestionModel
  options_question?: string
  reponses?: ReponseModel[]
}
