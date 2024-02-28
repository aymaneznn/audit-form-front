import FormulaireModel from './FormulaireModel'

export default class DonneesStatistiqueModel {
  id?: number
  formulaire?: FormulaireModel
  intervalleDeTemps?: string
  nomDonnee?: string
  donnees?: string
}
