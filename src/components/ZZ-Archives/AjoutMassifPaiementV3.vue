<template>
  <div class="ma-container">

    <!-- Ligne de titre avec bouton X à droite -->
    <div class="titre-detail mb-3 d-flex justify-content-between align-items-center">
      <h4 class="mb-0">Approbation - Massif</h4>
      <button type="button"
              class="btn btn-sm btn-outline-danger"
              @click="$emit('fermer')"
              title="Fermer">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <!-- Boutons d'action en dessous -->
    <div class="mt-1 d-flex align-items-center gap-2">
      <button type="button" class="btn btn-success btn-sm">
        Confirmer
      </button>
      <button type="button"
              class="btn btn-link btn-sm text-danger text-decoration-underline"
              @click="$emit('fermer')">
        Annuler
      </button>
    </div>

    <!-- Début de la liste -->
    <div class="container approbateur p-4">

      <!-- Approbation -->
      <div class="mb-2">
        <label class="mb-2">Responsable :</label>
        <input class="champ" :value="'Secrétaire Untel'" />
      </div>
      <div class=" mb-3">
        <label for="niveau1validation" class="mb-2">État d'approbation :</label>
        <select id="niveau1validation" v-model="form.niveau1validation" class="champ">
          <option v-for="option in approbationOptions" :key="option.key" :value="option.label">
            {{ option.label }}
          </option>
        </select>
      </div>
      <!-- Commentaire -->
      <div class="mb-2">
        <label class="mb-2">Commentaire :</label>
        <textarea v-model="form.commentaire" rows="3" class="champ" placeholder="Ajouter un commentaire ici..."></textarea>
      </div>
      <hr />

      <div class="formulaire-contenant">

        <!-- Période demandée -->
        <div class="ligne-formulaire">
          <label>Date de modification :</label>
          <input class="champ" :value="form.dateCreation " readonly />
        </div>
        <div class="ligne-formulaire">
          <label>Date de début :</label>
          <input type="date" v-model="form.dateDebut" class="champ" />
        </div>
        <div class="ligne-formulaire">
          <label>Date de fin :</label>
          <input type="date" v-model="form.dateFin" :class="['champ', { 'is-invalid': !isDateRangeValid }]" />
        </div>
        <div class="ligne-formulaire tooltip-hover">
          <label>Journée entière :</label>
          <input type="checkbox" v-model="form.touteJournee" class="champ" />
        </div>
        <div class="ligne-formulaire" :style="{ opacity: form.touteJournee ? 0.5 : 1 }">
          <label>Heure de début :</label>
          <input type="time" v-model="form.de" :disabled="form.touteJournee" class="champ" />
        </div>
        <div class="ligne-formulaire" :style="{ opacity: form.touteJournee ? 0.5 : 1 }">
          <label>Heure de fin :</label>
          <input type="time" v-model="form.a" :disabled="form.touteJournee" class="champ" />
        </div>
        <div v-if="!isDateRangeValid" class="alert-message">
          ⚠️ La date de fin ne peut pas être antérieure à la date de début.
        </div>
        <hr />
        <!-- Détails professionnels -->
        <div class="ligne-formulaire">
          <label>Emploi :</label>
          <select v-model="form.emploiCode" class="champ">
            <option v-for="job in emplois" :key="job.code" :value="job.code">
              {{ job.corps_emploi }} - {{ job.label }}
            </option>
          </select>
        </div>
        <div class="ligne-formulaire">
          <label>Lieu de travail :</label>
          <select v-model="form.lieuCode" class="champ">
            <option v-for="lieu in lieuxTravail" :key="lieu.code" :value="lieu.code">
              {{ lieu.code }} - {{ lieu.label }}
            </option>
          </select>
        </div>
        <hr />
        <div class="ligne-formulaire">
          <label>Motif d'absence :</label>
          <select v-model="form.motifCode" class="champ">
            <option v-for="motif in motifsAbsence" :key="motif.code" :value="motif.code">
              {{ motif.code }} - {{ motif.label }}
            </option>
          </select>
        </div>
        <div class="ligne-formulaire">
          <label>Régime d'absence :</label>
          <input class="champ text-end" :value="''" readonly />
        </div>
        <div class="ligne-formulaire">
          <label>Motif d'absence :</label>
          <select v-model="form.motifCode" class="champ">
            <option v-for="motif in motifsAbsence" :key="motif.code" :value="motif.code">
              {{ motif.code }} - {{ motif.label }}
            </option>
          </select>
        </div>
        <div class="ligne-formulaire">
          <label>Sous-motif :</label>
          <input class="champ text-end" :value="''" readonly />
        </div>
        <hr />
        <div class="ligne-formulaire">
          <label>Taux :</label>
          <input class="champ text-end" :value="''" readonly />
        </div>
        <div class="ligne-formulaire">
          <label>No pièce :</label>
          <input class="champ text-end" :value="''" readonly />
        </div>
        <div class="ligne-formulaire">
          <label>Compte :</label>
          <input class="champ text-end" :value="''" readonly />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, computed, watch, onMounted, defineEmits } from 'vue'
  import dayjs from 'dayjs'
  import type { Demande } from '@/types/demande'
  import { ValidationStatut, Approbation } from '@/types/demande'

  // Props
  const props = defineProps<{
    evenement?: Demande
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

      touteJournee: false,
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
          dateCreation: '2025-06-10',
          nomNaissance: 'Dorion',
          prenom: 'Cédric',
          emploi: 'A',
          lieu: '001',
          motif: '01',
          date_deb: '2025-06-10',
          date_fin: '2025-06-10',
          touteJournee: true,
          de: '',
          a: '',
          commentaire: 'Je me suis réveillé avec une gastro ce matin. Je prends congé maladie. Merci',
          etatValidation: ValidationStatut.Soumis,
          //ValidationStatut.EnCreation,
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


  const labelMotif = computed(() => {
    const code = form.value.motif
    console.log('Motif actuel :', code)
    const motif = motifsAbsence.find(m => m.code === code)
    console.log('Motif trouvé :', motif)
    return motif ? motif.label : code
  })


  // Validation
  const formulaireValide = computed(() => {
    return (
      form.value.emploi &&
      form.value.lieu &&
      form.value.motif &&
      form.value.date_deb &&
      form.value.date_fin &&
      (form.value.touteJournee || (form.value.de && form.value.a))
    )
  })

  const isDateRangeValid = computed(() => {
    if (!form.value.date_deb || !form.value.date_fin) return true
    return new Date(form.value.date_fin) >= new Date(form.value.date_deb)
  })

  // Copier automatiquement la date de début vers la date de fin
  const dateCopier = ref(false)
  watch(() => form.value.date_deb, (newDate) => {
    if (!dateCopier.value && newDate) {
      form.value.date_fin = newDate
      dateCopier.value = true
    }
  })

  // Calcul des jours
  const jourDebut = computed(() => {
    if (!form.value.date_deb) return ''
    return new Date(form.value.date_deb).toLocaleDateString('fr-FR', { weekday: 'long' })
  })

  const jourFin = computed(() => {
    if (!form.value.date_fin) return ''
    return new Date(form.value.date_fin).toLocaleDateString('fr-FR', { weekday: 'long' })
  })

  // Texte du bouton
  const modeSoumission = computed(() => {
    if (props.modeModification) {
      return props.evenement?.validation === ValidationStatut.EnCreation ? 'Soumettre' : 'Modifier'
    }
    return 'Soumettre'
  })

  const estEnCreation = computed(() => form.value.validation === ValidationStatut.EnCreation)

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

  const enregistrerEtFermer = () => {
    // Traitement de l'enregistrement ici si nécessaire
    emit('nouvelleDemande', form)
    emit('fermer')
  }

  const soumettreEtFermer = () => {
    // Traitement de la soumission ici si nécessaire
    emit('nouvelleDemande', form)
    emit('fermer')
  }


  const approbationOptions = Object.entries(Approbation).map(([key, value]) => ({
    key,
    label: value
  }));</script>
<style scoped>
  .ma-container {
    max-width: 100%;
    margin: 0 auto;
    font-size: 0.85rem;
    line-height: 1.4;
    background-color: white;
  }

  .titre-detail {
    background-color: white;
    color: #095797;
  }

  .formulaire-contenant {
    width: 100%;
  }

  .ligne-formulaire {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 1rem;
    width: 100%;
  }

    .ligne-formulaire:nth-child(odd) {
      background-color: #e6f0fa; /* bleu très pâle */
    }

    .ligne-formulaire:nth-child(even) {
      background-color: #ffffff;
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
    border: 1px solid #ccc;
    width: 100%;
  }

  textarea.champ {
    resize: vertical;
  }

  .tooltip-hover {
    position: relative;
    cursor: pointer;
    font-size: 0.8rem;
  }

    .tooltip-hover::after {
      content: "Cocher si l'absence couvre toute la journée";
      position: absolute;
      top: -30px;
      left: 0;
      background-color: rgba(0, 0, 0, 0.75);
      color: #fff;
      padding: 6px 10px;
      font-size: 0.75rem;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      z-index: 10;
    }

    .tooltip-hover:hover::after {
      opacity: 1;
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
