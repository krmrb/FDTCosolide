<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog" style="background-color: rgba(0,0,0,0.5); z-index: 1050;">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5>{{ modeModification ? 'Modifier une demande de paiement' : 'Nouvelle demande de paiement' }}</h5>
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
                <input type="time" id="de" class="form-control form-control-sm" v-model="form.de" :disabled="form.touteJournee" />
              </div>
            </div>

            <div class="row mb-3" :style="{ opacity: form.touteJournee ? 0.5 : 1 }">
              <div class="col-md-7"><label for="a">Heure de fin</label></div>
              <div class="col-md-5">
                <input type="time" id="a" class="form-control form-control-sm" v-model="form.a" :disabled="form.touteJournee" />
              </div>
            </div>

            <!-- Commentaire -->
            <div class="mb-3">
              <label for="commentaire" class="form-label">Commentaire</label>
              <textarea id="commentaire"
                        class="form-control px-3"
                        v-model="form.commentaire"
                        rows="3"
                        placeholder="Ajouter un commentaire ici..."></textarea>
            </div>

            <!-- Validation -->
            <div class="row mb-3">
              <div class="col-md-7">
                <label for="validation">État de la demande</label>
              </div>
              <div class="col-md-5">
                <template v-if="estAdministrateur">
                  <select id="validation" class="form-select" v-model="form.validation">
                    <option value="en_attente">En attente</option>
                    <option value="approuvée">Approuvée</option>
                    <option value="refusée">Refusée</option>
                  </select>
                </template>
                <template v-else>
                  <div :class="['badge-validation', 'badge-' + form.validation]">
                    {{ form.validation }}
                  </div>
                </template>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-link text-danger text-decoration-underline" @click="$emit('cancel')">
              Annuler
            </button>

            <button type="button" class="btn btn-primary" @click="submitForm">
              {{ modeModification ? 'Modifier' : 'Soumettre' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import dayjs from 'dayjs'

  // Props
  const props = defineProps({
    evenement: Object,
    modeModification: Boolean,
    estAdministrateur: Boolean
  })

  // Événements
  const emit = defineEmits(['submit', 'cancel'])

  // Formulaire
  const form = ref({
    nomNaissance: 'Doiron',
    prenom: 'Cédric',
    emploi: '',
    lieu: '',
    date_deb: '',
    date_fin: '',
    touteJournee: false,
    de: '',
    a: '',
    commentaire: '',
    validation: 'en_attente'
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
        date_deb: evt.date ? dayjs(evt.date).format('YYYY-MM-DD') : '',
        date_fin: evt.date ? dayjs(evt.date).format('YYYY-MM-DD') : '',
        touteJournee: evt.touteJournee || false,
        de: evt.de || '',
        a: evt.a || '',
        commentaire: evt.commentaire || '',
        validation: evt.validation || 'en_attente'
      }
      dateCopier.value = true
    }
  }, { immediate: true })

  // Soumission
  const submitForm = () => {
    const emploi = emplois.find(e => e.code === form.value.emploi)
    const lieu = lieuxTravail.find(l => l.code === form.value.lieu)

    const formDataEnrichi = {
      ...form.value,
      emploiCorps: emploi?.corps_emploi || '',
      emploiLabel: emploi?.label || '',
      lieuLabel: lieu?.label || '',
      dateCreation: dayjs().format('YYYY-MM-DD')
    }

    emit('submit', formDataEnrichi)
  }
</script>
<style scoped>
  .modal-content {
    backdrop-filter: blur(12px);
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0, 115, 207, 0.3);
  }

  .modal-header h5 {
    font-weight: 600;
    color: #095797;
  }

  .tooltip-hover {
    position: relative;
    cursor: pointer;
  }

    .tooltip-hover::after {
      content: "Cocher si la journée est complète";
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

  .form-select,
  .form-control {
    border-radius: 6px;
  }

  .modal-footer .btn-primary {
    /*background-color: #0073CF;*/
    border-color: #0073CF;
  }

    .modal-footer .btn-primary:hover {
      /*background-color: #095797;*/
      border-color: #095797;
    }

  .modal-footer .btn-link {
    font-weight: 500;
  }

  /* Badges pour l'état de validation */
  .badge-validation {
    font-size: 0.85rem;
    padding: 4px 8px;
    border-radius: 6px;
    font-weight: 500;
  }

  .badge-en_attente {
    background-color: #ffc107;
    color: #212529;
  }

  .badge-approuvée {
    background-color: #28a745;
    color: #fff;
  }

  .badge-refusée {
    background-color: #dc3545;
    color: #fff;
  }
</style>
