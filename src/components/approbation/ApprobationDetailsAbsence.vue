<template>
  <div class="ma-container">

    <!-- Barre d'action en haut -->
    <div class="top-colonne-actions d-flex justify-content-start gap-2 align-items-start">
      <button type="button" class="badge btn btn-success btn-sm">
        Approuver
      </button>

      <button type="button" class="badge btn btn-danger btn-sm">
        Refuser
      </button>
      <button type="button" class="badge btn btn-primary btn-sm" :class="boutonSupplementaire.class"
        v-if="boutonSupplementaire.label">
        {{ boutonSupplementaire.label }}
      </button>


      <div class="ms-4 d-flex align-items-start" style="font-size: 0.75rem;">
        <label for="niveau1validation" class="mb-1 mt-1">État d'approbation</label>
        <select id="niveau1validation" v-model="form.niveau1validation" class="form-select form-select-sm w-auto">
          <option :value="Approbation.EnAttente">En attente d'une pièce justificative</option>
          <option :value="Approbation.EnCours">En attente d'approbation</option>
          <option :value="Approbation.Annuler">Annulée</option>
        </select>
      </div>
      <button type="button" class="btn btn-link btn-sm text-danger text-decoration-underline" @click="$emit('fermer')">
        Fermer
      </button>
    </div>
    <!-- Conteneur des colonnes -->
    <div class="d-flex gap-1">

      <!-- Colonne gauche : Approbation -->
      <div class="colonne-gauche col-4">
        <div class="titre-detail   d-flex">
          Approbation - {{ form.motifLabel || 'Motif inconnu' }}
        </div>

        <div class="container pb-2">
          <div class="mt-1">
            <label>État de la demande</label>
            <input class="champ" :value="form.etatValidation" readonly />
          </div>

          <div>
            <label class="mb-1 mt-2">Note d'approbation</label>
            <textarea v-model="form.noteApprobation" rows="3" class="champ"
              placeholder="Ajouter une note ici..."></textarea>
          </div>

          <div>
            <label class="mb-2 mt-1 historique-notes" @click="toggleHistory">
              Historique des notes
              <span class="ms-2">
                <i :class="isHistoryOpen ? 'bi bi-chevron-compact-up' : 'bi bi-chevron-compact-down'"></i>
              </span>
            </label>
            <div v-if="isHistoryOpen" class="ms-2 bg-light">
              <p>Un message | date</p>
              <p>Un message 2 | date</p>
              <p>Un message 3 | date</p>
            </div>
          </div>

          <div class="mb-1">
            <label>Commentaire employé</label>
            <textarea v-model="form.commentaire" rows="3" class="champ"
              placeholder="Ajouter un commentaire ici..."></textarea>
          </div>
          <div class="">
            <label class="mb-2 mt-1 historique-notes" @click="toggleHistory">
              Historique des commentaires
              <span class="ms-2">
                <i :class="isHistoryOpen ? 'bi bi-chevron-compact-up' : 'bi bi-chevron-compact-down'"></i>
              </span>
            </label>
            <div v-if="isHistoryOpen" class="ms-2 bg-light">
              <p>Un message | date</p>
              <p>Un message 2 | date</p>
              <p>Un message 3 | date</p>
            </div>
          </div>

          <label class="mb-2">Pièces jointes</label>
          <div class="piece-jointe d-flex align-items-center gap-2 p-2 border rounded mt-1">
            <i class="bi bi-paperclip fs-5 text-primary"></i>
            <span class="nom-fichier">justificatif_EmployerX.pdf</span>
            <button class="btn btn-sm btn-outline-secondary">
              <i class="bi bi-download"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div> 
      <div class="colonne-centre col-4"> 
        <div class="formulaire-contenant ">
          <div class="ligne-formulaire mt-2">
            <span> <strong>Initiée le {{ jourCreation }} {{ form.dateCreation }} par {{ form.nomNaissance }} {{
              form.prenom }}</strong> </span>
          </div>
          <div class="ligne-formulaire">
            <label>Début </label>
            <span class="text-dark jour-semaine">{{ (form.dateDebut ? getJourSemaine(form.dateDebut) : '') }}</span>
            <input type="date" v-model="form.dateDebut" class="champ me-2" />
            <label>Fin </label>
            <span class="text-dark jour-semaine">{{ form.dateFin ? getJourSemaine(form.dateFin) : '' }}</span>
            <input type="date" v-model="form.dateFin" :class="['champ', { 'is-invalid': !isDateRangeValid }]" />
          </div>
          <div class="ligne-formulaire">
            <label>Heure de début</label>
            <input type="time" v-model="form.de" class="champ me-2" />
            <label>Heure de fin</label>
            <input type="time" v-model="form.a" class="champ" />
          </div>
          <div v-if="!isDateRangeValid" class="alert-message">
            ⚠️ La date de fin ne peut pas être antérieure à la date de début.
          </div>
          <div class="ligne-formulaire">
            <label>Motif d'absence</label>
            <select v-model="form.motifCode" class="champ">
              <option v-for="motif in motifsAbsence" :key="motif.label" :value="motif.code">
                {{ motif.code }} - {{ motif.label }}
              </option>
            </select>
          </div>
          <div class="solde container">
            <div class="text-dark mb-2"><strong>Solde en banque</strong></div>
            <div class="container ms-4">
              <div class="ligne-solde">
                <span class="titre-solde">Maladie monnayable :</span>
                <span class="valeur-solde">5.0</span>
              </div>
              <div class="ligne-solde">
                <span class="titre-solde">Vacances année courante :</span>
                <span class="valeur-solde">17.0</span>
              </div>
              <div class="ligne-solde">
                <span class="titre-solde">Temps compensé :</span>
                <span class="valeur-solde">1.0</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Colonne droite : Identification + Emploi -->
      <div class="colonne-droite col-3">
        <div class="formulaire-contenant">
          <div class="ligne-formulaire matricule-col-3">
            <label>Matricule</label>
            <input class="champ" :value="form.matricule" readonly />
          </div>
          <div class="ligne-formulaire">
            <label>Employé</label>
            <input class="champ" :value="form.nomNaissance + ' ' + form.prenom" readonly />
          </div>

          <div class="ligne-formulaire">
            <label>Emploi :</label> 
            <select v-model="form.emploiCorps" class="champ">
              <option v-for="job in emplois" :key="job.emploiCode" :value="job.emploiCode">
                {{ job.emploiCorps }} - {{ job.emploiLabel }}
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import dayjs from 'dayjs'
import type { Demande } from '@/types/demande'
import { ValidationStatut, Approbation } from '@/types/demande'
import { getJourSemaine } from '@/utils/dateUtils'
import corpsEmploiData from '@/types/corpsEmploi.json';
import motifAbsenceData from '@/types/MotifAbsence.json';

// Props
const props = defineProps<{
  evenement?: Demande | null
  modeModification?: boolean
  // emplois?: Array<{ emploiCode: string; emploiLabel: string; emploiCorps: string }>
  lieuxTravail?: Array<{ code: string; label: string }>
}>()

// Emits
const emit = defineEmits<{
  (e: 'nouvelleDemande', data: Demande): void
  (e: 'demandeModifiee', data: Demande): void
  (e: 'fermer'): void
  (e: 'submit'): void
}>()
 
const form = ref<Demande>(props.evenement ?? initialiserNouvelleDemande()) 
const jourCreation = computed(() => {
  return getJourSemaine(form.value.dateCreation)
})
 
watch(() => props.evenement, (nouvelleDemande) => {
  if (nouvelleDemande) {
    console.log('Nouvelle demande reçue :', nouvelleDemande)
    form.value = { ...nouvelleDemande };
  }
}, { immediate: true }); 
onMounted(() => {
  if (!props.evenement) {
    form.value = initialiserNouvelleDemande()
  }
})
 
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
 
const emplois = corpsEmploiData.corpsEmploi.map((item: { code: any; description: any }) => ({
  emploiCode: item.code,
  emploiLabel: item.description,
  emploiCorps: item.code
}));

const lieuxTravail = [
  { code: '001', label: 'École Untel' },
  { code: '002', label: 'École Deux' },
  { code: '003', label: 'École Trois' }
];

const motifsAbsence = motifAbsenceData.motifAbsence.map((item: { code: any; description: any }) => ({
  code: item.code,
  label: item.description
})); 

const labelMotif = computed(() => {
  const code = form.value.motifCode
  console.log('Motif actuel :', code)
  const motif = motifsAbsence.find(m => m.code === code)
  console.log('Motif trouvé :', motif)
  return motif ? motif.label : code
})
 
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

const dateCopier = ref(false)
watch(() => form.value.dateDebut, (newDate) => {
  if (!dateCopier.value && newDate) {
    form.value.dateFin = newDate
    dateCopier.value = true
  }
})
 
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

  emit('fermer')  
}

const approbationOptions = Object.entries(Approbation).map(([key, value]) => ({
  key,
  label: value
}));

const isHistoryOpen = ref(false)

function toggleHistory() {
  isHistoryOpen.value = !isHistoryOpen.value
}

const boutonSupplementaire = computed(() => {
  switch (form.value.niveau1validation) {
    case Approbation.EnAttente:
      return { label: "Mettre en attente (pièce justificative)", class: "btn-warning text-dark" }
    case Approbation.EnCours:
      return { label: "Mettre en attente (approbation)", class: "btn-warning text-dark" }
    case Approbation.Annuler:
      return { label: "Annuler", class: "btn-dark" }
    default:
      return { label: "" }
  }
})
 
</script>
<style scoped>
.ma-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
  padding: 0;
  margin: 0;
}
 
.top-colonne-actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 0;
  padding: 0;
  margin: 0;
}
 
.ma-container>.d-flex {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
}
 
.colonne-gauche,
.colonne-centre,
.colonne-droite {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
  max-height: 82vh;
  flex: 1;
}

.colonne-centre {
  background-color: #09579711;
}

.colonne-droite {
  background-color: #09579711;
}
 
.titre-detail {
  background: linear-gradient(135deg, #095797, #095797B4);
  color: white;
  padding: 0;
  font-weight: bold;
  font-size: 0.9rem;
  justify-content: center;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  margin: 0;
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
  margin-right: 1cm;
  padding: 0.6rem 1rem;
  width: 100%;
  color: #095797;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.matricule-col-3 {
  margin-top: 3.5rem;
}

.solde {
  flex-direction: column;
  flex-wrap: wrap;
  margin-inline: 1rem;
  padding: 0.6rem 1rem;
  width: 100%;
  color: #095797;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.85rem;
  margin-right: 1rem;

}

.ligne-solde {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.titre-solde {
  text-align: left;
}

.valeur-solde {
  text-align: right;
  min-width: 3rem;
  margin-right: 3rem;
}

.intie-par {
  padding: 0;
  margin-top: -0.7rem;
  margin-left: 3rem;
}

.jour-semaine {
  font-size: 0.8rem;
  margin: 0;
  margin-left: -2rem;
  padding: 0;
}

.ligne-formulaire-commentaire {
  color: #095797;
  margin-inline: 1rem;
  padding: 0.6rem 1rem;
}

.div-soustitre-detail {
  border-radius: 0.5rem;
  padding: 0.1rem 1rem;
  background-color: #f0f0f0;
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
  padding: 0.1rem 0.3rem;
  font-size: 0.85rem;
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
