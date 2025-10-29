// src/types/demande.ts

export enum ValidationStatut {
  EnCreation = 'En création',
  EnCours = 'En attente d\'approbation',
  Modifié = 'Modifiée',
  Soumis = 'Soumis',
  Approuver = 'Traitée',
  EnAttente = 'En attente d\'une pièce justificative',
  Annuler = 'Annulée',
  Refuse = 'Refusée'
}

export enum Approbation {
  Annuler = 'Annulée',
  Accepter = 'Traitée',
  EnAttente = 'En attente d\'une pièce justificative',
  EnCours = 'En attente d\'approbation',
  Refuser  = 'Refusée' 
}

export enum Paiement { 
 tempsSupp = "Temps supplémentaire", //01
 surcroit = "Surcroît", //02
 remplacement = "Remplacement",  //03
 suppOcc = "Suppléance occasionnelle", //04
 banqTemp = "Banque de temps",
 atp = "ATP",
 tauxHoraire = "Taux horaire", 
 suppTache = "Suppléance en sus de la tâche",
 primeDispo = "Prime de disponibilité"

}

export interface Demande {
  id: string
  matricule: string
  date: string
  dateCreation: string
  dateDebut: string
  dateFin: string

  emploiCode: string
  emploiCorps: string
  emploiLabel: string

  lieuCode: string
  lieuLabel: string

  motifCode: string
  motifLabel: string

  typeEvenement: string
  touteJournee: boolean
  de: string
  a: string

  nomNaissance: string
  prenom: string
  commentaire: string

  etatValidation: string // ou ValidationStatut si enum utilisée

  niveau1validation: string
  niveau2validation: string

  noteApprobation: string
  decision: 'accepte' | 'refuse' | '' | null
  attente_info: boolean
}
