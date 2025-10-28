<template>
  <!--<div class="container mt-4">-->
  <main class="main-content bg-white flex-column flex-fill p-3 p-sm-5 pt-sm-3 min-vh-100">
    <h3 class="mb-4 text-primary mt-2">Suivi de mes demandes de paiement</h3>
    <div class="d-flex justify-content-start mb-3">
        <button class="btn btn-primary mb-3" @click="ouvrirPopup">Nouvelle demande de paiement ...</button>
    </div>

        <DemandePaiementModal
      v-if="popupVisible"
      :demande="demandeEnCours"
      @fermer="popupVisible = false"
      @soumettre="ajouterDemande"
      @retirer="retirerDemande" />

    <!-- Modal pour les détails -->
    <div v-if="detailsVisible" class="modal-backdrop fade show"></div>
    <div v-if="detailsVisible" class="modal d-block" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0">
            <button type="button" class="btn-close" @click="fermerDetails" aria-label="Fermer"></button>
          </div>
          <div class="modal-body">
            <FormulaireSuiviPaiements 
              :demande="demandeEnCours" 
              @fermer="fermerDetails" 
            />
          </div>
        </div>
      </div>
    </div>

    <DemandePaiementFilters  @filtrer="appliquerFiltres" />
    <div class="table-responsive">
      <table class="table table-hover">
        <thead class="table-light">
          <tr>
            <th @click="trierPar('dateDemande')" style="cursor: pointer">
              <span style="white-space: nowrap;">
                <i class="bi bi-calendar-range text-success"></i> Date de paiement
                <i :class="getIcon('dateDemande')"></i>
              </span>
            </th>

            <th @click="trierPar('demandePar')" style="cursor: pointer">
              <span style="white-space: nowrap;">
                <i class="bi bi-person-circle text-success" title="Initiée par"></i> Initiée par
                <i :class="getIcon('demandePar')"></i>
              </span>
            </th>

            <th @click="trierPar('demandeLe')" style="cursor: pointer">
              <span style="white-space: nowrap;">
                <i class="bi bi-calendar-event text-primary" title="Initiée le"></i> Initiée le
                <i :class="getIcon('demandeLe')"></i>
              </span>
            </th>
            <th @click="trierPar('corpsEmploi')" style="cursor: pointer">
              <span style="white-space: nowrap;"><i class="bi bi-briefcase text-success"></i> Emploi
              <i :class="getIcon('corpsEmploi')"></i></span>
            </th>
            <th @click="trierPar('lieuTravail')" style="cursor: pointer">
              <span style="white-space: nowrap;"><i class="bi bi-geo-alt text-success"></i> Lieu de travail
              <i :class="getIcon('lieuTravail')"></i></span>
            </th>
            <th @click="trierPar('typePaiement')" style="cursor: pointer">
              <span style="white-space: nowrap;"><i class="bi bi-cash-stack text-success"></i> Type de paiement
              <i :class="getIcon('typePaiement')"></i></span>
            </th>
            <!--<th>Commentaires</th>-->
            <th @click="trierPar('etat')" style="cursor: pointer">
              <i class="bi bi-info-circle text-danger"></i> État
              <i :class="getIcon('etat')"></i>
            </th>
            <th><i class="bi bi-sticky text-info" title="Note"></i> Notes</th>
            <th><i class="bi bi-gear text-secondary"></i> Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="demande in demandesPaginees" :key="demande.id">
            <td>
              <span style="white-space: nowrap;">{{ demande.dateDemande }}</span><br />
              <span style="white-space: nowrap;">De {{ demande.heureDebut }} à {{ demande.heureFin }}</span>
            </td>
            <td><span style="white-space: nowrap">{{ demande.demandePar }}</span></td>
            <td><span style="white-space: nowrap">{{ formatDateLong(demande.demandeLe) }}</span></td>
            <td>{{ demande.corpsEmploi }}</td>
            <td>{{ demande.lieuTravail }}</td>
            <td>{{ demande.typePaiement }}</td>
            <!--
            <td>
              <button class="btn btn-link p-0" @click.stop="afficherCommentaire($event, demande.noteDemande)">
                <i class="bi bi-chat-left-text text-primary" title="Voir le commentaire"></i>
              </button>
            </td>
            -->
            <td>
              <span :class="['badge', getEtatColor(demande.etat)]">{{ demande.etat }}</span>
            </td>


            <td v-if="demande.noteApprobation && demande.noteApprobation.trim() !== ''">
              {{ demande.noteApprobation.slice(0, 25) + '...' }}
              <button class="btn btn-link p-0" @click.stop="afficherCommentaire($event, demande.noteApprobation)">
                <i class="bi bi-chat-left-text text-primary" title="Voir le commentaire"></i>
              </button>
            </td>
            <td v-else></td>


            <td>
              <span style="white-space: nowrap;">
                <button v-if="demande.etat !== 'Brouillon'" class="btn btn-sm" @click="voirDetails(demande)">
                  <i class="bi-eye text-secondary" title="Voir les détails"></i>
                </button>
                <button v-if="estModifiable(demande)" class="btn btn-sm" @click="ouvrirPopup(demande)">
                  <i class="bi-pencil-square text-secondary" title="Modifier"></i>
                </button>
                <button v-if="estRetirable(demande)" class="btn btn-sm" @click="retirerDemande(demande.id)" title="Supprimer">
                  <i class="bi bi-trash text-secondary"></i>
                </button>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <nav class="w-80 mx-auto" aria-label="Pagination">
        <ul class="pagination justify-content-center mt-0">
            <li class="page-item disabled"><a class="page-link" hrefclass="page-item"><<</a></li>
            <li class="page-item">&nbsp;&nbsp;</li>
            <li class="page-item disabled"><a class="page-link" hrefclass="page-item">Précédent</a></li>
            <li class="page-item">&nbsp;&nbsp;&nbsp;&nbsp;</li>
            <li class="page-item"><a class="page-link" hrefclass="page-item">1</a></li>
            <li class="page-item"><a class="page-link" hrefclass="page-item">2</a></li>
            <li class="page-item"><a class="page-link" hrefclass="page-item">3</a></li>
            <li class="page-item active"><a class="page-link" hrefclass="page-item">4</a></li>
            <li class="page-item"><a class="page-link" hrefclass="page-item">5</a></li>
            <li class="page-item"><a class="page-link" hrefclass="page-item">6</a></li>
            <li class="page-item"><a class="page-link" hrefclass="page-item">7</a></li>
            <li class="page-item">&nbsp;&nbsp;&nbsp;&nbsp;</li><li class="page-item">
              <a class="page-link" hrefclass="page-item">Suivant</a>
            </li>
            <li class="page-item">&nbsp;&nbsp;</li>
            <li class="page-item"><a class="page-link" hrefclass="page-item">>></a></li>
        </ul>
      </nav>
    </div>
  </main>
  <div
    v-if="commentaireVisible"
    class="commentaire-popover position-absolute bg-white border rounded shadow p-3"
    :style="{ top: position.top + 'px', left: position.left + 'px', zIndex: 1000, maxWidth: '300px' }">
    
    <div style="white-space: pre-wrap;">{{ commentaireActuel }}</div>
  </div>
</template>

<script setup>
const emit = defineEmits(['personaSelected'])

import { ref, computed, reactive, onMounted, onBeforeUnmount } from 'vue'
import DemandePaiementModal from '@/components/paiement/DemandePaiementModal.vue'
import FormulaireSuiviPaiements from '@/components/paiement/FormulaireSuiviPaiements.vue'

const detailsVisible = ref(false)

// Tri
const tri = reactive({
  colonne: '',
  ordre: 'asc'
})

function trierPar(colonne) {
  if (tri.colonne === colonne) {
    tri.ordre = tri.ordre === 'asc' ? 'desc' : 'asc'
  } else {
    tri.colonne = colonne
    tri.ordre = 'asc'
  }
}

function getIcon(colonne) {
  if (tri.colonne !== colonne) return 'bi bi-arrow-down-up'
  return tri.ordre === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'
}

// Liste triée
const demandesTriees = computed(() => {
  const valides = demandes.value.filter(d => d != null)
  if (!tri.colonne) return valides

  return [...valides].sort((a, b) => {
    const valA = a[tri.colonne]
    const valB = b[tri.colonne]

    if (valA == null) return 1
    if (valB == null) return -1

    return tri.ordre === 'asc'
      ? valA > valB ? 1 : -1
      : valA < valB ? 1 : -1
  })
})


function ajouterDemande(nouvelleDemande) {
  if (nouvelleDemande && nouvelleDemande.dateDemande) {
    store.ajouterDemande(new DemandePaiement(nouvelleDemande))

  }
  popupVisible.value = false
}
const popupVisible = ref(false)
const demandeEnCours = ref(null)

function ouvrirPopup(demande = null) {

  if (demande) {
    // Mode modification : copie défensive
    demandeEnCours.value = { ...demande }
  } else {
    // Mode création
    demandeEnCours.value = {
      matricule: '123456',
      corpsEmploi: '',
      lieuTravail: '',
      dateDemande: '',
      heureDebut: '',
      heureFin: '',
      typePaiement: '',
      commentaire: '',
      demandeLe: new Date().toISOString()
    }
  }

  demandeEnCours.value = demande
  popupVisible.value = true
}

import { useDemandePaiementStore } from '@/stores/demandePaiementStore'

import DemandePaiementFilters from '@/components/paiement/DemandePaiementFilters.vue'

function appliquerFiltres({ etat, recherche, periode }) {
  store.appliquerFiltres({ etat, recherche, periode })
}

const store = useDemandePaiementStore()
const demandes = computed(() => store.demandes)


function isCorpsEmploiEducatif(code) {
  return code && code.startsWith('3')
}

function estModifiable(demande) {
  return ['Brouillon', 'Modifié'].includes(demande.etat)
}

function estRetirable(demande) {
  return ['Brouillon', 'Soumis', 'Modifié'].includes(demande.etat)
}

function voirDetails(demande) {
  demandeEnCours.value = { ...demande }
  detailsVisible.value = true
}

function fermerDetails() {
  detailsVisible.value = false
  demandeEnCours.value = null
}

const getEtatColor = (etat) => {
  switch (etat) {
    case 'Brouillon': return 'bg-secondary';
    case 'Soumis': return 'bg-primary';
    case 'En attente d\'approbation': return 'bg-warning';
    case 'Modifié': return 'bg-info';
    case 'Traitée': return 'bg-success';
    case 'En attente d\'une pièce justificative': return 'bg-warning';
    case 'Annulé': return 'bg-danger';
    case 'Refusé': return 'bg-danger text-white';
    default: return 'bg-light';
  }
};

const pageActuelle = ref(1)
const lignesParPage = ref(5)

const totalPages = computed(() => {
  return Math.ceil(demandesTriees.value.length / lignesParPage.value)
})
function formatDateLong(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}
const demandesPaginees = computed(() => {
  const start = (pageActuelle.value - 1) * lignesParPage.value
  const end = start + lignesParPage.value
  return demandesTriees.value.slice(start, end)
})

function changerPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    pageActuelle.value = page
  }
}

const commentaireActuel = ref('')
const commentaireVisible = ref(false)
const position = ref({ top: 0, left: 0 })

function afficherCommentaire(event, commentaire) {
  if (!event?.target) return

  commentaireActuel.value = commentaire
  commentaireVisible.value = true

  const rect = event.target.getBoundingClientRect()
  position.value = {
    top: rect.bottom + window.scrollY + 8,
    left: rect.left + window.scrollX
  }
}

function fermerCommentaire() {
  commentaireVisible.value = false
}

function handleClickOutside(event) {
  if (!event.target.closest('.commentaire-popover')) {
    fermerCommentaire()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.table th, .table td {
  vertical-align: middle;
}

.container-large {
  max-width: 90%; /* ou 95% selon ton besoin */
}

.page-full-height {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.commentaire-popover {
  transition: opacity 0.2s ease;
}
</style>
