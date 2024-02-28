import UtilisateurModel from './UtilisateurModel'
import DonneesStatistiqueModel from './DonneesStatistiqueModel'
import GestionUtilisateurModel from './GestionUtilisateurModel'
import ParametrageAvanceModel from './ParametrageAvanceModel'
import QuestionModel from './QuestionModel'
import ReponseModel from './ReponseModel'

export default class FormulaireModel {
  id?: number
  titre?: string
  description?: string
  creer_par?: UtilisateurModel
  creerLe?: Date
  modifieLe?: Date
  donneesStatistiques?: DonneesStatistiqueModel[]
  gestionUtilisateurs?: GestionUtilisateurModel[]
  parametrageAvances?: ParametrageAvanceModel[]
  questions?: QuestionModel[]
  reponses?: ReponseModel[]
}
