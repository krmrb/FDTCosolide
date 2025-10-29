<template>
  <div class="main-container">
    <div class="mb-3">
      <h3 class="text-primary mt-2">Approbation des demandes de paiement</h3>
    </div>
    <div class="ms-2">
      <div class="row g-2 align-items-end">
        <!-- Période -->
        <div class="col-md-2">
          <label class="form-label"><strong>De</strong></label>

          <input type="date" class="form-control filtre-input" />


        </div>
        <div class="col-md-2">
          <label class="form-label"><strong>À</strong></label>
          <input type="date" class="form-control filtre-input" />
        </div>

        <!-- État -->
        <div class="col-md-2">
          <label class="form-label"><strong>État</strong></label>
              <select class="form-select filtre-input" >
            <option value=""></option>
            <option v-for="etat in statutOptions" :key="etat.code" :value="etat.code">
              {{ etat.label }}
            </option>
          </select>
        </div>

        <!-- type -->
        <div class="col-md-2">
          <label class="form-label"><strong>Type</strong></label>
          <select class="form-select filtre-input">
            <option value=""></option>
            <option v-for="type in typesPaiement" :key="type.typeLabel" :value="type.typeCode">
              {{ type.typeCode }} - {{ type.typeLabel }}
            </option>
          </select>
        </div>

        <!-- Initiée par -->
        <div class="col-md-2">
          <label class="form-label"><strong>Initié par</strong></label>
          <!--<input type="text" class="form-control" v-model="filters.initiePar" placeholder="Nom ou code utilisateur" />-->
          <input type="text" class="form-control filtre-input" list="initiateurs" placeholder="Nom ou code utilisateur" />

          <datalist id="initiateurs">
            <option value="Jean Martin" />
            <option value="Sophie Tremblay" />
            <option value="Marc Lavoie" />
            <option value="Julie Roy" />
          </datalist>
        </div>

        <!-- Bouton Filtrer -->
        <div class="col-md-2">
          <button class="btn btn-primary w-55" @click="">
            <i class="bi bi-funnel me-1 text-light"></i> Filtrer
          </button>
        </div>
      </div>
    </div>

    <!-- Tableau des demandes -->
    <div class="bloc-demandes mt-4">
      <div class="table-wrapper">
        <table class="table-demandes">
          <thead class="">
            <tr>
              <th class="text-middle col-checkbox">
                <input type="checkbox" v-model="selectAll" @change="toggleAll" />
              </th>
              <th class="text-middle col-matricule"><i class="bi bi-person-badge-fill me-1 text-primary"></i> Matricule
              </th>
              <th class="text-start col-nom"><i class="bi bi-person-circle me-1 text-success"></i> Employé</th>
              <th class="text-middle col-date-de"><i class="bi bi-calendar-event me-1 text-primary"></i> Date d'absence
              </th>
              <th class="text-start col-nom"><i class="bi bi-person-circle me-1 text-success"></i> Initié par</th>
              <th class="text-start col-empl"><i class="bi bi-briefcase-fill me-1 text-success"></i> Emploi</th>
              <th class="text-start col-lieu"><i class="bi bi-geo-alt-fill me-1 text-danger"></i> Lieu de travail</th>
              <th class="text-start col-motif"><i class="bi bi-tag-fill me-1 text-warning"></i> Type</th>
              <th class="text-start col-etat"><i class="bi bi-info-circle-fill me-1 text-danger"></i> État</th>
              <th class="text-start col-note"><i class="bi bi-sticky-fill me-1 text-info"></i> Note</th>
              <th class="text-start col-action"><i class="bi bi-gear-fill me-1 text-secondary"></i> Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in demandesFiltrees" :key="item.id" @click="selectionnerDemande(item)"
              :class="['objet-liste', item.id === demandeSelectionnee?.id ? 'selected' : '']">
              <td class="text-middle col-checkbox">
                <input type="checkbox" v-model="item.selectionne" />
              </td>
              <td class="text-middle col-matricule " :title="item.matricule">{{ item.matricule }}</td>
              <td :title="item.nomNaissance + ' ' + item.prenom">{{ item.nomNaissance }} {{ item.prenom }}</td>
              <td class="text-middle col-date-de" :title="item.dateDebut + ' à ' + item.dateFin">
                {{ item.dateDebut }} <span>à {{ item.dateFin }}</span>
              </td>
              <td :title="item.nomNaissance + ' ' + item.prenom">{{ item.nomNaissance }} {{ item.prenom }}</td>
              <td :title="item.emploiCorps + '-' + item.emploiLabel">{{ item.emploiCorps }}-{{ item.emploiLabel }}</td>
              <td class="text-middle col-lieu" :title="item.lieuLabel"><span></span>{{ item.lieuLabel }}</td>
              <td class="text-start col-motif" :title="item.motifLabel">{{ item.motifLabel }}</td>
              <td :title="item.etatValidation" class="col-etat">
                <span :class="[badgeClass(item.etatValidation), 'text-middle mt-2']"> {{ item.etatValidation }}</span>
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
    <div class="mt-2">
      <button type="button" class="badge btn btn-success btn-sm me-2">
        Approuver la sélection
      </button>

      <button type="button" class="badge btn btn-danger btn-sm">
        Refuser la sélection
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Demande } from '@/types/demande'
import { ValidationStatut, Approbation } from '@/types/demande'
import typePaiementData from '@/types/typePaiement.json';

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

const statutOptions = Object.entries(ValidationStatut).map(([key, value]) => ({
  code: key,
  label: value
}))

const typesPaiement = typePaiementData.typePaiement.map((obj: { code: any; description: any }) => ({
  typeCode: obj.code,
  typeLabel: obj.description
})); 

onMounted(async () => {
  try {
    const response = await fetch(`${basePath}eventPaiement.json`)
    const rawData = await response.json()

    // Vérifie que rawData est bien un tableau
    if (Array.isArray(rawData)) {
      const typedData: Demande[] = rawData.map(d => ({
        ...d,
        selectionne: false // Ajout de la propriété pour le toggle
      }))

      toutesDemandes.value = typedData
      demandes.value = typedData.filter(d => d.etatValidation !== ValidationStatut.EnCreation)

      console.log('Demandes chargées :', typedData)
    } else {
      console.error('Les données reçues ne sont pas un tableau :', rawData)
    }
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
const selectAll = ref(false)

function toggleAll() {
  const liste = Array.isArray(demandesFiltrees) ? demandesFiltrees : demandesFiltrees.value
  liste.forEach(item => {
    item.selectionne = selectAll.value
  }) 
} 
</script>
<style scoped>
.container-filtre {
  margin-top: 0.5rem;
  border-radius: 0.7rem;
}

.filtre-input{
  padding: 0.1rem 0.3rem;
  font-size: 0.95rem;
  border: 0.1rem solid #ccc;
  border-radius: 0.5rem;
  width: 100%;
}
 
.x-cancel {
  border: 0;
  font-size: 1.5rem;
}
 
.btn-filtre-auto {
  background: linear-gradient(135deg, #095797, rgba(9, 87, 151, 0.8));
  color: white;
}

.btn-filtre-traite {
  background: linear-gradient(135deg, #107426, #107426A4);
  color: white;
}
 
.table-wrapper {
  max-height: 37rem;
  overflow-y: auto;
  width: 100%;
}

.table-demandes {
  width: 100%;
  min-width: 100%;
  table-layout: fixed;
  font-size: 0.875rem;
}
 
.table-demandes th,
.table-demandes td {
  padding: 0.6rem 0.75rem;
  vertical-align: middle;
  border-bottom: 0.1rem solid #09579714;
  border-left: none;
  border-right: none;
  white-space: nowrap;
}

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
 
.table-demandes td {
  background-color: rgba(255, 255, 255, 0.6); 
  border-bottom: 0.1rem solid rgba(9, 87, 151, 0.7);
}

 
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

.col-checkbox {
  width: 1.7rem;
}

.col-nom {
  width: 8rem;
}

.col-matricule {
  width: 7rem;
}

.col-note {
  width: 11.5rem;
  padding-left: 0rem !important;
}

.col-empl {
  width: 12.5rem;
}

.col-lieu {
  width: 8rem;
}

.col-date-de {
  width: 11rem;
}

.col-motif {
  width: 12rem;
}

.col-etat {
  width: 10rem;
}

.item-etat {
  width: 6rem;
}
 
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
 
.bloc-demandes {
  background-color: #fff;
  max-height: 41.5rem;
  overflow-y: auto;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  border-bottom: 0.1rem solid #095797;
}
 
.badge {
  white-space: normal;
  word-break: break-word;
  display: inline-block;
  text-align: left;
  max-width: 80%;  
 line-height: 1.2;
}

</style>
