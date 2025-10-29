<template>
  <div class="" id="corps">
    <div class="modal-header border-0">
      <button type="button" class="btn-close" @click="$emit('fermer')" aria-label="Fermer"></button>
    </div>

    <h3 class="mb-4 mt-3">Demande d'absence</h3>
    <div class="border-top border-3 border-primary my-4"></div>

    <!-- Formulaire -->
    <div>

      <!-- Dates début-->
      <div class="row mb-3 align-items-center">
        <div class="col-md-4"><label for="date">Date de début</label></div>
        <div class="col-md-4 text-end"><span class="text-muted me-2 fw-bold">{{ jourDebut }}</span></div>
        <div class="col-md-4"><input type="date" id="date_deb" class="form-control" v-model="form.date_deb" /></div>
      </div>

      <!-- Date fin-->
      <div class="row mb-3 align-items-center">
        <!-- Message d'erreur -->
        <div v-if="!isDateRangeValid" class="alert-message">
          <i class="bi bi-exclamation-triangle-fill text-warning"></i> La date de fin ne peut pas être antérieure à la date de début.
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

      <!-- Champ "De" -->
      <div class="row mb-3">
        <div class="col-md-7">
          <label for="de">Heure de début</label>
        </div>
        <div class="col-md-5">
          <input type="time" id="de" class="form-control form-control-sm" v-model="form.de" placeholder="ex: 08:00" />
        </div>
      </div>

      <!-- Champ "À" -->
      <div class="row mb-3">
        <div class="col-md-7">
          <label for="a">Heure de fin</label>
        </div>
        <div class="col-md-5">
          <input type="time" id="a" class="form-control form-control-sm" v-model="form.a" placeholder="ex: 16:00" />
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

      <!-- Solde de banque -->
      <div class="row mb-3">
        <div class="col-md-7"><label>Soldes de banque disponibles</label></div>
        <div class="col-md-5">
          <div class="mb-2 d-flex justify-content-between">
            <span class=" small">Maladie monnayable: </span>
            <span class="">15.5 jours</span>
          </div>
          <div class="mb-2 d-flex justify-content-between">
            <span class=" small">Vacances année courante: </span>
            <span class="">23 jours</span>
          </div>
          <div class="d-flex justify-content-between">
            <span class=" small">Temps compensé: </span>
            <span class="">8.5 jours</span>
          </div>
        </div>
      </div>

      <!-- Pièces jointes -->
      <div class="row mb-3">
        <div class="col-md-7">
          <label for="pieceJointe">Pièce jointe</label>
        </div>
        <div class="col-md-5">
          <input type="file" 
                  id="pieceJointe" 
                  class="form-control form-control-sm" 
                  @change="handleFileUpload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  multiple />
        </div>
      </div>

      <!-- Liste des fichiers sélectionnés -->
      <div v-if="form.fichiers.length > 0" class="row mb-3">
        <div class="col-md-7"></div>
        <div class="col-md-5">
          <div v-for="(fichier, index) in form.fichiers" :key="index" class="d-flex align-items-center justify-content-between bg-white border rounded p-2 mb-2">
            <div class="d-flex align-items-center flex-grow-1 me-2">
              <span class="me-2">📎</span>
              <span class="text-truncate small">{{ fichier.name }}</span>
            </div>
            <button type="button" 
                    class="btn btn-sm btn-outline-danger py-0 px-2" 
                    @click="removeFile(index)"
                    style="font-size: 0.8rem;">
              ✕
            </button>
          </div>
          <small class="text-muted d-block mt-1">PDF, DOC, DOCX, JPG, PNG (max 5 Mo)</small>
        </div>
      </div>

      <!-- Commentaire -->
      <div class="mb-3">
        <label class="form-label">Commentaire</label>
        <textarea class="form-control" v-model="form.commentaire" rows="3"></textarea>
      </div>
    </div>

    <!-- Boutons -->
    <div class="modal-footer">
      <button class="btn btn-outline-secondary" @click="$emit('fermer')">Annuler</button>
      <button class="btn btn-secondary" @click="enregistrer">Enregistrer</button>
      <button class="btn btn-success" @click="soumettre" :disabled="!isFormValid">{{ mode === 'ajout' ? '✅ Soumettre' : '✅ Soumettre' }}</button>
      <button v-if="mode === 'modification'" class="btn btn-danger" @click="$emit('retirer', demande)">🗑️ Retirer</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  form: Object,
  emplois: Array,
  lieuxTravail: Array,
  motifsAbsence: Array,
  jourDebut: String,
  jourFin: String,
  isDateRangeValid: Boolean,
  handleFileUpload: Function,
  removeFile: Function,
  soumettre: Function,
  mode: String,
  demande: Object
});

const emit = defineEmits(['fermer', 'retirer']);

// Validation du formulaire - tous les champs requis doivent être remplis
const isFormValid = computed(() => {
  return props.form.date_deb && 
         props.form.date_fin && 
         props.form.emploi && 
         props.form.lieu && 
         props.form.motif &&
         props.isDateRangeValid;
});

const enregistrer = () => {
  console.log('Demande enregistrée en brouillon');
  emit('fermer');
};
</script>

<style scoped>
#corps {
  padding-left: 1rem;
  padding-right: 1rem;
}

.modal-header {
  margin-left: -1rem;
  margin-right: -1rem;
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>