<template>
  <div class="container-fluid mt-4 d-flex justify-content-center">
    <div class="row ma-container align-items-stretch">

      <!-- Colonne gauche : Détails -->
      
      <div class="col-md-5 px-3 colonne-gauche  me-2">
        <h5 class="mb-4">Demande de {{form.motifLabel || 'motif incconu'}} <span>- Approbation</span></h5>
        <div class="row g-0 mb-2 align-items-stretch">

          <div class="mb-2">
            <strong class="fs-7">Demandé par</strong>
            <div class="small mb-2">{{ form.nomNaissance }} {{form.prenom}}</div>
          </div>

          <div class="mb-2">
            <strong class="fs-7">État de la demande</strong>
            <div class="small">{{form.etatValidation}}</div>
          </div>

          <div class="mb-2">
            <strong class="fs-7">Date de création</strong>
            <div class="small">{{form.dateCreation}}</div>
          </div>
        </div>

        <div class="row mb-2 align-items-stretch">
          <div class="col-md-5">
            <h6 class="palier mb-2">Premier niveau d'approbation</h6>
            <div class="mb-2">
              <strong class="fs-7">Responsable</strong>
              <div class="small">Secrétaire Untel{{ form.Responsable }}</div>
            </div>
            <div class="mb-2">
              <label for="niveau1validation" class="form-label form-label-sm"><strong class="fs-7">État d'approbation</strong></label>
              <select id="niveau1validation" v-model="form.niveau1validation" class="form-select form-select-sm">
                <option v-for="option in approbationOptions" :key="option.key" :value="option.label">
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="col-md-1 d-flex justify-content-center">
            <div class="vertical-divider"></div>
          </div>

          <div class="col-md-5">
            <h6 class="palier mb-2">Deuxième niveau d'approbation</h6>
            <div class="mb-2">
              <strong class="fs-7">Responsable</strong>
              <div class="small">Directeur Untel{{ form.Responsable }}</div>
            </div>
            <div class="mb-2">
              <label for="niveau2validation" class="form-label form-label-sm"><strong class="fs-7">État d'approbation</strong></label>
              <select id="niveau2validation" v-model="form.niveau2validation" class="form-select form-select-sm" disabled>
                <option v-for="option in approbationOptions" :key="option.key" :value="option.label">
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="mb-2">
          <label for="noteApprobation" class="form-label fs-7"><strong>Note approbation</strong></label>
          <textarea id="noteApprobation"
                    class="form-control form-control-sm"
                    v-model="form.noteApprobation"
                    rows="2"
                    placeholder="Ajouter un commentaire ici..."></textarea>
        </div>
      </div> 

      <!-- Colonne droite : Formulaire -->
      <div class="col-md-6 p-4 ms-2 colonne-droite">
        <div class="ma-container  p-4 bg-light">
          <!-- Date début -->
          <div class="row mb-2 align-items-center">
            <div class="col-md-4"><label for="dateDebut" class="form-label-sm">Date de début</label></div>
            <div class="col-md-4 text-end">
              <span class="text-muted me-2 small fw-bold">{{ jourDebut }}</span>
            </div>
            <div class="col-md-4">
              <input type="date" id="dateDebut" class="form-control form-control-sm" v-model="form.dateDebut" />
            </div>
          </div>

          <!-- Date fin -->
          <div class="row mb-2 align-items-center">
            <div v-if="!isDateRangeValid" class="alert-message small text-danger">
              ⚠️ La date de fin ne peut pas être antérieure à la date de début.
            </div>
            <div class="col-md-4"><label for="dateFin" class="form-label-sm">Date de fin</label></div>
            <div class="col-md-4 text-end">
              <span class="text-muted me-2 small fw-bold">{{ jourFin }}</span>
            </div>
            <div class="col-md-4">
              <input type="date"
                     id="dateFin"
                     v-model="form.dateFin"
                     :class="['form-control form-control-sm', { 'is-invalid': !isDateRangeValid }]" />
            </div>
          </div>

          <!-- Checkbox "Journée entière" -->
          <div class="row mb-2">
            <div class="col-md-12 d-flex justify-content-end align-items-center">
              <label class="form-check-label me-2 small" for="touteJournee">Journée entière</label>
              <div class="form-check tooltip-hover">
                <input class="form-check-input me-2"
                       type="checkbox"
                       id="touteJournee"
                       v-model="form.touteJournee">
              </div>
            </div>
          </div>

          <!-- Heure de début -->
          <div class="row mb-2" :style="{ opacity: form.touteJournee ? 0.5 : 1 }">
            <div class="col-md-7">
              <label for="de" class="form-label-sm">Heure de début</label>
            </div>
            <div class="col-md-5">
              <input type="time" id="de" class="form-control form-control-sm" v-model="form.de" :disabled="form.touteJournee" placeholder="ex: 08:00" />
            </div>
          </div>

          <!-- Heure de fin -->
          <div class="row mb-2" :style="{ opacity: form.touteJournee ? 0.5 : 1 }">
            <div class="col-md-7">
              <label for="a" class="form-label-sm">Heure de fin</label>
            </div>
            <div class="col-md-5">
              <input type="time" id="a" class="form-control form-control-sm" v-model="form.a" :disabled="form.touteJournee" placeholder="ex: 16:00" />
            </div>
          </div>

          <!-- Emploi -->
          <div class="row mb-2">
            <div class="col-md-7"><label for="emploi" class="form-label-sm">Emploi</label></div>
            <div class="col-md-5">
              <select id="emploi" class="form-select form-select-sm" v-model="form.emploiCode">
                <option v-for="job in emplois" :key="job.code" :value="job.code">
                  {{ job.corps_emploi }} - {{ job.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Lieu de travail -->
          <div class="row mb-2">
            <div class="col-md-7"><label for="lieu" class="form-label-sm">Lieu de travail</label></div>
            <div class="col-md-5">
              <select id="lieu" class="form-select form-select-sm" v-model="form.lieuCode">
                <option v-for="lieu in lieuxTravail" :key="lieu.code" :value="lieu.code">
                  {{ lieu.code }} - {{ lieu.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Motif d'absence -->
          <div class="row mb-2">
            <div class="col-md-7"><label for="motif" class="form-label-sm">Motif d'absence</label></div>
            <div class="col-md-5">
              <select id="motif" class="form-select form-select-sm" v-model="form.motifCode">
                <option v-for="motif in motifsAbsence" :key="motif.code" :value="motif.code">
                  {{ motif.code }} - {{ motif.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Commentaire -->
          <div class="mb-2">
            <label for="commentaire" class="form-label-sm">Commentaire</label>
            <textarea id="commentaire"
                      class="form-control form-control-sm"
                      v-model="form.commentaire"
                      rows="2"
                      placeholder="Ajouter un commentaire ici..."></textarea>
          </div>

          <!-- Boutons -->
          <div class="mt-3 text-end">
            <button type="button" class="btn btn-link btn-sm text-danger text-decoration-underline" @click="$emit('fermer')">
              Annuler
            </button>
            <button type="button" class="btn btn-link btn-sm" @click="enregistrerEtFermer">
              Enregistrer
            </button>
            <button type="button" class="btn btn-primary btn-sm" :disabled="!formulaireValide" @click="soumettreEtFermer">
              {{ modeSoumission }}
            </button>
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
}> ()


  // Formulaire
  const form = ref<Demande>(props.evenement ?? initialiserNouvelleDemande())

  // mise à jours du formulaire
  watch(() => props.evenement, (nouvelleDemande) => {
    if (nouvelleDemande) {
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
  }));


</script>
<style scoped>

  .palier {
    color: #095797;
    font-size: 0.95rem;
    font-weight: 600;
  }


  .container-fluid {
    padding-bottom: 6.1rem;
    min-height: 100%; 
  }

  .ma-container {
    max-width: 100%;
    width: 100%;
    margin: 0 auto;
    border-radius: 0.8rem;
  }

  .container {
    border-radius: 1rem;
    padding: 0.2rem;
    margin: 0.5rem;
  }

  .colonne-gauche {
    border-right: 0.1rem solid #095797;
    padding-right: 2rem;
    margin-right: 1rem;
  }

  .colonne-droite {
    padding-left: 2rem;
    margin-left: 4rem;
    border-radius: 0.8rem;
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
    background-color: #ffffff;
    border: 1px solid #d9534f;
    padding: 6px 10px;
    border-radius: 6px;
    margin-bottom: 6px;
    font-size: 0.8rem;
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

  /* Réduction globale des tailles de texte */
  label,
  .form-label,
  .form-check-label,
  strong {
    font-size: 0.85rem;
  }

  input,
  select,
  textarea {
    font-size: 0.85rem;
  }

 .h6 {
    font-size: 0.7rem;
  }

  .btn-sm {
    font-size: 0.rem;
    padding: 0.25rem 0.5rem;
  }
  .note-approbation {
    background-color: rgba(255, 255, 255, 0.1); /* gris pâle transparent */
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #e0f0ff;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(255, 255, 255, 0.1);
    resize: vertical;
  }

</style>
