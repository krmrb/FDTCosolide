<template>
  <div class="main-container">
    <div class="mb-3">
      <h3 class="text-primary mt-2">Approbation des demandes de paiements</h3>
    </div>

    <!-- Barre de filtres -->
    <div class="container container-filtre bg-light">
      <div class="row align-items-center">
        <div class="d-flex align-items-center gap-3 ms-2">
          <div class="d-flex align-items-center">
            <h6 class="titre-filtre mb-0 d-flex align-items-center">
              <strong>Filtres</strong>
              <i class="bi bi-funnel ms-1" title="Filtrer"></i>
            </h6>
          </div>

          <button class="btn btn-filtre-auto btn-sm" @click="filtreEtat = 'En attente'">
            Pour approbation <i class="bi bi-binoculars"></i>
          </button>
          <button class="btn btn-filtre-traite btn-sm" @click="filtreEtat = 'Approuvee'">
            Traitée <i class="bi bi-list-check"></i>
          </button>

          <div class="d-flex align-items-center gap-2 ms-2">
            <input v-model="filtreTexte" type="text" class="form-control form-control-sm"
              placeholder="Recherche texte..." />
            <select v-model="filtreChamp" class="form-select form-select-sm">
              <option disabled value="">Champ à filtrer</option>
              <option value="matricule">Matricule</option>
              <option value="nomNaissance">Initiée par</option>
              <option value="emploiCorps">Emploi</option>
              <option value="lieuLabel">Lieu</option>
              <option value="dateDebut">Initiée le</option>
              <option value="motifLabel">Motif</option>
              <option value="etatValidation">État de la demande</option>
            </select>
          </div>

          <div class="btn btn-outline-danger btn-lg d-flex align-items-center gap-1 x-cancel" @click="annulerFiltres">
            <i class="bi bi-x-circle"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau des demandes -->
    <div class="bloc-demandes mt-4">
      <div class="table-wrapper">
        <table class="table-demandes">
          <thead class="">
            <tr>
              <th class="text-middle col-matricule"><i class="bi bi-person-badge-fill me-1 text-primary"></i> Matricule
              </th>
              <th class="text-middle col-date-de"><i class="bi bi-calendar-event me-1 text-primary"></i> Date de
                paiement</th>
              <th class="text-start col-initie"><i class="bi bi-person-circle me-1 text-success"></i> Initiée par</th>
              <th class="text-start col-empl"><i class="bi bi-briefcase-fill me-1 text-success"></i> Emploi</th>
              <th class="text-start col-lieu"><i class="bi bi-geo-alt-fill me-1 text-danger"></i> Lieu</th>
              <th class="text-start col-motif"><i class="bi bi-tag-fill me-1 text-warning"></i> Motif</th>
              <th class="text-start col-etat"><i class="bi bi-info-circle-fill me-1 text-danger"></i> État</th>
              <th class="text-start col-note"><i class="bi bi-sticky-fill me-1 text-info"></i> Note</th>
              <th class="text-middle col-action"><i class="bi bi-gear-fill me-1 text-secondary"></i> Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in demandesFiltrees" :key="item.id" @click="selectionnerDemande(item)"
              :class="['objet-liste', item.id === demandeSelectionnee?.id ? 'selected' : '']">
              <td class="text-middle" :title="item.matricule">{{ item.matricule }}</td>
              <td class="text-middle" :title="item.dateDebut + ' à ' + item.dateFin">
                {{ item.dateDebut }} <span>à {{ item.dateFin }}</span>
              </td>
              <td :title="item.nomNaissance + ' ' + item.prenom">{{ item.nomNaissance }} {{ item.prenom }}</td>
              <td :title="item.emploiCorps + '-' + item.emploiLabel">{{ item.emploiCorps }}-{{ item.emploiLabel }}</td>
              <td class="text-start" :title="item.lieuLabel">{{ item.lieuLabel }}</td>
              <td class="text-start" :title="item.motifLabel">{{ item.motifLabel }}</td>
              <td :title="item.etatValidation">
                <span :class="[badgeClass(item.etatValidation), 'text-middle mt-2']">{{ item.etatValidation }}</span>
              </td>
              <td class="col-note" :title="item.noteApprobation">
                {{ item.noteApprobation.length > 25 ? item.noteApprobation.slice(0, 25) + '...' : item.noteApprobation
                }}
                <i v-if="item.noteApprobation.length > 25" class="bi bi-chat-left-text text-secondary ms-1"></i>
              </td>
              <td class="text-center">
                <div class="action-icons">
                  <i v-if="item.commentaire" :title="item.commentaire"
                    class="bi bi-chat-left-text-fill text-primary me-1"></i>
                  <i v-if="item.commentaire" class="bi bi-paperclip text-primary me-1"></i>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Demande } from '@/types/demande'
import { ValidationStatut, Approbation } from '@/types/demande'

const basePath = import.meta.env.VITE_BASE_PATH;

const filtreEtat = ref('')
const filtreAvanceVisible = ref(false)
const filtreTexte = ref('')
const filtreChamp = ref('')
const evenementsSelectionnes = ref<Demande[]>([])
const demandeSelectionnee = ref<Demande | null>(null)
const emit = defineEmits(['ouvrir-details'])

const toutesDemandes = ref<Demande[]>([])
const demandes = ref<Demande[]>([])

defineProps<{ demandeAfficheeId: string | null }>()

function toggleFiltreAvance() {
  filtreAvanceVisible.value = !filtreAvanceVisible.value
}

function annulerFiltres() {
  filtreEtat.value = ''
  filtreTexte.value = ''
  filtreChamp.value = ''
}


function selectionnerDemande(item: Demande) {
  demandeSelectionnee.value = item
  emit('ouvrir-details', item)
}

const demandesFiltrees = computed(() => {
  let result = demandes.value

  if (filtreEtat.value === 'En attente') {
    // Affiche tout sauf les demandes finalisées
    result = result.filter(d =>
      d.etatValidation !== ValidationStatut.Refuse &&
      d.etatValidation !== ValidationStatut.Annuler &&
      d.etatValidation !== ValidationStatut.Approuver
    )
  } else if (filtreEtat.value === 'Approuvee') {
    // Affiche uniquement les demandes finalisées
    result = result.filter(d =>
      d.etatValidation === ValidationStatut.Refuse ||
      d.etatValidation === ValidationStatut.Annuler ||
      d.etatValidation === ValidationStatut.Approuver
    )
  }

  if (filtreTexte.value && filtreChamp.value) {
    result = result.filter(d => {
      const champValue = String(d[filtreChamp.value as keyof Demande] ?? '').toLowerCase()
      return champValue.includes(filtreTexte.value.toLowerCase())
    })
  }
  console.log('Demandes filtrées :', result.map(d => d.motifLabel))
  return result
})

onMounted(async () => {
  try {
    const response = await fetch(`${basePath}eventPaiement.json`)
    const data: Demande[] = await response.json()

    toutesDemandes.value = data
    demandes.value = data.filter(d => d.etatValidation !== ValidationStatut.EnCreation)

    console.log('Demandes chargées :', data)
  } catch (error) {
    console.error('Erreur lors du chargement des événements :', error)
  }
})

const demandeAfficheeId = ref<number | null>(null)

function badgeClass(etat: string) {
  switch (etat) {
    case ValidationStatut.Refuse:
      return 'badge bg-danger'
    case ValidationStatut.Approuver:
      return 'badge bg-success'
    case ValidationStatut.EnAttente:
      return 'badge bg-warning text-dark'
    case ValidationStatut.Modifié:
      return 'badge  bg-info'
    case ValidationStatut.Annuler:
      return 'badge bg-dark'
    case ValidationStatut.Soumis:
      return 'badge bg-primary'
    default:
      return 'badge bg-secondary'
  }
}


</script>
<style scoped>
/* Conteneur des filtres */
.container-filtre {
  margin-top: 0.5rem;
  border-radius: 0.7rem;
}

/* Bouton d'annulation */
.x-cancel {
  border: 0;
  font-size: 1.5rem;
}

/* Boutons de filtre */
.btn-filtre-auto {
  background: linear-gradient(135deg, #095797, rgba(9, 87, 151, 0.8));
  color: white;
}

.btn-filtre-traite {
  background: linear-gradient(135deg, #107426, #107426A4);
  color: white;
}

/* Tableau */
.table-wrapper {
  max-height: 40rem;
  overflow-y: auto;
  width: 100%;
}

.table-demandes {
  width: 100%;
  min-width: 100%;
  table-layout: fixed;
  color: #095797;
  font-size: 0.875rem;
}

/* En-têtes et cellules */
.table-demandes th,
.table-demandes td {
  padding: 0.6rem 1rem;
  vertical-align: middle;
  border-bottom: 0.1rem solid #09579714;
  border-left: none;
  border-right: none;
  white-space: nowrap;
}

/* En-têtes */
.table-demandes th {
  background-color: #f8f9fa !important;
  color: black;
  font-weight: 600;
  text-align: left;
  border-bottom: 0.1rem solid #095797;
  position: sticky;
  top: 0;
  z-index: 1;
}

/* Cellules */
.table-demandes td {
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(2px);
  border-bottom: 0.1rem solid rgba(9, 87, 151, 0.7);
}


/* Alignements spécifiques */
.table-demandes td.text-start,
.table-demandes th.text-start {
  text-align: left;
}

.table-demandes td.text-middle,
.table-demandes th.text-middle {
  text-align: center;
}

.table-demandes td.text-end,
.table-demandes th.text-end {
  text-align: right;
}

/* Ligne sélectionnée et survol */
.table-demandes tr:hover {
  background-color: #f9f9f9;
  cursor: pointer;
}

.table-demandes tr.selected {
  background-color: #e0f7ff;
}


.table-demandes tr.selected {
  background-color: #d6ecf9 !important;
  border-left: 0.25rem solid #095797;
  box-shadow: inset 0 0 0.2rem rgba(9, 87, 151, 0.3);
  transition: background-color 0.2s ease;
}

.col-matricule {
  width: 10rem;
}

.col-note {
  width: 15rem;
  padding-left: 0rem !important;
}

.col-date-de {
  width: 15rem;
}

.col-motif {
  width: 15rem;
}

.col-etat {
  width: 12rem;
}



/* Icônes et actions */
.action-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0.5rem;
}

.label-action {
  white-space: nowrap;
}

.action-icons {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  white-space: nowrap;
}

/* Bloc des demandes */
.bloc-demandes {
  background-color: #fff;
  max-height: 41.5rem;
  overflow-y: auto;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  border-bottom: 0.1rem solid #095797;
}

/* Styles des événements */
.event-maladie {
  border-left: 0.15rem solid rgba(255, 165, 0, 1);
}

.event-vacances {
  border-left: 0.15rem solid rgba(144, 238, 144, 1);
}

.event-personnel {
  border-left: 0.15rem solid rgba(224, 176, 255, 1);
}

.event-paiement {
  border-left: 0.15rem solid rgba(173, 216, 230, 1);
}

.eventText-maladie {
  color: rgb(224, 148, 6);
  font-weight: bold;
}

.eventText-vacances {
  color: rgb(76, 150, 76);
  font-weight: bold;
}

.eventText-personnel {
  color: rgb(117, 76, 145);
  font-weight: bold;
}

.eventText-paiement {
  color: rgb(76, 164, 194);
  font-weight: bold;
}
</style>
