<template>
  <div class="modal-backdrop fade show"></div>
  <div class="modal d-block" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">

      <div class="modal-header border-0">
        <button type="button" class="btn-close" @click="$emit('fermer')" aria-label="Fermer"></button>
      </div>

        <div class="modal-body">

          <h3 class="mb-3 mb-md-4"><i class="bi  me-2"></i>Demande de paiements</h3>


         <div class="border-top border-3 border-primary my-4"></div>

          <!-- Formulaire -->

          
          <div class="bg-light p-3 p-md-4">
            <!-- Date DE -->
            <div class="row mb-3 align-items-center">
              <div class="col-12 col-md-4 mb-2 mb-md-0"><label for="date_de">Date de début</label></div>
              <div class="col-12 col-md-4 text-md-end mb-2 mb-md-0">
                <span class="text-muted me-2 fw-bold">{{ jourDe }}</span>
              </div>
              <div class="col-12 col-md-4">
                <input type="date" id="date_de" class="form-control" v-model="form.date_de" />
              </div>
            </div>

            <!-- Date À -->
            <div class="row mb-3 align-items-center">
              <div v-if="!isDateRangeValid" class="alert-message col-12 mb-2">
                ⚠️ La date À ne peut pas être antérieure à la date début.
              </div>
              <div class="col-12 col-md-4 mb-2 mb-md-0"><label for="date_a">Date de fin</label></div>
              <div class="col-12 col-md-4 text-md-end mb-2 mb-md-0">
                <span class="text-muted me-2 fw-bold">{{ jourA }}</span>
              </div>
              <div class="col-12 col-md-4">
                <input type="date"
                      id="date_a"
                      v-model="form.date_a"
                      :class="['form-control', { 'is-invalid': !isDateRangeValid }]" />
              </div>
            </div>

            <!-- Heures -->
            <div class="row mb-3">
              <div class="col-12 col-md-7 mb-2 mb-md-0">
                <label for="heure_de">Heure de début</label>
              </div>
              <div class="col-12 col-md-5">
                <input type="time" id="heure_de" class="form-control form-control-sm" v-model="form.heure_de" placeholder="ex: 08:00" />
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-12 col-md-7 mb-2 mb-md-0">
                <label for="heure_a">Heure de fin</label>
              </div>
              <div class="col-12 col-md-5">
                <input type="time" id="heure_a" class="form-control form-control-sm" v-model="form.heure_a" placeholder="ex: 16:00" />
              </div>
            </div>

            <!-- Corps d'emploi -->
            <div class="row mb-3">
              <div class="col-12 col-md-7 mb-2 mb-md-0"><label for="corps_emploi">Corps d'emploi</label></div>
              <div class="col-12 col-md-5">
                <select id="corps_emploi" class="form-select" v-model="form.corps_emploi">
                  <option v-for="emploi in corpsEmplois" :key="emploi.code" :value="emploi.code">
                    {{ emploi.code }} - {{ emploi.label }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Lieu de travail -->
            <div class="row mb-3">
              <div class="col-12 col-md-7 mb-2 mb-md-0"><label for="lieu">Lieu de travail</label></div>
              <div class="col-12 col-md-5">
                <select id="lieu" class="form-select" v-model="form.lieu">
                  <option v-for="lieu in lieuxTravail" :key="lieu.code" :value="lieu.code">
                    {{ lieu.code }} - {{ lieu.label }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Type de paiement -->
            <div class="row mb-3">
              <div class="col-12 col-md-7 mb-2 mb-md-0"><label for="type_paiement">Type de paiement</label></div>
              <div class="col-12 col-md-5">
                <select id="type_paiement" class="form-select" v-model="form.type_paiement">
                  <option v-for="type in typesPaiement" :key="type.code" :value="type.code">
                    {{ type.label }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Minutes éducatives (uniquement pour corps d'emploi commençant par 3) -->
            <div v-if="isCorpsEmploi3xxx" class="row mb-3">
              <div class="col-12 col-md-7 mb-2 mb-md-0">
                <label for="minutes_educatives">Minutes éducatives</label>
              </div>
              <div class="col-12 col-md-5">
                <input type="number" id="minutes_educatives" class="form-control form-control-sm" v-model="form.minutes_educatives" placeholder="ex: 120" />
              </div>
            </div>

            <!-- Minutes tâches autres (uniquement pour corps d'emploi commençant par 3) -->
            <div v-if="isCorpsEmploi3xxx" class="row mb-3">
              <div class="col-12 col-md-7 mb-2 mb-md-0">
                <label for="minutes_taches_autres">Minutes tâches autres</label>
              </div>
              <div class="col-12 col-md-5">
                <input type="number" id="minutes_taches_autres" class="form-control form-control-sm" v-model="form.minutes_taches_autres" placeholder="ex: 60" />
              </div>
            </div>

            <!-- Pièce jointe -->
            <div class="row mb-3">
              <div class="col-12 col-md-7 mb-2 mb-md-0">
                <label for="pieceJointe">Pièce jointe</label>
              </div>
              <div class="col-12 col-md-5">
                <input type="file" 
                      id="pieceJointe" 
                      class="form-control form-control-sm" 
                      @change="handleFileUpload"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
              </div>
            </div>

            <!-- Fichier attaché -->
            <div v-if="form.pieceJointe" class="row mb-3">
              <div class="col-12 col-md-7"></div>
              <div class="col-12 col-md-5">
                <div class="d-flex align-items-center justify-content-between bg-white border rounded p-2">
                  <div class="d-flex align-items-center flex-grow-1 me-2">
                    <span class="me-2">📎</span>
                    <span class="text-truncate small">{{ form.pieceJointe.name }}</span>
                  </div>
                  <button type="button" 
                          class="btn btn-sm btn-outline-danger py-0 px-2" 
                          @click="removeFile"
                          style="font-size: 0.8rem;">
                    ✕
                  </button>
                </div>
                <small class="text-muted d-block mt-1">PDF, DOC, DOCX, JPG, PNG (max 5 Mo)</small>
              </div>
            </div>

            <!-- Commentaires -->
            <div class="mb-3">
              <label for="commentaires" class="form-label">Commentaires</label>
              <textarea id="commentaires"
                        class="form-control"
                        v-model="form.commentaires"
                        rows="3"
                        placeholder="Ajouter des commentaires..."></textarea>
            </div>

            <!-- Boutons -->
            <div class="modal-footer">
               <button class="btn btn-outline-secondary" @click="$emit('fermer')">Annuler</button>
               <button class="btn btn-secondary" @click="enregistrer">Enregistrer</button>
               <button class="btn btn-success" @click="soumettre" :disabled="!isFormValid">
                 {{ mode === 'ajout' ? '✅ Soumettre' : '✅ Soumettre' }}
               </button>
               <button v-if="mode === 'modification'" class="btn btn-danger" @click="$emit('retirer', demande)">🗑️ Retirer</button>
            </div>
      </div>



        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import corpsEmploiData from '@/types/corpsEmploi.json';
import typePaiementData from '@/types/typePaiement.json';

// Données du formulaire
const form = ref({
  matricule: 'EMP001234',
  date_de: '',
  date_a: '',
  paiementPonctuel: true,
  heure_de: '',
  heure_a: '',
  corps_emploi: '',
  lieu: '',
  type_paiement: '',
  minutes_educatives: '',
  minutes_taches_autres: '',
  pieceJointe: null,
  commentaires: '',
  etat: 'En attente',
  dateSoumission: null
});


// Données de référence - Utiliser les données des fichiers JSON
const corpsEmplois = corpsEmploiData.corpsEmploi.map(item => ({
  code: item.code,
  label: item.description
}));

const lieuxTravail = [
  { code: '001', label: 'École Primaire Sainte-Marie' },
  { code: '002', label: 'École Secondaire Jean-Baptiste' },
  { code: '003', label: 'Centre administratif' },
  { code: '004', label: 'École Polyvalente du Nord' }
];

const typesPaiement = typePaiementData.typePaiement.map(item => ({
  code: item.code,
  label: item.description
}));

// Computed properties pour les jours de la semaine
const jourDe = computed(() => {
  if (!form.value.date_de) return '';
  const date = new Date(form.value.date_de);
  return date.toLocaleDateString('fr-FR', { weekday: 'long' });
});

const jourA = computed(() => {
  if (!form.value.date_a) return '';
  const date = new Date(form.value.date_a);
  return date.toLocaleDateString('fr-FR', { weekday: 'long' });
});

// Validation des dates
const isDateRangeValid = computed(() => {
  if (!form.value.date_de || !form.value.date_a) return true;
  return new Date(form.value.date_a) >= new Date(form.value.date_de);
});

// Vérifier si le corps d'emploi commence par 3
const isCorpsEmploi3xxx = computed(() => {
  return form.value.corps_emploi && form.value.corps_emploi.toString().startsWith('3');
});

// Validation du formulaire
const isFormValid = computed(() => {
  return form.value.date_de && 
         form.value.heure_de && 
         form.value.heure_a && 
         form.value.corps_emploi && 
         form.value.lieu && 
         form.value.type_paiement &&
         isDateRangeValid.value;
});


const props = defineProps({
  demande: {
    type: Object,
    default: null
  }
})


const mode = computed(() => {
  console.log('Mode calculé - props.demande:', props.demande)
  return props.demande ? 'modification' : 'ajout'
})

const emit = defineEmits(['fermer', 'soumettre', 'retirer'])

// Gestion des fichiers
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const maxSize = 5 * 1024 * 1024; // 5 Mo
    if (file.size > maxSize) {
      alert(`Le fichier dépasse la taille maximale de 5 Mo.`);
      return;
    }
    form.value.pieceJointe = file;
  }
};

const removeFile = () => {
  form.value.pieceJointe = null;
};

function enregistrer() {
  console.log('Demande enregistrée en brouillon');
  emit('fermer');
}

function soumettre() {
  if (!isFormValid.value) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }
  
  if (!isDateRangeValid.value) {
    alert("La date de fin ne peut pas être antérieure à la date de début.");
    return;
  }
  
  // Ajouter la date de soumission
  form.value.dateSoumission = new Date().toISOString();
  
  emit('soumettre', form.value);
}
</script>

<style scoped>
.champ-align {
  width: 100%;
  max-width: 600px;
}



.champ-compact {
  width: 150px;
  min-width: 80px;
}

.label-fixed {
  width: 150px;
  min-width: 80px;
}


  /* Responsive container - Version desktop compacte */
  .responsive-container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 0 15px;
  }

  @media (min-width: 992px) and (max-width: 1400px) {
    .responsive-container {
      max-width: 700px;
    }
  }

  @media (max-width: 991px) {
    .responsive-container {
      max-width: 85%;
    }
  }

  @media (max-width: 768px) {
    .responsive-container {
      max-width: 95%;
    }
  }

  @media (max-width: 576px) {
    .responsive-container {
      max-width: 100%;
      padding: 0 10px;
    }
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

  /* Responsive info rows */
  .info-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
  }

  .info-label {
    flex: 0 0 160px;
    font-weight: bold;
    color: #555;
  }

  .info-value {
    flex: 1;
    color: #222;
    word-break: break-word;
  }

  /* Mobile styles for info rows */
  @media (max-width: 768px) {
    .info-row {
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 15px;
    }

    .info-label {
      flex: none;
      margin-bottom: 4px;
      font-size: 0.9rem;
    }

    .info-value {
      font-size: 0.9rem;
    }

    /* Responsive buttons */
    .btn {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
    }

    /* Better form controls on mobile */
    .form-control, .form-select {
      font-size: 16px; /* Prevents zoom on iOS */
    }

    /* Mobile file upload */
    .file-upload-label {
      padding: 1.5rem 1rem;
    }

    .file-actions {
      margin-top: 0.5rem;
    }

    .file-actions .btn {
      margin-bottom: 0.25rem;
    }
  }

  /* Extra small screens */
  @media (max-width: 576px) {
    .info-label {
      font-size: 0.85rem;
    }

    .info-value {
      font-size: 0.85rem;
    }

    .btn {
      width: 100%;
      margin-bottom: 0.5rem;
    }

    .gap-2 {
      gap: 0 !important;
    }

    .file-actions {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .file-actions .btn {
      width: auto;
      margin: 0;
    }
  }

  .form-control:disabled {
    opacity: 0.65;
  }

  .btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .text-primary {
    color: #095797 !important;
  }
</style>