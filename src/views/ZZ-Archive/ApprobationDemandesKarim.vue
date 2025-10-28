<template>
  <main class="flex-fill d-flex flex-column min-vh-100">
    <div class="container bg-white flex-column flex-fill p-3 p-sm-5 px-sm-5 pt-sm-3">
      <h2>Approbation des demandes d'absences</h2>


      <div class="container-fluid py-4">

        <!-- Filtres -->
        <div class="row mb-3">
          <div class="col-md-6">
  <label class="form-label"><strong>Lieu de travail</strong></label>
  <div class="dropdown-multi position-relative">
    <button class="form-select text-start d-flex justify-content-between align-items-center" @click="toggleLieuDropdown">
      <span>{{ filtreLieu.length > 0 ? filtreLieu.join(', ') : 'Tous les lieux' }}</span>
    </button>

    <div v-if="lieuDropdownOuvert" class="position-absolute bg-white border rounded shadow-sm mt-1 p-2 w-100" style="z-index: 1000;">
      <div v-for="lieu in lieux" :key="lieu" class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          :id="lieu"
          :value="lieu"
          v-model="filtreLieu"
        />
        <label class="form-check-label" :for="lieu">{{ lieu }}</label>
      </div>
    </div>
  </div>
</div>

          <div class="col-md-6">
            <label class="form-label"><strong>Statut</strong></label>
            <div class="dropdown-multi position-relative">
              <button class="form-select text-start" @click="toggleDropdown">
              

                {{ filtreStatut.length > 0 ? filtreStatut.join(', ') : 'Tous les statuts' }}
              </button>

              <div v-if="dropdownOuvert" class="position-absolute bg-white border rounded shadow-sm mt-1 p-2 w-100" style="z-index: 1000;">
                <div v-for="statut in statutsDisponibles" :key="statut" class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="statut"
                    :value="statut"
                    v-model="filtreStatut"
                  />
                  <label class="form-check-label" :for="statut">{{ statut }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tableau -->

<br> 
<div class="d-flex justify-content-between align-items-center mb-3">
  <!-- Titre à gauche -->
  <h5 class="mb-0">Liste des demandes d'absence reçues :</h5>

  <!-- Zone de recherche à droite -->
  <div class="d-flex align-items-center">
    <input type="text" class="form-control me-2" placeholder="Rechercher une demande..." style="width: 250px;" />
    <button class="btn btn-outline-secondary">
      <i class="bi bi-search"></i>
    </button>
  </div>
</div>


        <div class="table-wrapper position-relative">

<!-- Message local -->
<transition name="fade">
    <div v-if="message" class="message-overlay alert alert-info">
      {{ message }}
    </div>
  </transition>



        <table class="table table-striped table-bordered w-100">
          <thead class="table-light">
            <tr>
              <th><input type="checkbox" @change="toggleAll($event)" /></th>
              <th>Matricule</th>
              <th>Employé(e)</th>
              <th>Emploi</th>
              <th>Date & Heure</th>
              <th>Initiée par</th>
              <th>Motif</th>
              <th>Solde</th>
              <th>Note</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="demande in demandesFiltrées" :key="demande.id">
              <td><input type="checkbox" v-model="demande.selectionnee" /></td>
              <td>{{ demande.matricule }}</td>
              <td>{{ demande.nom }} {{ demande.prenom }}</td>
              <td><nobr>{{ demande.emploi }}</nobr></td>
              <td><nobr>{{ demande.dateDemande }}</nobr></td>
              <td>{{ demande.initiateur }}</td>
              <td>{{ demande.motif }}</td>
              <td>{{ demande.solde }} j</td>
              <td @click="afficherDemande(demande)" style="cursor: pointer;">
                <i class="bi bi-eye text-secondary" title="À lire"></i>
              </td>
              <td :class="getStatutClass(demande.statut)">
                {{ demande.statut }}
              </td>
            </tr>

            <tr>
            <td colspan="10">
            <nav class="w-80 mx-auto" aria-label="Pagination">
            <ul class="pagination justify-content-center mt-0">
                <li class="page-item disabled">
                <a class="page-link" hrefclass="page-item"><<</a>
                </li>
                <li class="page-item">&nbsp;&nbsp;</li>
                <li class="page-item disabled">
                <a class="page-link" hrefclass="page-item"><</a>
                </li>
                <li class="page-item">&nbsp;&nbsp;&nbsp;&nbsp;</li>
                <li class="page-item">
                <a class="page-link" hrefclass="page-item">1</a>
                </li>
                <li class="page-item">
                <a class="page-link" hrefclass="page-item">2</a>
                </li>
                <li class="page-item">
                <a class="page-link" hrefclass="page-item">3</a>
                </li>
                <li class="page-item active">
                <a class="page-link" hrefclass="page-item">4</a>
                </li>
                <li class="page-item">
                <a class="page-link" hrefclass="page-item">5</a>
                </li>
                <li class="page-item">
                <a class="page-link" hrefclass="page-item">6</a>
                </li>
                <li class="page-item">
                <a class="page-link" hrefclass="page-item">7</a>
                </li>
                <li class="page-item">&nbsp;&nbsp;&nbsp;&nbsp;</li>
                <li class="page-item">
                <a class="page-link" hrefclass="page-item">></a>
                </li>
                <li class="page-item">&nbsp;&nbsp;</li>
                <li class="page-item">
                <a class="page-link" hrefclass="page-item">>></a>
                </li>
            </ul>
        </nav>
            </td>
            </tr>
          </tbody>
        </table>
</div>

        

        <!-- Boutons d'action -->
        <div class="d-flex justify-content-end gap-2 mt-3">
            <button class="btn btn-secondary" @click="traiterSelection('Annulée')">Annuler</button>
            <button class="btn btn-primary" @click="traiterSelection('Acceptée')">Accepter</button>
            <button class="btn btn-warning" @click="traiterSelection('En attente de pièce')">Mettre en attente d'une pièce justificative</button>
            <button class="btn btn-danger" @click="traiterSelection('Refusée')">Refuser</button>
        </div>

        

        <PopupNote :note="noteActive" :visible="noteVisible" @close="noteVisible = false" />
        <PopupDemande :demande="demandeActive" :visible="popupVisible" @close="popupVisible = false" />
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import PopupNote from '@/views/PopupNoteKarim.vue'
import PopupDemande from '@/views/PopupDemandeKarim.vue'

const lieux = ['École A', 'École B', 'École C']
const filtreLieu = ref([]) 
const filtreStatut = ref([])

const statutsDisponibles = ['En attente', 'Acceptée', 'Refusée', 'Annulée']
const dropdownOuvert = ref(false)

function toggleDropdown() {
  dropdownOuvert.value = !dropdownOuvert.value
}

function fermerDropdown(event) {
  if (!event.target.closest('.dropdown-multi')) {
    dropdownOuvert.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', fermerDropdown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', fermerDropdown)
})

const demandes = ref([
  {
    id: 1,
    matricule: '654321',
    nom: 'Alice',
    prenom: 'Dupont',
    emploi: '001-Enseignant',
    dateDemande: '2025-10-08 14:30',
    initiateur: 'Employé',
    motif: 'Maladie',
    solde: 5,
    note: 'Ut gravida nunc vel purus maximus sodales...',
    statut: 'En attente',
    lieuTravail: 'École A',
    selectionnee: false
  },
  {
    id: 2,
    matricule: '123456',
    nom: 'Jean',
    prenom: 'Martin',
    emploi: '002-Technicien',
    dateDemande: '2025-10-08 09:15',
    initiateur: 'Secrétaire',
    motif: 'Congé personnel',
    solde: 5,
    note: 'Phasellus consequat velit sed mauris lobortis...',
    statut: 'En attente',
    lieuTravail: 'École B',
    selectionnee: false
  },
  {
    id: 3,
    matricule: '123456',
    nom: 'John',
    prenom: 'Smith',
    emploi: '002-Technicien',
    dateDemande: '2025-10-09 09:15',
    initiateur: 'Secrétaire',
    motif: 'Congé personnel',
    solde: 5,
    note: 'Phasellus consequat velit sed mauris lobortis...',
    statut: 'Annulée',
    lieuTravail: 'École B',
    selectionnee: false
  }
])


const lieuDropdownOuvert = ref(false)

function toggleLieuDropdown() {
  lieuDropdownOuvert.value = !lieuDropdownOuvert.value
}

const demandesFiltrées = computed(() =>
  demandes.value.filter(d =>
    (filtreLieu.value.length === 0 || filtreLieu.value.includes(d.lieuTravail)) &&
    (filtreStatut.value.length === 0 || filtreStatut.value.includes(d.statut))
  )
)





function toggleAll(event) {
  const checked = event.target.checked
  demandesFiltrées.value.forEach(d => d.selectionnee = checked)
}

function getStatutClass(statut) {
  switch (statut) {
    case 'Approuvée':
    case 'Acceptée':
      return 'text-success'
    case 'Refusée':
      return 'text-danger'
    case 'Annulée':
      return 'text-secondary'
    case 'En attente':
    case 'En attente de pièce':
      return 'text-warning'
    default:
      return ''
  }
}

const message = ref('')

function traiterSelection(nouveauStatut) {
  const selection = demandesFiltrées.value.filter(d => d.selectionnee)
  if (selection.length === 0) {
    message.value = 'Aucune demande sélectionnée.'
    setTimeout(() => {
    message.value = ''
  }, 2000)
    return
  }

  selection.forEach(d => {
    d.statut = nouveauStatut
    d.selectionnee = false
  })

  message.value = `${selection.length} demande(s) mises à jour en "${nouveauStatut}".`

  setTimeout(() => {
    message.value = ''
  }, 2000)
}

const noteVisible = ref(false)
const noteActive = ref('')
function afficherNote(note) {
  noteActive.value = note
  noteVisible.value = true
}

const demandeActive = ref(null)
const popupVisible = ref(false)

function afficherDemande(demande) {
  demandeActive.value = demande
  popupVisible.value = true
}
</script>

<style scoped>
.table td, .table th {
  vertical-align: middle;
}

.dropdown-multi {
  position: relative;
}

.dropdown-multi .form-check {
  padding: 4px 8px;
}

.dropdown-multi {
  position: relative;
}

.dropdown-multi .position-absolute {
  left: 0;
  right: 0;
}

.dropdown-multi .form-check {
  padding: 4px 8px;
}


.dropdown-multi .form-check {
  display: flex;
  align-items: center;
  padding: 4px 8px;
}

.dropdown-multi .form-check-input {
  margin-left: 0;
  margin-right: 8px;
}


.dropdown-multi {
  position: relative;
}

.dropdown-multi .position-absolute {
  left: 0;
  right: 0;
}

.dropdown-multi .form-check {
  display: flex;
  align-items: center;
  padding: 4px 8px;
}

.dropdown-multi .form-check-input {
  margin-left: 0;
  margin-right: 8px;
}

.table-wrapper {
  position: relative;
}




.message-overlay {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 400px; /* largeur fixe */
  text-align: center;
  z-index: 10;
}
</style>
