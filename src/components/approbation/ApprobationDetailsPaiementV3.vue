<template>
  <div class="ma-container">
    <div class="titre-detail mb-3 d-flex align-items-center p-1">
      <h4 class="ms-2">Approbation - {{ form.motifLabel || 'Motif inconnu' }}</h4>
      <button type="button" class="btn btn-link text-danger" @click="$emit('fermer')">
        <i class="bi bi bi-x-circle-fill x-circle"></i>
      </button>
    </div>
    <!-- Boutons -->
    <div class="mt-1">
      <button type="button" class="btn btn-success btn-sm me-2">
        <strong>Approuver</strong>
      </button>
      <button type="button" class="btn btn-link btn-sm text-danger text-decoration-underline" @click="$emit('fermer')">
        Annuler
      </button>
    </div>

    <div class="container approbateur p-4">
      <div class=" mb-3">
        <label for="niveau1validation" class="mb-2">État d'approbation</label>
        <select id="niveau1validation" v-model="form.niveau1validation" class="champ">
          <option v-for="option in approbationOptions" :key="option.key" :value="option.label">
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Note approbation -->
      <div class="">
        <label class="mb-2">Note d'approbation</label>
        <textarea v-model="form.noteApprobation" rows="3" class="champ"
          placeholder="Ajouter une note ici..."></textarea>
      </div>

      <div class="">
        <label class="mb-2 mt-1 historique-notes" @click="toggleHistory">Historique des notes
          <span class="ms-2">
            <i :class="isHistoryOpen ? 'bi bi-chevron-compact-up' : 'bi bi-chevron-compact-down'"></i>
          </span></label>
        <div v-if="isHistoryOpen" class="ms-2 bg-light">
          <p>Un message | date</p>
          <p>Un message 2 | date</p>
          <p>Un message 3 | date</p>
        </div>
      </div>

      <!-- Pièce jointe -->
      <label class="mb-2">Pièces jointes</label>
      <div class="piece-jointe d-flex align-items-center gap-2 p-2 border rounded mt-1">
        <i class="bi bi-paperclip fs-5 text-primary"></i>
        <span class="nom-fichier">justificatif_EmployerX.pdf</span>
        <button class="btn btn-sm btn-outline-secondary" @click="">
          <i class="bi bi-download"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" @click="">
          <i class="bi bi-trash"></i>
        </button>
      </div>

    </div>
    <p class="titre-detail fs-5"><strong class="ms-2">Détails</strong></p>
    <div class="formulaire-contenant">


      <!-- Période demandée -->
      <div class="div-soustitre-detail bg-light m-1">
        <p class="soustitre-detail">Date</p>
      </div>

      <div class="ligne-formulaire">
        <label>Création </label>
        <input class="champ" type="date" :value="form.dateCreation" disabled />
      </div>
      <div class="ligne-formulaire">
        <label>Début </label>
        <input type="date" v-model="form.dateDebut" class="champ me-2" />
        <label>Fin </label>
        <input type="date" v-model="form.dateFin" :class="['champ', { 'is-invalid': !isDateRangeValid }]" />
      </div>
      <div class="div-soustitre-detail bg-light m-1">
        <p class="soustitre-detail">Heure</p>
      </div>
      <div class="ligne-formulaire">
        <label>Début </label>
        <input type="time" v-model="form.de" class="champ me-2" />
        <label>Fin </label>
        <input type="time" v-model="form.a" class="champ" />
      </div>
      <div v-if="!isDateRangeValid" class="alert-message">
        ⚠️ La date de fin ne peut pas être antérieure à la date de début.
      </div>
      <div class="ligne-formulaire">
        <label>Minutes tâches éducatives</label>
        <input type="number" id="minutes-educatives" name="minutes-educatives" min="0" max="1440" step="1"
          class="champ ms-5 form-control" :value="''" />
      </div>
      <div class="ligne-formulaire">
        <label>Minutes tâche autres</label>
        <input type="number" id="minutes-educatives" name="minutes-educatives" min="0" max="1440" step="1"
          class="champ ms-5 form-control" :value="''" />
      </div>
      <hr />

      <!-- Informations générales -->
      <div class="div-soustitre-detail bg-light m-1">
        <p class="soustitre-detail">Identification</p>
      </div>
      <div class="ligne-formulaire">
        <label>Matricule</label>
        <input class="champ" :value="form.matricule" readonly />
      </div>
      <div class="ligne-formulaire">
        <label>Initiée par </label>
        <input class="champ" :value="form.nomNaissance + ' ' + form.prenom" readonly />
      </div>
      <div class="ligne-formulaire">
        <label>État demande</label>
        <input class="champ" :value="form.etatValidation" readonly />
      </div>
      <div class="ligne-formulaire">
        <label>Matricule remplacé</label>
        <input class="champ" :value="form.matricule" />
      </div>
      <!-- Commentaire -->
      <div class="ligne-formulaire">
        <label>Commentaire</label>
        <textarea v-model="form.commentaire" rows="3" class="champ"
          placeholder="Ajouter un commentaire ici..."></textarea>
      </div>
      <div class="ligne-formulaire-commentaire">
        <label class="mb-2 mt-1  historique-notes" @click="toggleHistory">Historique des commentaires
          <span class="ms-2">
            <i :class="isHistoryOpen ? 'bi bi-chevron-compact-up' : 'bi bi-chevron-compact-down'"></i>
          </span></label>
        <div v-if="isHistoryOpen" class="ms-2 bg-light">
          <p>Un message | date</p>
          <p>Un message 2 | date</p>
          <p>Un message 3 | date</p>
        </div>
      </div>
      <hr>
      <!-- Détails professionnels -->
      <div class="div-soustitre-detail bg-light m-1">
        <p class="soustitre-detail">Emploi</p>
      </div>
      <div class="ligne-formulaire">
        <label>Emploi</label>
        <select v-model="form.emploiCode" class="champ">
          <option v-for="job in emplois" :key="job.code" :value="job.code">
            {{ job.corps_emploi }} - {{ job.label }}
          </option>
        </select>
      </div>
      <div class="ligne-formulaire">
        <label>Lieu de travail</label>
        <select v-model="form.lieuCode" class="champ">
          <option v-for="lieu in lieuxTravail" :key="lieu.code" :value="lieu.code">
            {{ lieu.code }} - {{ lieu.label }}
          </option>
        </select>
      </div>
      <div class="ligne-formulaire">
        <label>Motif de paiement</label>
        <select v-model="form.motifCode" class="champ">
          <option v-for="motif in motifsPaiement" :key="motif.label" :value="motif.code">
            {{ motif.code }} - {{ motif.label }}
          </option>
        </select>
      </div>
      <hr />
      <div class="div-soustitre-detail bg-light m-1">
        <p class="soustitre-detail">Compte</p>
      </div>
      <div class="ligne-formulaire">
        <label>Motifs de compte</label>
        <input class="champ text-end" :value="''" />
      </div>
      <div class="ligne-formulaire">
        <label>Activité compte</label>
        <input class="champ text-end" :value="''" />
      </div>
      <div class="ligne-formulaire">
        <label>Compte</label>
        <input class="champ text-end" :value="''" />
      </div>
      <div class="ligne-formulaire">
        <label>Centre de projet</label>
        <input class="champ text-end" :value="''" />
      </div>
      <div class="ligne-formulaire">
        <label>Numéro de projet</label>
        <input class="champ text-end" :value="''" />
      </div>

    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import dayjs from 'dayjs'
import type { Demande } from '@/types/demande'
import { ValidationStatut, Approbation, Paiement } from '@/types/demande'

// Props
const props = defineProps<{
  evenement?: Demande | null
  modeModification?: boolean
  emplois?: Array<{ code: string; label: string; corps_emploi: string }>
  lieuxTravail?: Array<{ code: string; label: string }>
}>()

// Emits
const emit = defineEmits<{
  (e: 'nouvelleDemande', data: Demande): void
  (e: 'demandeModifiee', data: Demande): void
  (e: 'fermer'): void
  (e: 'submit'): void
}>()


// Formulaire
const form = ref<Demande>(props.evenement ?? initialiserNouvelleDemande())

// mise à jours du formulaire
watch(() => props.evenement, (nouvelleDemande) => {
  if (nouvelleDemande) {
    console.log('Nouvelle demande reçue :', nouvelleDemande)
    form.value = { ...nouvelleDemande };
  }
}, { immediate: true });

// Chargement conditionnel
onMounted(() => {
  if (!props.evenement) {
    form.value = initialiserNouvelleDemande()
  }
})

// Fonctions
function genererNouvelId(): string {
  return 'ID-' + Date.now().toString()
}

function initialiserNouvelleDemande(): Demande {
  return {
    id: genererNouvelId(),
    matricule: '',
    date: '',
    dateCreation: dayjs().format('YYYY-MM-DD'),
    dateDebut: '',
    dateFin: '',

    emploiCode: '',
    emploiLabel: '',
    emploiCorps: '',

    lieuCode: '',
    lieuLabel: '',

    motifCode: '',
    motifLabel: '',

    typeEvenement: '',

    touteJournee: true,
    de: '',
    a: '',

    nomNaissance: '',
    prenom: '',
    commentaire: '',

    etatValidation: ValidationStatut.EnCreation,

    niveau1validation: '',
    niveau2validation: '',

    noteApprobation: '',
    decision: null,
    attente_info: false
  }
}

async function chargerDemandeParId(id: string): Promise<Demande> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '123',
        matricule: '',
        date: '',
        dateCreation: '2025-06-10',
        nomNaissance: 'Dorion',
        prenom: 'Cédric',
        emploiCode: 'A',
        emploiCorps: '',
        emploiLabel: '',
        lieuCode: '001',
        lieuLabel: '',
        motifCode: '01',
        motifLabel: '',
        dateDebut: '2025-06-10',
        dateFin: '2025-06-10',
        touteJournee: true,
        de: '',
        a: '',
        commentaire: 'Je me suis réveillé avec une gastro ce matin. Je prends congé maladie. Merci',
        noteApprobation: '',
        typeEvenement: '',
        etatValidation: ValidationStatut.Soumis,
        niveau1validation: 'En attente d\'approbation',
        niveau2validation: 'En attente d\'approbation',
        decision: '',
        attente_info: false
      })
    }, 300)
  })
}

// Données statiques
const emplois = [
  { code: 'A', label: 'Enseignant', corps_emploi: '3110' },
  { code: 'B', label: 'Suppléant', corps_emploi: '3457' },
  { code: 'C', label: 'Concierge', corps_emploi: '2520' }
]

const lieuxTravail = [
  { code: '001', label: 'École Untel' },
  { code: '002', label: 'École Deux' },
  { code: '003', label: 'École Trois' }
]

const motifsAbsence = [
  { code: '01', label: 'congé maladie' },
  { code: '02', label: 'congé' },
  { code: '03', label: 'vacance' },
  { code: '04', label: 'congé flottant mobile' },
  { code: '05', label: 'congé force majeure' }
]


const motifsPaiement = [
  { code: '01', label: 'Temps supplémentaire' },
  { code: '02', label: 'Surcroît' },
  { code: '03', label: 'Remplacement' },
  { code: '04', label: 'Suppléance occasionnelle' },
  { code: '05', label: 'Banque de temps' },
  { code: '06', label: 'ATP' },
  { code: '07', label: 'Taux horaire' },
  { code: '08', label: 'Suppléance en sus de la tâche' },
  { code: '09', label: 'Prime de disponibilité' },
]

const labelMotif = computed(() => {
  const code = form.value.motifCode
  console.log('Motif actuel :', code)
  const motif = motifsAbsence.find(m => m.code === code)
  console.log('Motif trouvé :', motif)
  return motif ? motif.label : code
})

// Validation
const formulaireValide = computed(() => {
  return (
    form.value.emploiCode &&
    form.value.lieuCode &&
    form.value.motifCode &&
    form.value.dateDebut &&
    form.value.dateFin &&
    (form.value.touteJournee || (form.value.de && form.value.a))
  )
})

const isDateRangeValid = computed(() => {
  if (!form.value.dateDebut || !form.value.dateFin) return true
  return new Date(form.value.dateFin) >= new Date(form.value.dateDebut)
})

// Copier automatiquement la date de début vers la date de fin
const dateCopier = ref(false)
watch(() => form.value.dateDebut, (newDate) => {
  if (!dateCopier.value && newDate) {
    form.value.dateFin = newDate
    dateCopier.value = true
  }
})

// Calcul des jours
const jourDebut = computed(() => {
  if (!form.value.dateDebut) return ''
  return new Date(form.value.dateDebut).toLocaleDateString('fr-FR', { weekday: 'long' })
})

const jourFin = computed(() => {
  if (!form.value.dateFin) return ''
  return new Date(form.value.dateFin).toLocaleDateString('fr-FR', { weekday: 'long' })
})

// Texte du bouton
const modeSoumission = computed(() => {
  if (props.modeModification) {
    return props.evenement?.etatValidation === ValidationStatut.EnCreation ? 'Soumettre' : 'Modifier'
  }
  return 'Soumettre'
})

const estEnCreation = computed(() => form.value.etatValidation === ValidationStatut.EnCreation)

// Soumission
function submitForm() {
  if (!isDateRangeValid.value) {
    alert('La date de fin ne peut pas être antérieure à la date de début.')
    return
  }

  if (props.modeModification) {
    emit('demandeModifiee', form.value)
  } else {
    emit('nouvelleDemande', form.value)
  }

  console.log('Formulaire soumis:', form.value)

  emit('fermer') // ← retour à DeclarationTemps.vue
}

const approbationOptions = Object.entries(Approbation).map(([key, value]) => ({
  key,
  label: value
}));

const isHistoryOpen = ref(false)

function toggleHistory() {
  isHistoryOpen.value = !isHistoryOpen.value
}
</script>
<style scoped>
.ma-container {
  max-width: 100%;
  margin: 0 auto;
  font-size: 0.85rem;
  line-height: 1.4;
  background-color: white;
  padding-left: 0.4rem;
  border-left: 0.1rem solid #09579712;
}

.titre-detail {
  background: linear-gradient(135deg, #095797D4, #095797A4);
  color: white;
  border-radius: 0.2rem;
  justify-content: space-between;
}

.x-circle {
  background-color: white;
  border-radius: 1rem;
  padding-inline: 0.2rem;
  box-shadow: 0 0.1rem 0.2rem #095797;
}

.historique-notes {
  background-color: #09579712;
  width: 100%;
}

.formulaire-contenant {
  width: 100%;
}

.ligne-formulaire {
  display: flex;
  align-items: center;
  margin-inline: 1rem;
  padding: 0.6rem 1rem;
  width: 100%;
  color: #095797;
}

.ligne-formulaire-commentaire {
  color: #095797;
  margin-inline: 1rem;
  padding: 0.6rem 1rem;
}

.div-soustitre-detail {
  border-radius: 0.5rem;
  padding: 0.1rem;
}

.soustitre-detail {
  font-size: larger;
  font-weight: bolder;
  margin: 0;
}

label {
  flex: 1;
  font-weight: 500;
  font-size: 0.85rem;
  margin-right: 1rem;
}

.champ {
  flex: 2;
  font-size: 0.85rem;
  padding: 0.3rem 0.5rem;
  border: 0.1rem solid #ccc;
  border-radius: 0.5rem;
  width: 100%;
}

textarea.champ {
  resize: vertical;
}


.alert-message {
  color: #d9534f;
  background-color: #fff;
  border: 1px solid #d9534f;
  padding: 6px 10px;
  margin: 8px 1rem;
  font-size: 0.8rem;
  box-shadow: 0 0 4px rgba(217, 83, 79, 0.2);
}
</style>
