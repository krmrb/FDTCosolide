<template>
  <div class="responsive-container">
    <!-- Section infos demande -->
    <div>
      <div class="p-3 p-md-4 bg-white border rounded shadow-sm mb-3">
        <h4 class="mb-3 mb-md-4 text-primary"><i class="bi bi-info-circle me-2"></i>Suivi de mes demandes d'absence</h4>
          
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
        <!-- Dates début/fin -->
        <div class="row mb-3 align-items-center">
          <div class="col-12 col-md-4 mb-2 mb-md-0"><label for="date">Date de début</label></div>
          <div class="col-12 col-md-4 text-md-end mb-2 mb-md-0">
            <span class="text-muted me-2 fw-bold">{{ jourDebut }}</span>
          </div>
          <div class="col-12 col-md-4">
            <input type="date" id="date_deb" class="form-control" v-model="form.date_deb" disabled />
          </div>
        </div>
        <div class="row mb-3 align-items-center">
          <div v-if="!isDateRangeValid" class="alert-message col-12 mb-2">
            ⚠️ La date de fin ne peut pas être antérieure à la date de début.
          </div>
          <div class="col-12 col-md-4 mb-2 mb-md-0"><label for="date">Date de fin</label></div>
          <div class="col-12 col-md-4 text-md-end mb-2 mb-md-0">
            <span class="text-muted me-2 fw-bold">{{ jourFin }}</span>
          </div>
          <div class="col-12 col-md-4">
            <input type="date"
                   id="date_fin"
                   v-model="form.date_fin"
                   :class="['form-control', { 'is-invalid': !isDateRangeValid }]"
                   disabled />
          </div>
        </div>

        <!-- Heures -->
        <div class="row mb-3">
          <div class="col-12 col-md-7 mb-2 mb-md-0">
            <label for="de">Heure de début</label>
          </div>
          <div class="col-12 col-md-5">
            <input type="time" id="de" class="form-control form-control-sm" v-model="form.de" placeholder="ex: 08:00" disabled />
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-12 col-md-7 mb-2 mb-md-0">
            <label for="a">Heure de fin</label>
          </div>
          <div class="col-12 col-md-5">
            <input type="time" id="a" class="form-control form-control-sm" v-model="form.a" placeholder="ex: 16:00" disabled />
          </div>
        </div>

        <!-- Sélections -->
        <div class="row mb-3">
          <div class="col-12 col-md-7 mb-2 mb-md-0"><label for="emploi">Emploi</label></div>
          <div class="col-12 col-md-5">
            <select id="emploi" class="form-select" v-model="form.emploi" disabled>
              <option v-for="job in emplois" :key="job.code" :value="job.code">
                {{job.corps_emploi}} - {{ job.label }}
              </option>
            </select>
          </div>
        </div>

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

        <div class="row mb-3">
          <div class="col-12 col-md-7 mb-2 mb-md-0"><label for="motif">Motif d'absence</label></div>
          <div class="col-12 col-md-5">
            <select id="motif" class="form-select" v-model="form.motif" disabled>
              <option v-for="motif in motifsAbsence" :key="motif.code" :value="motif.code">
                {{ motif.code }} - {{ motif.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Solde de banque -->
        <div class="row mb-3">
          <div class="col-12 col-md-7 mb-2 mb-md-0"><label>Soldes de banque disponibles</label></div>
          <div class="col-12 col-md-5">
            <div class="mb-2">
              <span class="text-muted small">Maladie monnayable: </span>
              <span class="fw-bold">15.5 jours</span>
            </div>
            <div class="mb-2">
              <span class="text-muted small">Vacances année courante: </span>
              <span class="fw-bold">23 jours</span>
            </div>
            <div>
              <span class="text-muted small">Temps compensé: </span>
              <span class="fw-bold">8.5 jours</span>
            </div>
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
import corpsEmploiData from '@/types/corpsEmploi.json';
import motifAbsenceData from '@/types/MotifAbsence.json';

const props = defineProps({
  demande: {
    type: Object,
    default: null
  }
});

// Données du formulaire
const form = ref({
  nomNaissance: '',
  prenom: '',
  matricule: '',
  initiePar: '',
  emploi: '',
  lieu: '',
  motif: '',
  soldeBanque: '',
  date_deb: '',
  date_fin: '',
  de: '',
  a: '',
  commentaire:'',
  commentaireSuivi: '',
  etat: '',
  dateSoumission: '',
  pieceJointe: '',
  pieceJointeSoumise: '',
});

// Charger les données de la demande si fournie
onMounted(() => {
  if (props.demande) {
    form.value = {
      nomNaissance: props.demande.nomNaissance || '',
      prenom: props.demande.prenom || '',
      matricule: props.demande.matricule || '12345678',
      initiePar: props.demande.demandePar || 'Dorion, Cédric',
      emploi: props.demande.emploi || '',
      lieu: props.demande.lieu || '',
      motif: props.demande.motif || '',
      soldeBanque: props.demande.soldeBanque || '',
      date_deb: props.demande.date || props.demande.date_deb || '',
      date_fin: props.demande.date_fin || props.demande.date || '',
      de: props.demande.de || props.demande.heureDebut || '',
      a: props.demande.a || props.demande.heureFin || '',
      commentaire: props.demande.commentaire || '',
      commentaireSuivi: props.demande.noteApprobation || '',
      etat: props.demande.etat || 'En attente',
      dateSoumission: props.demande.dateSoumission || '',
      pieceJointe: props.demande.pieceJointe || '',
      pieceJointeSoumise: props.demande.pieceJointeSoumise || props.demande.pieceJointe || '',
    };
  }
});

// Fonction de téléchargement
const downloadSubmittedFile = () => {
  // Logique fictive de téléchargement
  console.log('Téléchargement de:', form.value.pieceJointeSoumise);
  alert(`Téléchargement du fichier: ${form.value.pieceJointeSoumise}`);
};

const showHistorique = ref(false);
const historiqueCommentaires = [
  { date: '2025-10-01', commentaire: 'Demande initiale', etat: 'En attente' },
  { date: '2025-10-03', commentaire: 'Ajout de justificatif', etat: 'En attente' },
  { date: '2025-10-04', commentaire: 'Commentaire RH', etat: 'Acceptée' },
];

// Utiliser les données des fichiers JSON
const emplois = corpsEmploiData.corpsEmploi.map(item => ({
  code: item.code,
  label: item.description,
  corps_emploi: item.code
}));

const lieuxTravail = [
  { code: '001', label: 'École Untel' },
  { code: '002', label: 'École Deux' },
  { code: '003', label: 'École Trois' }
];

const motifsAbsence = motifAbsenceData.motifAbsence.map(item => ({
  code: item.code,
  label: item.description
}));

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
  }
</style>

