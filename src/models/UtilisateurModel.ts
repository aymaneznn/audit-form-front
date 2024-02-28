import FormulaireModel from './FormulaireModel'
import ReponseModel from './ReponseModel'

export default class UtilisateurModel {
  id?: number
  nom?: string
  prenom?: string
  password?: string
  formulaires?: FormulaireModel[]
  reponses?: ReponseModel[]
}
