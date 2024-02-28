import QuestionModel from './QuestionModel'
import ReponseModel from './ReponseModel'

export default class TypeQuestionModel {
  id?: number
  type?: string
  questions?: QuestionModel[]
  reponses?: ReponseModel[]
}
