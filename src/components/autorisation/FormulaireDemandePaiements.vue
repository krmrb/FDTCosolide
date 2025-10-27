<template>
  <div class="body">
    <div class="responsive-container">
      <!-- Section infos demande -->
      <div class="mt-4 p-4">
        <h3 class="mb-4">Demande de paiement</h3>


        <div class="border-top border-3 border-primary my-4"></div>
      </div>

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
                   :disabled="form.paiementPonctuel"
                   :class="['form-control', { 'is-invalid': !isDateRangeValid }]"
                   :style="{ backgroundColor: form.paiementPonctuel ? '#f8f9fa' : '#fff', cursor: form.paiementPonctuel ? 'not-allowed' : 'text' }" />
          </div>
        </div>

    

        <!-- Heures -->
        <div class="row mb-3">
          <div class="col-12 col-md-7 mb-2 mb-md-0">
            <label for="heure_de">Heure DE</label>
          </div>
          <div class="col-12 col-md-5">
            <input type="time" id="heure_de" class="form-control form-control-sm" v-model="form.heure_de" placeholder="ex: 08:00" />
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-12 col-md-7 mb-2 mb-md-0">
            <label for="heure_a">Heure À</label>
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
        <div class="mt-4 d-flex flex-column flex-md-row justify-content-md-end gap-2">
          <button type="button"
                  class="btn btn-link text-danger text-decoration-underline order-2 order-md-1"
                  @click="resetForm">
            Annuler
          </button>
          <button type="submit"
                  class="btn btn-primary order-1 order-md-2"
                  @click.prevent="submitForm"
                  :disabled="!isFormValid">
            Soumettre la demande
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

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
  pieceJointe: null,
  commentaires: '',
  etat: 'En attente',
  dateSoumission: null
});

// Données de référence
const corpsEmplois = [
  { code: '3110', label: 'Enseignant' },
  { code: '3457', label: 'Suppléant' },
  { code: '2520', label: 'Concierge' },
  { code: '4210', label: 'Technicien' },
  { code: '5130', label: 'Secrétaire' }
];

const lieuxTravail = [
  { code: '001', label: 'École Primaire Sainte-Marie' },
  { code: '002', label: 'École Secondaire Jean-Baptiste' },
  { code: '003', label: 'Centre administratif' },
  { code: '004', label: 'École Polyvalente du Nord' }
];

const typesPaiement = [
  { code: 'TS', label: 'Temps supplémentaire' },
  { code: 'SC', label: 'Surcroît' },
  { code: 'BT', label: 'Banque de temps' },
  { code: 'ATP', label: 'ATP' },
  { code: 'TH', label: 'Taux horaire' },
  { code: 'SO', label: 'Suppléance occasionnelle' },
  { code: 'SST', label: 'Suppléance en sus de la tâche' },
  { code: 'PD', label: 'Prime de disponibilité' },
  { code: 'REMP', label: 'Remplacement' }
];

// Computed properties pour les jours de la semaine
const jourDe = computed(() => {
  if (!form.value.date_de) return '';
  const date = new Date(form.value.date_de);
  return date.toLocaleDateString('fr-FR', { weekday: 'long' });
});

const jourA = computed(() => {
  if (!form.value.date_a || form.value.paiementPonctuel) return '';
  const date = new Date(form.value.date_a);
  return date.toLocaleDateString('fr-FR', { weekday: 'long' });
});

// Validation des dates
const isDateRangeValid = computed(() => {
  if (!form.value.date_de || !form.value.date_a || form.value.paiementPonctuel) return true;
  return new Date(form.value.date_a) >= new Date(form.value.date_de);
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

// Watcher pour le paiement ponctuel
watch(() => form.value.paiementPonctuel, (newValue) => {
  if (newValue) {
    form.value.date_a = form.value.date_de;
  }
});

// Watcher pour copier automatiquement la date DE vers date À si paiement ponctuel
watch(() => form.value.date_de, (newDate) => {
  if (form.value.paiementPonctuel && newDate) {
    form.value.date_a = newDate;
  }
});

// Méthodes pour la gestion des fichiers
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const maxSize = 5 * 1024 * 1024; // 5 Mo
    
    // Vérification de la taille
    if (file.size > maxSize) {
      alert(`Le fichier "${file.name}" dépasse la taille maximale de 5 Mo.`);
      event.target.value = '';
      return;
    }
    
    form.value.pieceJointe = file;
  }
};

const downloadFile = () => {
  if (form.value.pieceJointe) {
    const url = URL.createObjectURL(form.value.pieceJointe);
    const a = document.createElement('a');
    a.href = url;
    a.download = form.value.pieceJointe.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

const removeFile = () => {
  form.value.pieceJointe = null;
  // Reset le input file
  const fileInput = document.getElementById('pieceJointe');
  if (fileInput) {
    fileInput.value = '';
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 octets';
  const k = 1024;
  const sizes = ['octets', 'Ko', 'Mo'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Méthodes
const submitForm = () => {
  if (!isFormValid.value) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }
  
  if (!isDateRangeValid.value) {
    alert("La date À ne peut pas être antérieure à la date DE.");
    return;
  }
  
  form.value.dateSoumission = new Date().toISOString();
  console.log('Demande de paiement soumise:', form.value);
  alert('Demande de paiement soumise avec succès !');
};

const resetForm = () => {
  form.value = {
    matricule: 'EMP001234',
    date_de: '',
    date_a: '',
    paiementPonctuel: true,
    heure_de: '',
    heure_a: '',
    corps_emploi: '',
    lieu: '',
    type_paiement: '',
    pieceJointe: null,
    commentaires: '',
    etat: 'En attente',
    dateSoumission: null
  };
};
</script>

<style scoped>
  /* Responsive container - Version desktop compacte */
  .responsive-container {
    width: 100%;
    max-width: 45%;
    margin: 0 auto;
    padding: 0 15px;
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
