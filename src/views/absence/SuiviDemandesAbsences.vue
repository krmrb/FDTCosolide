<template>
  <div class="main-content bg-white flex-column flex-fill p-3 p-sm-5 pt-sm-3">
    <h3 class="mb-4 text-primary mt-2">Suivi de mes demandes d'absence</h3>
    <div class="d-flex justify-content-start mb-3">
      <button class="btn btn-primary mb-3 me-2" @click="ouvrirModal(null)">Nouvelle demande ...</button>
      <button class="btn btn-primary mb-3 me-2" @click="ouvrirHoraire">Horaire</button>
    </div>

    <Filters @filtrer="filtrerDemandes" />

    <!-- Modal Formulaire Suivi Absence -->
    <div v-if="detailsVisible" class="modal-backdrop fade show"></div>
    <div v-if="detailsVisible" class="modal d-block" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0">
            <button type="button" class="btn-close" @click="fermerDetails" aria-label="Fermer"></button>
          </div>
          <div class="modal-body">
            <FormulaireSuiviAbsence :demande="demandeEnCours" @fermer="fermerDetails" />
          </div>
        </div>
      </div>
    </div>

    <ListeDemandesAbsences
      :demandesFiltrees="demandesTriees"
      :tri="triAbsence"
      @trier="trierAbsencePar"
      @voir="ouvrirModal"
      @modifier="ouvrirModal"
      @retirer="retirerDemande"
      @voirDetails="voirDetails"
      @ligneCliquee="ouvrirModal"  <!-- AJOUTEZ CETTE LIGNE -->
    />

    <!-- Modal Nouvelle Demande -->
    <div v-if="modaleVisible" class="modal-backdrop fade show"></div>
    <DemandeModal
      v-if="modaleVisible"
      :demande="demandeSelectionnee"
      affichage="popup"
      @fermer="fermerModal"
      @modifier="modifierDemande"
      @soumettrePiece="soumettrePiece"
      @retirer="retirerDemande" />
  </div>
</template>

<script setup>

import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useDemandeStore } from '@/stores/demandesStore';
import Filters from '@/components/absence/FiltreListeDemandesAbsences.vue';
import ListeDemandesAbsences from '@/components/absence/ListeDemandesAbsences.vue';
import DemandeModal from '@/components/absence/PageDemandeAbsence.vue';
import FormulaireSuiviAbsence from '@/components/absence/FormulaireSuiviAbsence.vue';

const router = useRouter()
const store = useDemandeStore();
const modaleVisible = ref(false);
const demandeSelectionnee = ref(null);

const demandesFiltrees = computed(() => store.demandesFiltrees);

const ouvrirModal = (demande) => {
  demandeSelectionnee.value = demande;
  modaleVisible.value = true;
};

const fermerModal = () => {
  modaleVisible.value = false;
  demandeSelectionnee.value = null;
};

const modifierDemande = (demande) => {
  store.modifierDemande(demande);
  fermerModal();
};

const retirerDemande = (demande) => {
  store.retirerDemande(demande.id);
  fermerModal();
};

const soumettrePiece = () => {
  alert('Pièce justificative soumise.');
};

const filtrerDemandes = (filtres) => {
  store.appliquerFiltres(filtres);
};

// Gestion du tri
const triAbsence = reactive({
  colonne: '',
  ordre: 'asc'
})

function trierAbsencePar(colonne) {
  if (triAbsence.colonne === colonne) {
    triAbsence.ordre = triAbsence.ordre === 'asc' ? 'desc' : 'asc'
  } else {
    triAbsence.colonne = colonne
    triAbsence.ordre = 'asc'
  }
}

const demandesTriees = computed(() => {
  const valides = demandesFiltrees.value.filter(d => d != null)
  if (!triAbsence.colonne) return valides

  return [...valides].sort((a, b) => {
    const valA = a[triAbsence.colonne]
    const valB = b[triAbsence.colonne]

    if (valA == null) return 1
    if (valB == null) return -1

    return triAbsence.ordre === 'asc'
      ? valA > valB ? 1 : -1
      : valA < valB ? 1 : -1
  })
})

const detailsVisible = ref(false)
const demandeEnCours = ref(null)

function voirDetails(demande) {
  demandeEnCours.value = demande
  detailsVisible.value = true
}

function fermerDetails() {
  detailsVisible.value = false
  demandeEnCours.value = null
}

const ouvrirHoraire = () => {
  router.push({ name: 'Horaire' })
}
</script>
