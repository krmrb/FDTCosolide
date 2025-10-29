import { defineStore } from 'pinia'
import DemandePaiement from '@/models/DemandePaiement'

interface FiltrePeriode {
  type: 'mois' | 'semaine' | 'date' | 'intervalle'
  valeur: string | { de: string; a: string }
}

export const useDemandePaiementStore = defineStore('demandePaiement', {
  state: () => ({
    demandes: [
      new DemandePaiement({
        id: 1,
        matricule: '123456',
        demandePar: 'Jean Martin',
        demandeLe: '2025-10-08T09:15',
        dateDemande: '2025-10-09',
        heureDebut: '08:00',
        heureFin: '10:00',
        minutesTachesEducatives: 60,
        minutesTachesAutres: 60,
        corpsEmploi: '316201. FP métallurgie',
        lieuTravail: '414. École 414',
        typePaiement: 'Temps supplémentaire',
        noteDemande: 'Ut gravida nunc vel purus maximus sodales...',
        noteApprobation: 'Manque documents justificatifs. Ut gravida nunc vel purus maximus sodales. Donec dapibus nec purus sed aliquam. Aenean in efficitur odio. Cras efficitur vitae justo eget tincidunt. Suspendisse viverra, nisl nec viverra sodales, justo lacus placerat nunc, eu viverra metus velit non eros.',
        etat: 'En attente d\'une pièce justificative'
      }),
      new DemandePaiement({
        id: 2,
        matricule: '123456',
        demandePar: 'Jean Martin',
        demandeLe: '2025-10-09T09:15',
        dateDemande: '2025-10-12',
        heureDebut: '11:00',
        heureFin: '13:00',
        minutesTachesEducatives: 30,
        minutesTachesAutres: 40,
        corpsEmploi: '316201. FP métallurgie',
        lieuTravail: '515. École 515',
        typePaiement: 'Surcroît',
        noteDemande: 'Ut gravida nunc vel purus maximus sodales...',
        noteApprobation: '',
        etat: 'Brouillon'
      }),
      new DemandePaiement({
        id: 3,
        matricule: '123456',
        demandePar: 'Jean Martin',
        demandeLe: '2025-10-10T09:15',
        dateDemande: '2025-09-12',
        heureDebut: '18:00',
        heureFin: '19:00',
        minutesTachesEducatives: 50,
        minutesTachesAutres: 25,
        corpsEmploi: '316201. FP métallurgie',
        lieuTravail: '515. École 515',
        typePaiement: 'Remplacement',
        noteDemande: 'Ut gravida nunc vel purus maximus sodales...',
        noteApprobation: '',
        etat: 'Soumis'
      }),
      new DemandePaiement({
        id: 4,
        matricule: '123456',
        demandePar: 'Jean Martin',
        demandeLe: '2025-10-11T09:15',
        dateDemande: '2025-08-12',
        heureDebut: '15:00',
        heureFin: '17:00',
        minutesTachesEducatives: 50,
        minutesTachesAutres: 25,
        corpsEmploi: '316201. FP métallurgie',
        lieuTravail: '515. École 515',
        typePaiement: 'ATP',
        noteDemande: 'Ut gravida nunc vel purus maximus sodales...',
        noteApprobation: 'Ut gravida nunc vel purus maximus sodales. Donec dapibus nec purus sed aliquam. Aenean in efficitur odio. Cras efficitur vitae justo eget tincidunt. Suspendisse viverra, nisl nec viverra sodales, justo lacus placerat nunc, eu viverra metus velit non eros.',
        etat: 'Refusé'
      }),
    ] as DemandePaiement[],
    filtreEtat: [] as string[],
    filtreRecherche: '',
    filtrePeriode: {
      type: 'intervalle',
      valeur: { de: '2025-01-01', a: '2025-12-31' }
    } as FiltrePeriode
  }),


  getters: {
    demandesFiltrees: (state): DemandePaiement[] => {
      return state.demandes.filter((demande) => {
        const date = new Date(demande.dateDemande)
        if (isNaN(date.getTime())) return false

        const matchEtat =
          state.filtreEtat.length === 0 || state.filtreEtat.includes(demande.etat)

        const matchRecherche =
          state.filtreRecherche === '' ||
          demande.matricule.includes(state.filtreRecherche) ||
          demande.demandePar.toLowerCase().includes(state.filtreRecherche.toLowerCase()) ||
          (demande.commentaire?.toLowerCase().includes(state.filtreRecherche.toLowerCase()) ?? false)

        const matchPeriode = (() => {
          const periode = state.filtrePeriode

          if (periode.type === 'mois') {
            const [annee, mois] = (periode.valeur as string).split('-')
            return (
              date.getFullYear() === Number(annee) &&
              date.getMonth() + 1 === Number(mois)
            )
          }

          if (periode.type === 'semaine') {
            const debut = new Date(periode.valeur as string)
            const fin = new Date(debut)
            fin.setDate(debut.getDate() + 6)
            return date >= debut && date <= fin
          }

          if (periode.type === 'date') {
            return demande.dateDemande === periode.valeur
          }

          if (periode.type === 'intervalle') {
            const { de, a } = periode.valeur as { de: string; a: string }
            const dateDe = new Date(de)
            const dateA = new Date(a)
            return date >= dateDe && date <= dateA
          }

          return true
        })()

        return matchEtat && matchRecherche && matchPeriode
      })
    }
  },

  actions: {
    appliquerFiltres({
      etat,
      recherche,
      periode
    }: {
      etat?: string[]
      recherche?: string
      periode?: FiltrePeriode
    }) {
      this.filtreEtat = etat || []
      this.filtreRecherche = recherche || ''
      this.filtrePeriode =
        periode || { type: 'intervalle', valeur: { de: '2025-01-01', a: '2025-12-31' } }
    },

    ajouterDemande(demande: DemandePaiement) {
      this.demandes.push(demande)
    }
  }
});