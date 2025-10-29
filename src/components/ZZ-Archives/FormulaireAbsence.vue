<template>
    <div class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5>{{ modeModification ? 'Modifier une absence' : 'Demande absence' }}</h5>
            <button type="button" class="btn-close" @click="$emit('cancel')"></button>
          </div>

          <div class="modal-body">
            <!-- Identité -->
            <div class="row mb-3">
              <div class="col-md-6">
                <strong>Nom à la naissance</strong>
                <div>{{ form.nomNaissance }}</div>
              </div>
              <div class="col-md-6">
                <strong>Prénom</strong>
                <div>{{ form.prenom }}</div>
              </div>
            </div>

            <hr class="border-top border-3 border-primary my-4" />

            <div class="bg-light p-4">
              <!-- Emploi -->
              <div class="row mb-3">
                <div class="col-md-7"><label for="emploi">Emploi</label></div>
                <div class="col-md-5">
                  <select id="emploi" class="form-select" v-model="form.emploi">
                    <option v-for="job in emplois" :key="job.code" :value="job.code">
                      {{ job.code }} - {{ job.corps_emploi }} - {{ job.label }}
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

              <!-- Dates -->
              <div class="row mb-3">
                <div class="col-md-7"><label for="date_deb">Date de début</label></div>
                <div class="col-md-5">
                  <input type="date" id="date_deb" class="form-control" v-model="form.date_deb" />
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-7"><label for="date_fin">Date de fin</label></div>
                <div class="col-md-5">
                  <input type="date" id="date_fin" class="form-control" v-model="form.date_fin" />
                </div>
              </div>

              <!-- Journée entière -->
              <div class="row mb-3">
                <div class="col-md-12 d-flex justify-content-end align-items-center">
                  <label class="form-check-label me-2" for="touteJournee">Journée entière</label>
                  <div class="form-check tooltip-hover">
                    <input class="form-check-input me-2" type="checkbox" id="touteJournee" v-model="form.touteJournee" />
                  </div>
                </div>
              </div>

              <!-- Heures -->
              <div class="row mb-3" :style="{ opacity: form.touteJournee ? 0.5 : 1 }">
                <div class="col-md-7"><label for="de">Heure de début</label></div>
                <div class="col-md-5">
                  <input type="time" id="de" class="form-control form-control-sm" v-model="form.de" v-bind:disabled="form.touteJournee" />
                </div>
              </div>

              <div class="row mb-3" :style="{ opacity: form.touteJournee ? 0.5 : 1 }">
                <div class="col-md-7"><label for="a">Heure de fin</label></div>
                <div class="col-md-5">
                  <input type="time" id="a" class="form-control form-control-sm" v-model="form.a" v-bind:disabled="form.touteJournee" />
                </div>
              </div>
            </div>

            <!-- Commentaire -->
            <div class="mb-3  px-3">
              <label for="commentaire" class="form-label">Commentaire</label>
              <textarea id="commentaire"
                        class="form-control"
                        v-model="form.commentaire"
                        rows="3"
                        placeholder="Ajouter un commentaire ici..."></textarea>
            </div>
            {{formulaireValide}}
            <div class="modal-footer">
              <button type="button" class="btn btn-link text-danger text-decoration-underline" @click="$emit('cancel')">
                Annuler
              </button>

              <button v-if="!modeModification || props.evenement?.validation === 'En création'"
                      type="button"
                      class="btn btn-link"
                      @click="enregistrerBrouillon">
                Enregistrer
              </button>

              <button type="button"
                      class="btn btn-primary"
                      :disabled="!formulaireValide"
                      @click="submitForm">
                {{ modeSoumission }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
  import { ref, watch, computed } from 'vue'
  import dayjs from 'dayjs'

  // Props
  const props = defineProps({
    evenement: Object,
    modeModification: Boolean
  })

  // Événements
  const emit = defineEmits(['submit', 'cancel'])

  // Formulaire
  const form = ref({
    nomNaissance: 'Doiron',
    prenom: 'Cédric',
    emploi: '',
    lieu: '',
    motif: '',
    date_deb: '',
    date_fin: '',
    touteJournee: false,
    de: '',
    a: '',
    commentaire: ''
  })

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
    { code: '01', label: 'Congé maladie' },
    { code: '02', label: 'Vacances' },
    { code: '03', label: 'Congé personnel' }
  ]

  // Copie automatique de la date
  const dateCopier = ref(false)
  watch(() => form.value.date_deb, (newDate) => {
    if (!dateCopier.value && newDate) {
      form.value.date_fin = newDate
      dateCopier.value = true
    }
  })

  // Pré-remplissage en mode modification
  watch(() => props.evenement, (evt) => {
    if (evt) {
      form.value = {
        nomNaissance: evt.nomNaissance || '',
        prenom: evt.prenom || '',
        emploi: evt.emploiCode || '',
        lieu: evt.lieuCode || '',
        motif: evt.motifCode || '',
        date_deb: evt.date ? dayjs(evt.date).format('YYYY-MM-DD') : '',
        date_fin: evt.date ? dayjs(evt.date).format('YYYY-MM-DD') : '',
        touteJournee: evt.touteJournee || false,
        de: evt.de || '',
        a: evt.a || '',
        commentaire: evt.commentaire || '',
        validation: evt.validation || 'En création'
      }
      dateCopier.value = true
    }
  }, { immediate: true })

  // Soumission
  const submitForm = () => {
    const emploi = emplois.find(e => e.code === form.value.emploi)
    const lieu = lieuxTravail.find(l => l.code === form.value.lieu)
    const motif = motifsAbsence.find(m => m.code === form.value.motif)

    const formDataEnrichi = {
      ...form.value,
      emploiLabel: emploi?.label || '',
      emploiCorps: emploi?.corps_emploi || '',
      lieuLabel: lieu?.label || '',
      motifLabel: motif?.label || '',
      dateCreation: dayjs().format('YYYY-MM-DD')
    }

    emit('submit', formDataEnrichi)
  }

  // Enregistrer comme brouillon
  const enregistrerBrouillon = () => {
    const emploi = emplois.find(e => e.code === form.value.emploi)
    const lieu = lieuxTravail.find(l => l.code === form.value.lieu)
    const motif = motifsAbsence.find(m => m.code === form.value.motif)

    const formDataEnrichi = {
      ...form.value,
      emploiLabel: emploi?.label || '',
      emploiCorps: emploi?.corps_emploi || '',
      lieuLabel: lieu?.label || '',
      motifLabel: motif?.label || '',
      dateCreation: dayjs().format('YYYY-MM-DD'),
      validation: 'En création'
    }

    emit('submit', formDataEnrichi)
  }

  //Validation
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

  // texte du bouton
  const modeSoumission = computed(() => {
    if (props.modeModification) {
      if (props.evenement?.validation === 'En création') {
        return "Soumettre"
      }
      else {
        return "Modifier"
      }
    }
    else {
      return "Soumettre"
    }

  } )

</script>

<style scoped>
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
</style>
