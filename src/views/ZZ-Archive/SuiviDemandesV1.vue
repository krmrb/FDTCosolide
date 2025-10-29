<template>
  <div class="ma-container">
    <!-- Détails suivi -->
    <div class="mt-4 p-4">
      <h3 class="mb-4">Demande de {{labelMotif}} <span v-if="!estEnCreation">- Suivi</span></h3>
      <div class="details-suivi" v-if="!estEnCreation">
        <div class="col-md-8">
          <div class="row g-0 mb-3 align-items-stretch">
            <div class="col-md-3">
              <div class="mb-2">
                <strong>Demandé pour</strong>
                <div>{{ form.nomNaissance }} {{form.prenom}}</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-2">
                <strong>État de la demande</strong>
                <div>{{form.etatValidation}} <!--<span>(modifier)</span>--></div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-2">
                <strong>Date de création</strong>
                <div>{{form.dateCreation}}</div>
              </div>
            </div>
            <div class="border-top border-1 border-primary my-4"></div>
          </div>
        </div>
        <div class="row mb-3 align-items-stretch">
          <div class="col-md-5">
            <div class="mb-3">
              <h5 class="palier">Premier niveau d'approbation</h5>
            </div>
            <div class="mb-2">
              <strong>Responsable</strong>
              <div>Secrétaire Untel{{ form.Responsable }}</div>
            </div>
            <div>
              <strong>État d'approbation</strong>
              <div>{{ form.niveau1validation }}</div>
            </div>
          </div>

          <!-- Barre verticale dans une colonne très mince -->
          <div class="col-md-1 d-flex justify-content-center">
            <div class="vertical-divider"></div>
          </div>

          <div class="col-md-6">
            <div class="mb-3">
              <h5 class="palier">Deuxième niveau d'approbation</h5>
            </div>
            <div class="mb-2">
              <strong>Responsable</strong>
              <div>Directeur Untel{{ form.Responsable }}</div>
            </div>
            <div>
              <strong>État d'approbation</strong>
              <div>{{ form.niveau2validation }}</div>
            </div>
          </div>
        </div>
        <div class="container bg-light">
          <strong>Note/commentaire</strong>
          <div>
            <p class="mt-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
              et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat.
            </p>
          </div>
        </div>
      </div>
      <div class="border-top border-3 border-primary my-4"></div>
    </div>


    <!-- Formulaire -->
    <div class="bg-light p-4">
      <!-- Date début -->
      <div class="row mb-3 align-items-center">
        <div class="col-md-4"><label for="date">Date de début</label></div>
        <div class="col-md-4 text-end">
          <span class="text-muted me-2 fw-bold">{{ jourDebut }}</span>
        </div>
        <div class="col-md-4">
          <input type="date" id="dateDebut" class="form-control" v-model="form.dateDebut" />
        </div>
      </div>
      <!-- Date fin-->
      <div class="row mb-3 align-items-center">

        <!-- Message d'erreur -->
        <div v-if="!isDateRangeValid" class="alert-message">
          ⚠️ La date de fin ne peut pas être antérieure à la date de début.
        </div>

        <div class="col-md-4"><label for="date">Date de fin</label></div>
        <div class="col-md-4 text-end">
          <span class="text-muted me-2 fw-bold">{{ jourFin }}</span>
        </div>
        <div class="col-md-4">
          <input type="date"
                 id="date_fin"
                 v-model="form.date_fin"
                 :class="['form-control', { 'is-invalid': !isDateRangeValid }]" />
        </div>
      </div>

      <!-- Checkbox "Journée entière" avec info au survol -->
      <div class="row mb-3">

        <div class="col-md-12 d-flex justify-content-end align-items-center">
          <label class="form-check-label me-2" for="touteJournee">Journée entière</label>
          <div class="form-check tooltip-hover">
            <input class="form-check-input me-2"
                   type="checkbox"
                   id="touteJournee"
                   v-model="form.touteJournee">

          </div>
        </div>
      </div>

      <!-- Champ "De" -->
      <div class="row mb-3" :style="{ opacity: form.touteJournee ? 0.5 : 1 }">
        <div class="col-md-7">
          <label for="de">Heure de début</label>
        </div>
        <div class="col-md-5">
          <input type="time" id="de" class="form-control form-control-sm" v-model="form.de" v-bind:disabled="form.touteJournee" placeholder="ex: 08:00" />
        </div>
      </div>

      <!-- Champ "À" -->
      <div class="row mb-3" :style="{ opacity: form.touteJournee ? 0.5 : 1 }">
        <div class="col-md-7">
          <label for="a">Heure de fin</label>
        </div>
        <div class="col-md-5">
          <input type="time" id="a" class="form-control form-control-sm" v-model="form.a" v-bind:disabled="form.touteJournee" placeholder="ex: 16:00" />
        </div>
      </div>
      <!-- Emploi -->
      <div class="row mb-3">
        <div class="col-md-7"><label for="emploi">Emploi</label></div>
        <div class="col-md-5">
          <select id="emploi" class="form-select" v-model="form.emploi">
            <option v-for="job in emplois" :key="job.code" :value="job.code">
              {{job.corps_emploi}} - {{ job.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Lieu de travail -->
      <div class="row mb-3">

        <div class="col-md-7"><label for="lieu">Lieu de travail</label></div>
        <div class="col-md-5">
          <select id="lieu" class="form-select" v-model="form.lieu">
            <option v-for="lieu in lieuxTravail" :key="lieu.code" :value="lieu.code">
              {{ lieu.code }} - {{ lieu.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Motif d'absence -->
      <div class="row mb-3">
        <div class="col-md-7"><label for="motif">Motif d'absence</label></div>
        <div class="col-md-5">
          <select id="motif" class="form-select" v-model="form.motif">
            <option v-for="motif in motifsAbsence" :key="motif.code" :value="motif.code">
              {{ motif.code }} - {{ motif.label }}
            </option>
          </select>
        </div>
      </div>
       
      <!-- Commentaire -->
      <div class="mb-3">
        <label for="commentaire" class="form-label">Commentaire</label>
        <textarea id="commentaire"
                  class="form-control"
                  v-model="form.commentaire"
                  rows="3"
                  placeholder="Ajouter un commentaire ici..."></textarea>
      </div>

      <!-- Soumettre -->
      <div class="mt-4 text-end">
        <button type="button" class="btn btn-link text-danger text-decoration-underline" @click="$emit('cancel')">
          Annuler
        </button>

        <!--<button v-if="!modeModification || props.evenement?.validation === 'En création'"
          type="button"
          class="btn btn-link"
          @click="enregistrerBrouillon">
    Enregistrer
  </button>-->
        <button type="button"
                class="btn btn-danger me-2"
                :disabled="!formulaireValide"
                @click="annuler">
          Annuler la demande
        </button>

        <button type="button"
                class="btn btn-primary"
                :disabled="!formulaireValide"
                @click="submitForm">
          <!--{{ modeSoumission }}-->Modifier
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import dayjs from 'dayjs'
  import type { Demande } from '@/types/demande'
  import { ValidationStatut } from '@/types/demande'


  // Props
  const props = defineProps<{
    evenement?: Demande
  modeModification?: boolean 
  }> ()

  // Emits
  const emit = defineEmits<{
  (e: 'nouvelleDemande', data: Demande): void
    (e: 'demandeModifiee', data: Demande): void
}> ()

  // Route
  const router = useRouter()
  const route = useRoute()
  const id = route.params.id as string | undefined
  const typeEvenement = route.query.type as 'Absence' | 'Paiement' | undefined

  // Formulaire
  const form = ref < Demande > (props.evenement ?? initialiserNouvelleDemande())

  // Chargement conditionnel
  onMounted(async () => {
    if (!props.evenement && id) {
      try {
        const demande = await chargerDemandeParId(id)
        form.value = demande
      } catch (error) {
        console.error('Erreur lors du chargement de la demande :', error)
      }
    }
  })

  // Fonctions
  function genererNouvelId(): string {
    return 'ID-' + Date.now().toString()
  }

  function initialiserNouvelleDemande(): Demande {
    return {
      id: genererNouvelId(),
      dateCreation: dayjs().format('YYYY-MM-DD'),
      nomNaissance: '',
      prenom: '',
      emploi: '',
      lieu: '',
      motif: '',
      dateDebut: '',
      date_fin: '',
      touteJournee: true,
      de: '',
      a: '',
      commentaire: '',
      etatValidation: ValidationStatut.EnCreation
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
          dateDebut: '2025-06-10',
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
    const motif = motifsAbsence.find(m => m.code === form.value.motif)
    return motif ? motif.label : form.value.motif // fallback au code si non trouvé
  })


  // Validation
  const formulaireValide = computed(() => {
    return (
      form.value.emploi &&
      form.value.lieu &&
      form.value.motif &&
      form.value.dateDebut &&
      form.value.date_fin &&
      (form.value.touteJournee || (form.value.de && form.value.a))
    )
  })

  const isDateRangeValid = computed(() => {
    if (!form.value.dateDebut || !form.value.date_fin) return true
    return new Date(form.value.date_fin) >= new Date(form.value.dateDebut)
  })

  // Copier automatiquement la date de début vers la date de fin
  const dateCopier = ref(false)
  watch(() => form.value.dateDebut, (newDate) => {
    if (!dateCopier.value && newDate) {
      form.value.date_fin = newDate
      dateCopier.value = true
    }
  })

  // Calcul des jours
  const jourDebut = computed(() => {
    if (!form.value.dateDebut) return ''
    const [year, month, day] = form.value.dateDebut.split('-').map(Number)
    const date = new Date(year, month - 1, day) // mois = 0-indexé
    return date.toLocaleDateString('fr-FR', { weekday: 'long' })
  })

  const jourFin = computed(() => {
    if (!form.value.dateFin) return ''
    const [year, month, day] = form.value.dateFin.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('fr-FR', { weekday: 'long' })
  })


  // Texte du bouton
  const modeSoumission = computed(() => {
    if (props.modeModification) {
      console.log('Validation actuelle :', props.evenement?.etatValidation)
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

    router.push({ name: 'declarationtemps' })
  }
</script>
<style>
  .ma-container {
    max-width: 45%;
    margin: 0 auto;
  }

  .palier {
    color: #095797;
  }

  .container {
    border-radius: 1rem;
    padding: 0.2rem;
    margin: 0.5rem;
  }

  .tooltip-hover {
    position: relative;
    cursor: pointer;
  }

    .tooltip-hover::after {
      content: "Cocher si l'absence couvre toute la journée";
      position: absolute;
      top: -30px;
      left: 0;
      background-color: rgba(0, 0, 0, 0.75);
      color: #fff;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 0.8rem;
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
    background-color: #ffffff;
    border: 1px solid #d9534f;
    padding: 8px 12px;
    border-radius: 6px;
    margin-bottom: 8px;
    font-size: 0.9rem;
    box-shadow: 0 0 4px rgba(217, 83, 79, 0.2);
  }


  .vertical-divider {
    width: 0.1rem;
    background-color: #ccc;
    margin: 0 1rem;
  }


  @media (max-width: 768px) {
    .vertical-divider {
      display: none;
    }
  }
</style>
