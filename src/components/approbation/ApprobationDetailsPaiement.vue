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
          <option :value="Approbation.Refuser">Refusée</option>
          <option :value="Approbation.Accepter">Acceptée</option>
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
            <input type="date" v-model="form.dateDebut" class="champ  me-2" />
            <label>Fin </label>
            <span class="text-dark jour-semaine">{{ form.dateFin ? getJourSemaine(form.dateFin) : '' }}</span>
            <input type="date" v-model="form.dateFin" :class="['champ  ', { 'is-invalid': !isDateRangeValid }]" />
          </div>
          <div class="ligne-formulaire">
            <label>Heure de début</label>
            <input type="time" v-model="form.de" class="champ  " />
            <label>Heure de fin</label>
            <input type="time" v-model="form.a" class="champ  " />
          </div>
          <div v-if="!isDateRangeValid" class="alert-message">
            ⚠️ La date de fin ne peut pas être antérieure à la date de début.
          </div>
          <div class="ligne-formulaire">
            <label>Type de paiement</label>
            <select v-model="form.motifCode" class="champ">
              <option v-for="type_paiement in typePaiement" :key="type_paiement.label" :value="type_paiement.code">
                {{ type_paiement.code }} - {{ type_paiement.label }}
              </option>
            </select>
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
        </div>
      </div>

      <div class="colonne-droite col-3">
        <div class="formulaire-contenant">

          <div class="ligne-formulaire">
            <label>Matricule</label>
            <input class="champ" :value="form.matricule" readonly />
          </div>
              <div class="ligne-formulaire">
            <label>Employé</label>
            <input class="champ" :value="form.nomNaissance + ' ' + form.prenom" readonly />
          </div>
          <div class="ligne-formulaire">
            <label>Matricule remplacé</label>
            <input class="champ" :value="80344561" readonly />
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
          <hr/>
  

<div v-for="(compte, index) in comptes" :key="index" class="mb-4">
    <div class="ligne-formulaire compte-principal">
      <label>Compte</label>
      <input class="champ text-end form-control " v-model="compte.nom" />

      <label>Pourcentage</label>
      <input class="champ text-end form-control ms-1" v-model="compte.pourcentage" />

      <span @click="toggleCompte(index)" class="ms-1 cursor-pointer">
        <i :class="compte.isOpen ? 'bi bi-chevron-double-up' : 'bi bi-chevron-double-down'"></i>
      </span>
    </div>

    <div v-if="compte.isOpen" class="compte-container ">
      <div class="ligne-formulaire mt-0 pt-0">
        <label>Activité compte</label>
        <input class="champ text-end form-control" v-model="compte.activite" />
      
        <label>Motif de compte</label>
        <input class="champ text-end form-control" v-model="compte.motif" />
      </div>
      <div class="ligne-formulaire mt-0 pt-0">
        <label>Centre de projet</label>
        <input class="champ text-end form-control" v-model="compte.centreProjet" />
    
        <label>Numéro de projet</label>
        <input class="champ text-end form-control" v-model="compte.numeroProjet" />
      </div>
    </div>
    <div class="btn text-danger  btn-ajout-compte" @click="retirerCompte(index)">
    Retirer ce compte <span><i class="bi bi-file-earmark-x"></i></span>
    </div>
    <hr/>
  </div>

 
    <div class="btn text-primary btn-ajout-compte" @click="ajouterCompte">
      Ajout d'un compte <i class="bi bi-plus-square ms-1"></i>
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
import typePaiementData from '@/types/typePaiement.json';
import CompteData from '@/types/Compte.json';

const props = defineProps<{
  evenement?: Demande | null
  modeModification?: boolean
  emplois?: Array<{ code: string; label: string; corps_emploi: string }>
  lieuxTravail?: Array<{ code: string; label: string }>
}>()

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

const typePaiement = typePaiementData.typePaiement.map((item: { code: any; description: any }) => ({
  code: item.code,
  label: item.description
}));

const labelTypePaiement = computed(() => {
  const code = form.value.motifCode
  console.log('Paiement trouvé :', code)
  const motif = typePaiement.find((m: { code: string }) => m.code === code)
  console.log('Paiement trouvé :', motif)
  return typePaiement ? typePaiement.label : code
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

// Copier automatiquement la date de début vers la date de fin
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

const modeSoumission = computed(() => {
  if (props.modeModification) {
    return props.evenement?.etatValidation === ValidationStatut.EnCreation ? 'Soumettre' : 'Modifier'
  }
  return 'Soumettre'
})

const estEnCreation = computed(() => form.value.etatValidation === ValidationStatut.EnCreation)

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
 
interface Compte {
  nom: string
  pourcentage: string
  activite: string
  motif: string
  centreProjet: string
  numeroProjet: string
  isOpen: boolean
}


const comptes = ref<Compte[]>([
  {
    nom: CompteData.compte[0].compte,
    pourcentage: CompteData.compte[1].pourcentage,
    activite: CompteData.compte[2].activite,
    motif: CompteData.compte[3].motif,
    centreProjet: CompteData.compte[4].centre,
    numeroProjet: CompteData.compte[5].numeroProj,
    isOpen: false
  },
  ...Array.from({ length: 0 }, () => ({
    nom: '',
    pourcentage: '',
    activite: '',
    motif: '',
    centreProjet: '',
    numeroProjet: '',
    isOpen: false
  }))
])

function retirerCompte(index: number) {
  comptes.value.splice(index, 1)
}

function toggleCompte(index: number) {
  comptes.value[index].isOpen = !comptes.value[index].isOpen
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

function ajouterCompte() {
  comptes.value.push({
    nom: '',
    pourcentage: '',
    activite: '',
    motif: '',
    centreProjet: '',
    numeroProjet: '',
    isOpen: false
  })
}


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

/* Barre d'action au-dessus des colonnes */
.top-colonne-actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 0;
  padding: 0;
  margin: 0;
}

/* Conteneur des colonnes */
.ma-container>.d-flex {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
}

/* Colonnes */
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

.btn-ajout-compte{
  width: 100%;
  text-align: right;
  padding-top: 0;
  margin-top: 0;
  font-size: 0.85rem;
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
  font-size: 0.75rem;
  margin-right: 1rem;
}

textarea.champ {
  resize: vertical;
}


.alert-message {
  color: #d9534f;
  background-color: #fff;
  border: 0.1rem solid #d9534f;
  padding: 0.2rem 0.8rem;
  margin: 0.7 1rem;
  font-size: 0.8rem;
  box-shadow: 0 0 0.2rem rgba(217, 83, 79, 0.2);
}
.compte-principal{
padding-top: 0;
} 

.compte-container{
  margin-left: 0;
  margin-right: 1.6rem;
}

label {
  font-size: 0.85rem;
  margin-bottom: 0.2rem;
}

.champ {
  flex: 2;
  padding: 0.1rem 0.3rem;
  font-size: 0.85rem;
  border: 0.1rem solid #ccc;
  border-radius: 0.5rem;
  width: 100%;
}
</style>
