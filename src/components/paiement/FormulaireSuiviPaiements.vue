<template>
  <div class="responsive-container">
    <!-- Section infos demande -->
    <div>
      <div class="p-3 p-md-4 bg-white border rounded shadow-sm mb-3">
        <h4 class="mb-3 mb-md-4 text-primary"><i class="bi bi-info-circle me-2"></i>Suivi de mes demandes de paiements</h4>
          
          <!-- Matricule -->
          <div class="info-row">
            <span class="info-label">Matricule</span>
            <span class="info-value text-muted"><i class="bi bi-person-badge me-1"></i>{{ form.matricule }}</span>
          </div>
          
          <!-- Demandé par/Initié par -->
          <div class="info-row">
            <span class="info-label">Initié par</span>
            <span class="info-value"><i class="bi bi-person-circle me-1"></i>{{ form.initiePar }}</span>
          </div>
          
          <div class="info-row">
            <span class="info-label">Pièce jointe</span>
            <span class="info-value">
              <i class="bi bi-paperclip me-1"></i>
              <template v-if="form.pieceJointeSoumise">
                <a href="#" @click.prevent="downloadSubmittedFile" class="piece-jointe-link">
                  {{ form.pieceJointeSoumise }}
                  <i class="bi bi-download ms-2"></i>
                </a>
              </template>
              <span v-else class="text-muted">Aucune pièce jointe</span>
            </span>
          </div>
          
          <div class="info-row">
            <span class="info-label">État</span>
            <span class="info-value text-success"><i class="bi bi-flag me-1"></i>{{ form.etat || 'En attente' }}</span>
          </div>
          
          <div class="info-row">
            <span class="info-label">Date de soumission</span>
            <span class="info-value"><i class="bi bi-calendar-event me-1"></i>{{ form.dateSoumission ? new Date(form.dateSoumission).toLocaleDateString('fr-FR') : 'Non soumis' }}</span>
          </div>
          
          <div class="info-row">
            <span class="info-label"><i class="bi bi-chat-left-text me-1"></i>Commentaire</span>
            <span class="info-value readonly-comment-v5">
              <span class="d-flex align-items-center" @click="showHistorique = !showHistorique" style="cursor:pointer;">
                {{ form.commentaireSuivi ? form.commentaireSuivi : 'Aucun commentaire de suivi.' }}
                <i :class="['bi', showHistorique ? 'bi-chevron-up' : 'bi-chevron-down']" style="margin-left:8px;"></i>
              </span>
              <div v-if="showHistorique" class="historique-commentaire mt-2">
                <div v-for="(item, idx) in historiqueCommentaires" :key="idx" class="mb-1">
                  <span class="text-secondary">{{ item.date }} :</span>
                  <span>{{ item.commentaire }}</span>
                  <span class="badge bg-light text-dark ms-2">{{ item.etat }}</span>
                </div>
              </div>
            </span>
          </div>
        </div>
        <div class="border-top border-3 border-primary my-3 my-md-4"></div>
      </div>

      <!-- Formulaire -->
      <div class="bg-light p-3 p-md-4">
        <!-- Date DE -->
        <div class="row mb-3 align-items-center">
          <div class="col-12 col-md-4 mb-2 mb-md-0"><label for="date_de">Date DE</label></div>
          <div class="col-12 col-md-4 text-md-end mb-2 mb-md-0">
            <span class="text-muted me-2 fw-bold">{{ jourDe }}</span>
          </div>
          <div class="col-12 col-md-4">
            <input type="date" id="date_de" class="form-control" v-model="form.date_de" disabled />
          </div>
        </div>

        <!-- Date À -->
        <div class="row mb-3 align-items-center">
          <div v-if="!isDateRangeValid" class="alert-message col-12 mb-2">
            ⚠️ La date À ne peut pas être antérieure à la date DE.
          </div>
          <div class="col-12 col-md-4 mb-2 mb-md-0"><label for="date_a">Date À</label></div>
          <div class="col-12 col-md-4 text-md-end mb-2 mb-md-0">
            <span class="text-muted me-2 fw-bold">{{ jourA }}</span>
          </div>
          <div class="col-12 col-md-4">
            <input type="date"
                   id="date_a"
                   v-model="form.date_a"
                   disabled
                   :class="['form-control', { 'is-invalid': !isDateRangeValid }]" />
          </div>
        </div>

        <!-- Heures -->
        <div class="row mb-3">
          <div class="col-12 col-md-7 mb-2 mb-md-0">
            <label for="heure_de">Heure DE</label>
          </div>
          <div class="col-12 col-md-5">
            <input type="time" id="heure_de" class="form-control form-control-sm" v-model="form.heure_de" placeholder="ex: 08:00" disabled />
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-12 col-md-7 mb-2 mb-md-0">
            <label for="heure_a">Heure À</label>
          </div>
          <div class="col-12 col-md-5">
            <input type="time" id="heure_a" class="form-control form-control-sm" v-model="form.heure_a" placeholder="ex: 16:00" disabled />
          </div>
        </div>

        <!-- Minutes tâches éducatives (uniquement pour corps d'emploi 3***) -->
        <div v-if="isCorpsEmploi3xxx" class="row mb-3">
          <div class="col-12 col-md-7 mb-2 mb-md-0">
            <label for="minutes_educatives">Minutes tâches éducatives</label>
          </div>
          <div class="col-12 col-md-5">
            <input type="number" id="minutes_educatives" class="form-control form-control-sm" v-model="form.minutes_educatives" placeholder="ex: 60" min="0" disabled />
          </div>
        </div>

        <!-- Minutes tâches autres (uniquement pour corps d'emploi 3***) -->
        <div v-if="isCorpsEmploi3xxx" class="row mb-3">
          <div class="col-12 col-md-7 mb-2 mb-md-0">
            <label for="minutes_autres">Minutes tâches autres</label>
          </div>
          <div class="col-12 col-md-5">
            <input type="number" id="minutes_autres" class="form-control form-control-sm" v-model="form.minutes_autres" placeholder="ex: 30" min="0" disabled />
          </div>
        </div>

        <!-- Corps d'emploi -->
        <div class="row mb-3">
          <div class="col-12 col-md-7 mb-2 mb-md-0"><label for="corps_emploi">Corps d'emploi</label></div>
          <div class="col-12 col-md-5">
            <select id="corps_emploi" class="form-select" v-model="form.corps_emploi" disabled>
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
            <select id="lieu" class="form-select" v-model="form.lieu" disabled>
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
            <select id="type_paiement" class="form-select" v-model="form.type_paiement" disabled>
              <option v-for="type in typesPaiement" :key="type.code" :value="type.code">
                {{ type.code }} - {{ type.label }}
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
                    placeholder="Ajouter un commentaire ici..."
                    disabled></textarea>
        </div>

        <!-- Bouton Retour -->
        <div class="mt-4 d-flex justify-content-end">
          <button type="button" class="btn btn-secondary" @click="$emit('fermer')">
            <i class="bi bi-arrow-left me-2"></i>Retour
          </button>
        </div>
      </div>
    </div>

</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps({
  demande: {
    type: Object,
    default: null
  }
});

// Données du formulaire
const form = ref({
  matricule: 'EMP001234',
  initiePar: 'Cédric Doiron',
  date_de: '2025-01-15',
  date_a: '2025-01-15',
  paiementPonctuel: true,
  heure_de: '08:00',
  heure_a: '16:00',
  corps_emploi: '3110',
  lieu: '001',
  type_paiement: 'TS',
  minutes_educatives: 0,
  minutes_autres: 0,
  pieceJointe: {
    name: 'document_supplementaire.pdf',
    size: 245760, // 240 KB
    type: 'application/pdf',
    lastModified: Date.now(),
    isExisting: true
  },
  pieceJointeSoumise: 'justificatif_paiement.pdf',
  commentaires: '',
  commentaireSuivi: 'Demande de temps supplémentaire pour projet urgent',
  etat: 'En attente d\'approbation',
  dateSoumission: '2025-01-10T10:30:00.000Z'
});

const showHistorique = ref(false);
const historiqueCommentaires = [
  { date: '2025-01-10', commentaire: 'Demande initiale soumise', etat: 'Soumis' },
  { date: '2025-01-12', commentaire: 'Vérification en attente d\'approbation par RH', etat: 'En attente d\'approbation' },
  { date: '2025-01-14', commentaire: 'Justificatif supplémentaire demandé', etat: 'En attente d\'une pièce justificative' },
];

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
  if (!form.value.date_a) return '';
  const date = new Date(form.value.date_a);
  return date.toLocaleDateString('fr-FR', { weekday: 'long' });
});

// Computed pour vérifier si corps d'emploi commence par 3
const isCorpsEmploi3xxx = computed(() => {
  return form.value.corps_emploi && form.value.corps_emploi.toString().startsWith('3');
});

// Méthodes pour obtenir les labels
const getCorpsEmploiLabel = (code) => {
  const emploi = corpsEmplois.find(e => e.code === code);
  return emploi ? emploi.label : code;
};

const getLieuTravailLabel = (code) => {
  const lieu = lieuxTravail.find(l => l.code === code);
  return lieu ? `${lieu.code} - ${lieu.label}` : code;
};

const getTypePaiementLabel = (code) => {
  const type = typesPaiement.find(t => t.code === code);
  return type ? type.label : code;
};

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
const downloadExistingFile = () => {
  // Simulation du téléchargement du fichier existant
  alert(`Téléchargement de ${form.value.pieceJointe.name}`);
  // Dans une vraie application, on créerait un blob et on le téléchargerait
};

const removeExistingFile = () => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer ${form.value.pieceJointe.name} ?`)) {
    form.value.pieceJointe = null;
    alert('Fichier supprimé avec succès');
  }
};

const downloadSubmittedFile = () => {
  alert(`Téléchargement de ${form.value.pieceJointeSoumise}`);
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Méthodes du formulaire
const submitForm = () => {
  if (!isFormValid.value) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }
  
  if (!isDateRangeValid.value) {
    alert("La date À ne peut pas être antérieure à la date DE.");
    return;
  }
  
  console.log('Modification de paiement soumise:', form.value);
  alert('Modification de paiement soumise avec succès !');
};

const resetForm = () => {
  form.value.date_de = '2025-01-15';
  form.value.date_a = '2025-01-15';
  form.value.paiementPonctuel = true;
  form.value.heure_de = '08:00';
  form.value.heure_a = '16:00';
  form.value.corps_emploi = '3110';
  form.value.lieu = '001';
  form.value.type_paiement = 'TS';
  form.value.minutes_educatives = 0;
  form.value.minutes_autres = 0;
  form.value.pieceJointe = {
    name: 'document_supplementaire.pdf',
    size: 245760,
    type: 'application/pdf',
    lastModified: Date.now(),
    isExisting: true
  };
  form.value.commentaires = '';
};
</script>

<style scoped>
  /* Responsive container - Prend toute la largeur disponible */
  .responsive-container {
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 0;
  }

  @media (min-width: 992px) and (max-width: 1400px) {
    .responsive-container {
      max-width: 100%;
    }
  }

  @media (max-width: 991px) {
    .responsive-container {
      max-width: 100%;
    }
  }

  @media (max-width: 768px) {
    .responsive-container {
      max-width: 100%;
    }
  }

  @media (max-width: 576px) {
    .responsive-container {
      max-width: 100%;
      padding: 0;
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

  /* Styles pour la pièce jointe */
  .file-upload-zone {
    border: 2px dashed #dee2e6;
    border-radius: 8px;
    transition: border-color 0.3s ease;
  }

  .file-upload-zone:hover {
    border-color: #095797;
  }

  .file-upload-label {
    display: block;
    padding: 2rem 1rem;
    text-align: center;
    cursor: pointer;
    color: #6c757d;
    font-weight: 500;
    transition: all 0.3s ease;
    margin: 0;
  }

  .file-upload-label:hover {
    color: #095797;
    background-color: #f8f9fa;
  }

  .file-attached {
    border: 1px solid #dee2e6;
    border-radius: 8px;
    background-color: #f8f9fa;
  }

  .file-name {
    font-weight: 500;
    color: #495057;
  }

  .file-actions .btn {
    padding: 0.25rem 0.5rem;
  }

  .readonly-comment-v5 {
    background: #f8f9fa;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 0.97em;
    color: #555;
    margin-top: 8px;
    min-height: 32px;
  }

  .piece-jointe-link {
    color: #095797;
    text-decoration: underline;
    font-weight: 500;
    cursor: pointer;
  }

  .historique-commentaire {
    background: #f4f6fa;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
    padding: 8px 10px;
    font-size: 0.95em;
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
</style>
