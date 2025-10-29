import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface Demande {
  id: number;
  dateDebutAbsence: string;
  dateFinAbsence: string;
  date: string;
  demandePar: string;
  superviseur: string;
  secretaire: string;
  identifiant: string;
  corpsEmploi: string;
  lieuTravail: string;
  motif: string;
  noteDemande: string;
  noteApprobation: string;
  etat: string;
}

interface Filtres {
  dateDebut: string;
  dateFin: string;
  etat: string;
  motif: string;
  initiePar: string;
}

export const useDemandeStore = defineStore('demandeStore', () => {
  const demandes = ref<Demande[]>([
     {
      id: 1,
      dateDebutAbsence: '2025-11-06T09:15',
      dateFinAbsence: '2025-11-08T09:15',
      date: '2025-09-30T09:15',
      demandePar: 'Marie Tremblay',
      superviseur: 'Jean Dupuis',
      secretaire: 'Mélanie Gagnon',
      identifiant: '0000006',
      corpsEmploi: '3103-Primaire',
      lieuTravail: '515. École 515',
      motif: 'Maladie',
      noteDemande: 'Suivi médical (pour un proche).',
      noteApprobation: 'Requête initiée par l\'employé',
      etat: 'Annulé'
    },
     {
      id: 2,
      dateDebutAbsence: '2025-11-10T09:15',
      dateFinAbsence: '2025-11-12T09:15',
      date: '2025-09-30T09:15',
      demandePar: 'Pierre Lefebvre',
      superviseur: 'Jean Dupuis',
      secretaire: 'Mélanie Gagnon',
      identifiant: '0000007',
      corpsEmploi: '2104-Conseiller pédagogique',
      lieuTravail: '515. École 515',
      motif: 'Vacances',
      noteDemande: 'Besoin de repos après un déplacement',
      noteApprobation: 'En attente de pièces justificatives',
      etat: 'Refusé'
    },
    {
      id: 3,
      dateDebutAbsence: '2025-10-06T09:15',
      dateFinAbsence: '2025-10-08T09:15',
      date: '2025-09-30T09:15',
      demandePar: 'Sophie Bergeron',
      superviseur: 'Jean Dupuis',
      secretaire: 'Mélanie Gagnon',
      identifiant: '0000001',
      corpsEmploi: '3201-Suppléant',
      lieuTravail: '515. École 515',
      motif: 'Force majeure',
      noteDemande: 'Besoin de repos après un déplacement',
      noteApprobation: '',
      etat: 'Brouillon'
    },
    {
      id: 4,
      dateDebutAbsence: '2025-10-08T09:15',
      dateFinAbsence: '2025-10-10T09:15',
      date: '2025-09-30T09:15',
      demandePar: 'Luc Bouchard',
      superviseur: 'Jean Dupuis',
      secretaire: 'Mélanie Gagnon',
      identifiant: '0000001',
      corpsEmploi: '1150-Dir. d\'école primaire',
      lieuTravail: '515. École 515',
      motif: 'Maladie',
      noteDemande: 'Pour cause de maladie',
      noteApprobation: '',
      etat: 'Brouillon'
    },
     {
      id: 5,
      dateDebutAbsence: '2025-10-13T09:15',
      dateFinAbsence: '2025-10-14T09:15',
      date: '2025-09-30T09:15',
      demandePar: 'Caroline Roy',
      superviseur: 'Jean Dupuis',
      secretaire: 'Mélanie Gagnon',
      identifiant: '0000002',
      corpsEmploi: '2113-Psychologue',
      lieuTravail: '515. École 515',
      motif: 'Responsabilité parentale',
      noteDemande: 'Pour la naissance',
      noteApprobation: '',
      etat: 'Soumis'
    },
     {
      id: 6,
      dateDebutAbsence: '2025-10-14T09:15',
      dateFinAbsence: '2025-10-16T09:15',
      date: '2025-09-30T09:15',
      demandePar: 'François Côté',
      superviseur: 'Jean Dupuis',
      secretaire: 'Mélanie Gagnon',
      identifiant: '0000003',
      corpsEmploi: '4207-Techn. en éduc. spéc.',
      lieuTravail: '515. École 515',
      motif: 'Force majeure',
      noteDemande: 'Participation à une formation professionnelle',
      noteApprobation: '',
      etat: 'En attente d\'approbation'
    },
     {
      id: 7,
      dateDebutAbsence: '2025-10-20T09:15',
      dateFinAbsence: '2025-10-22T09:15',
      date: '2025-09-30T09:15',
      demandePar: 'Isabelle Gauthier',
      superviseur: 'Jean Dupuis',
      secretaire: 'Mélanie Gagnon',
      identifiant: '0000004',
      corpsEmploi: '3101-Adapt. scol.',
      lieuTravail: '515. École 515',
      motif: 'Affaires personnelles',
      noteDemande: 'Pour raisons personnelles non médicales',
      noteApprobation: '',
      etat: 'Modifié'
    },
     {
      id: 8,
      dateDebutAbsence: '2025-10-27T09:15',
      dateFinAbsence: '2025-10-29T09:15',
      date: '2025-09-30T09:15',
      demandePar: 'Daniel Morin',
      superviseur: 'Jean Dupuis',
      secretaire: 'Mélanie Gagnon',
      identifiant: '0000005',
      corpsEmploi: '5302-Concierge, classe II',
      lieuTravail: '515. École 515',
      motif: 'Déménagement',
      noteDemande: 'Démarches administratives obligatoires',
      noteApprobation: '',
      etat: 'Traitée'
    }
  ]);

  const filtres = ref<Filtres>({
    dateDebut: '',
    dateFin: '',
    etat: '',
    motif: '',
    initiePar: ''
  });

  const demandesFiltrees = computed(() =>
    demandes.value.filter((d) => {
      const matchEtat = !filtres.value.etat || d.etat === filtres.value.etat;
      const matchMotif = !filtres.value.motif || d.motif === filtres.value.motif;
      const matchInitiePar =
        !filtres.value.initiePar ||
        d.demandePar.toLowerCase().includes(filtres.value.initiePar.toLowerCase());
      const matchDate =
        (!filtres.value.dateDebut || new Date(d.date) >= new Date(filtres.value.dateDebut)) &&
        (!filtres.value.dateFin || new Date(d.date) <= new Date(filtres.value.dateFin));
      return matchEtat && matchMotif && matchInitiePar && matchDate;
    })
  );

  const modifierDemande = (demandeModifiee: Demande) => {
    const index = demandes.value.findIndex((d) => d.id === demandeModifiee.id);
    if (index !== -1) {
      demandes.value[index] = { ...demandeModifiee };
    }
  };

  const retirerDemande = (id: number) => {
    const index = demandes.value.findIndex((d) => d.id === id);
    if (index !== -1) {
      demandes.value[index].etat = 'Annulé';
    }
  };

  const appliquerFiltres = (nouveauxFiltres: Filtres) => {
    filtres.value = { ...nouveauxFiltres };
  };

  return {
    demandes,
    filtres,
    demandesFiltrees,
    modifierDemande,
    retirerDemande,
    appliquerFiltres
  };
});