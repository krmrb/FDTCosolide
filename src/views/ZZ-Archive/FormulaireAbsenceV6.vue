<template>
  <div class="body">
    <div class="container" style="max-width: 45%;">
      <!-- Section infos demande -->
      <div class="mt-4">
        <div class="p-4 bg-white border rounded shadow-sm mb-4">
          <h4 class="mb-4 text-primary"><i class="bi bi-info-circle me-2"></i>Résumé de la demande</h4>
          <div class="info-row">
            <span class="info-label">Demandé par</span>
            <span class="info-value"><i class="bi bi-person-circle me-1"></i>{{ form.nomNaissance }} {{ form.prenom }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Pièce jointe</span>
            <span class="info-value">
              <i class="bi bi-paperclip me-1"></i>
              <template v-if="form.pieceJointe">
                <a :href="pieceJointeUrl" target="_blank" class="piece-jointe-link">
                  {{ form.pieceJointe }}
                  <i class="bi bi-download ms-2"></i>
                </a>
              </template>
              <span v-else class="text-muted">Aucune pièce jointe</span>
            </span>
          </div>
          <div class="info-row">
            <span class="info-label">État</span>
            <span class="info-value text-success"><i class="bi bi-flag me-1"></i>{{ form.etat || 'Non défini' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Date de la demande</span>
            <span class="info-value"><i class="bi bi-calendar-event me-1"></i>{{ form.dateSoumission ? new Date(form.dateSoumission).toLocaleDateString('fr-FR') : 'Non disponible' }}</span>
          </div>
          

          <div class="info-row">
            <span class="info-label"><i class="bi bi-chat-left-text me-1"></i>Commentaire</span>
            <span class="info-value readonly-comment-v5">
              <span class="d-flex align-items-center" @click="showHistorique = !showHistorique" style="cursor:pointer;">
                {{ form.commentaire ? form.commentaire : 'Aucun commentaire.' }}
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
        <div class="border-top border-3 border-primary my-4"></div>
      </div>

      <!-- Formulaire -->
      <div class="bg-light p-4">
        <!-- Dates début/fin et nom/prénom -->
        <div class="row mb-3 align-items-center">
          <div class="col-md-4"><label for="date">Date de début</label></div>
          <div class="col-md-4 text-end">
            <span class="text-muted me-2 fw-bold">{{ jourDebut }}</span>
          </div>
          <div class="col-md-4">
            <input type="date" id="date_deb" class="form-control" v-model="form.date_deb" />
          </div>
        </div>
        <div class="row mb-3 align-items-center">
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

        <!-- Pièce jointe -->
        <div class="mb-2">Pièces jointe</div>
        <div class="piece-jointe d-flex align-items-center gap-2 p-2 border rounded mb-3">
          <i class="bi bi-paperclip fs-5 text-primary"></i>
          <span class="nom-fichier">justificatif_conge.pdf</span>
          <button class="btn btn-sm btn-outline-secondary" @click="telechargerFichier">
            <i class="bi bi-download"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" @click="supprimerFichier">
            <i class="bi bi-trash"></i>
          </button>
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
          <button type="submit" class="btn btn-primary" @click.prevent="submitForm">Modifier</button>
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
  commentaire:'',
  etat: 'En attente',
  dateSoumission: '2025-10-06',
  pieceJointe: 'justificatif.pdf', // fictif
});

const pieceJointeUrl = computed(() => {
  // Lien fictif, à remplacer par l'URL réelle si besoin
  return form.value.pieceJointe ? `/files/${form.value.pieceJointe}` : '#';
});

const showHistorique = ref(false);
const historiqueCommentaires = [
  { date: '2025-10-01', commentaire: 'Demande initiale', etat: 'En attente' },
  { date: '2025-10-03', commentaire: 'Ajout de justificatif', etat: 'En attente' },
  { date: '2025-10-04', commentaire: 'Commentaire RH', etat: 'Acceptée' },
];

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
})

  function telechargerFichier() {
    // Exemple : ouvrir le lien du fichier
    window.open('/fichiers/justificatif_conge.pdf', '_blank')
  }

  function supprimerFichier() {
    // Logique de suppression ou confirmation
    alert('Fichier supprimé (simulation)')
  }
</script>
<style>
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

  .info-row {
    display: flex;
    align-items: center;
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

  .piece-jointe{
      background-color: white;

  }
</style>

