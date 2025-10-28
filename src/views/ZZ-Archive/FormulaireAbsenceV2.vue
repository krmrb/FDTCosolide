<template>
  <div class="body">
    <div class="custom-container">
      <!-- Identité -->
      <div class="mt-4 p-4">

        <h3 class="mb-4">Formulaire d'absence</h3>
        <div class="border-top border-3 border-primary my-4"></div>
        <div class="row mb-3 align-items-center">
          <div class="col-md-6 ">
            <strong>Nom à la naissance</strong>
            <div>{{ form.nomNaissance }}</div>
          </div>
          <div class="col-md-6">
            <strong>Prénom</strong>
            <div>{{ form.prenom }}</div>
          </div>
        </div>
      </div>

      <!-- Formulaire -->
      <div class="bg-light p-4 align-items-center">

        <div class="row mb-3 align-items-center">
          <!-- Emploi -->
          <div class="col-md-6 d-flex align-items-center gap-4">
            <label for="emploi" class="me-4 mb-0">Emploi</label>
            <select id="emploi" class="form-select form-select-sm " v-model="form.emploi">
              <option v-for="job in emplois" :key="job.code" :value="job.code">
                {{job.corps_emploi}} - {{ job.label }}
              </option>
            </select>
          </div>

          <!-- Lieu de travail -->
          <div class="col-md-6 d-flex align-items-center gap-2">
            <label for="lieu" class="me-2 mb-0">Lieu de travail</label>
            <select id="lieu" class="form-select form-select-sm " v-model="form.lieu">
              <option v-for="lieu in lieuxTravail" :key="lieu.code" :value="lieu.code">
                {{ lieu.code }} - {{ lieu.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Motif d'absence -->
        <div class="row mb-8 mb-3 align-items-center">
          <div class="col-md-6 d-flex align-items-center gap-5">
            <label class="me-2" for="motif">Motif </label>
            <select id="motif" class="form-select form-select-sm " v-model="form.motif">
              <option v-for="motif in motifsAbsence" :key="motif.code" :value="motif.code">
                {{ motif.code }} - {{ motif.label }}
              </option>
            </select>
          </div>
        </div>
        <!-- Message d'erreur -->
        <div v-if="!isDateRangeValid" class="alert-message">
          ⚠️ La date de fin ne peut pas être antérieure à la date de début.
        </div>
        <div class="row mb-3 align-items-center">
          <!-- Date début -->
          <div class="col-md-6 d-flex align-items-center gap-2">
            <label for="date_deb" class="mb-0 me-2">Date de début</label>
            <span class="section-sans-gras  text-muted">{{ jourDebut }}</span>
            <input type="date" id="date_deb" class="form-control form-control-sm w-auto" v-model="form.date_deb" />
          </div>

          <!-- Date fin -->
          <div class="col-md-6 d-flex align-items-center gap-2">
            <label for="date_fin" class="mb-0 me-2">Date de fin</label>
            <span class="section-sans-gras  text-muted">{{ jourFin }}</span>
            <input type="date" id="date_fin" class="form-control form-control-sm w-auto" v-model="form.date_fin" />
          </div>
        </div>

        <!-- Checkbox "Journée entière" avec info au survol -->
        <div class="col-md-6 mb-3 d-flex align-items-center">
          <label class="form-check-label me-2" for="touteJournee">Journée entière</label>
          <div class="form-check tooltip-hover">
            <input class="form-check-input me-2"
                   type="checkbox"
                   id="touteJournee"
                   v-model="form.touteJournee" />
          </div>
        </div>
        <div class="row mb-3 align-items-center">
          <!-- Champ "De" -->
          <div class="col-md-6 d-flex align-items-center"
               :style="{ opacity: form.touteJournee ? 0.5 : 1 }">
            <label class="me-2" for="de">Heure de début</label>
            <input type="time" id="de" class="form-control form-control-sm flex-grow-1 w-auto"
                   v-model="form.de"
                   v-bind:disabled="form.touteJournee"
                   placeholder="ex: 08:00" />
          </div>
          <!-- Champ "À" -->
          <div class="col-md-6 d-flex align-items-center"
               :style="{ opacity: form.touteJournee ? 0.5 : 1 }">
            <label class="me-2" for="a">Heure de fin</label>
            <input type="time" id="a" class="form-control form-control-sm flex-grow-1 w-auto"
                   v-model="form.a"
                   v-bind:disabled="form.touteJournee"
                   placeholder="ex: 16:00" />
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
          <button type="button"
                  class="btn btn-link text-danger text-decoration-underline"
                  @click="$emit('cancel')">
            Annuler
          </button>
          <button type="submit" class="btn btn-primary" @click.prevent="submitForm">Soumettre</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';

  // Données du formulaire
  const form = ref({
    nomNaissance: 'Dorion',
    prenom: 'Cédric',
    emploi: 'A',
    lieu: '001',
    motif: '',
    date_deb: '',
    date_fin: '',
    touteJournee: false,
    de: '',
    a: '',
    commentaire: ''
  });

  const emplois = [
    { code: 'A', label: 'Enseignant', corps_emploi: '3110' },
    { code: 'B', label: 'Suppléant', corps_emploi: '3457' },
    { code: 'C', label: 'Concierge', corps_emploi: '2520' }
  ];

  const lieuxTravail = [
    { code: '001', label: 'École Untel' },
    { code: '002', label: 'École Deux' },
    { code: '003', label: 'École Trois' }
  ];

  const motifsAbsence = [
    { code: '01', label: 'Maladie' },
    { code: '02', label: 'Congé' },
    { code: '03', label: 'Vacance' }
  ];

  const dateCopier = ref(false);

  // Méthode de soumission
  const submitForm = () => {
    if (!isDateRangeValid.value) {
      alert("La date de fin ne peut pas être antérieure à la date de début.");
      return;
    }
    console.log('Formulaire soumis:', form.value);
  };

  // Validation des dates
  const isDateRangeValid = computed(() => {
    if (!form.value.date_deb || !form.value.date_fin) return true;
    return new Date(form.value.date_fin) >= new Date(form.value.date_deb);
  });

  // Copier automatiquement la date de début vers la date de fin
  watch(() => form.value.date_deb, (newDate) => {
    if (!dateCopier.value && newDate) {
      form.value.date_fin = newDate;
      dateCopier.value = true;
    }
  });

  // Calcul des jours
  const jourDebut = computed(() => {
    if (!form.value.date_deb) return '';
    const date = new Date(form.value.date_deb);
    return date.toLocaleDateString('fr-FR', { weekday: 'long' });
  });

  const jourFin = computed(() => {
    if (!form.value.date_fin) return '';
    const date = new Date(form.value.date_fin);
    return date.toLocaleDateString('fr-FR', { weekday: 'long' });
  });
</script>
<style scoped>

  .custom-container {
    width: 100%;
    max-width: 45%;
    margin: 0 auto;
    font-weight: bold;
    color: #656565;
  }

  .form-check-input {
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
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

  .section-sans-gras {
    font-weight: normal;
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
  .body {
    padding-bottom: 24rem;
  }
</style>
