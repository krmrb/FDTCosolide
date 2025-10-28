<template>
  <div class="body">
    <div class="container" style="max-width: 45%;">
      <!-- Identité -->
      <div class="mt-4 p-4">
        <h3 class="mb-4">Demande d'absence</h3>


        <div class="border-top border-3 border-primary my-4"></div>
      </div>

      <!-- Formulaire -->
      <div class="bg-light p-4">

         <!-- Date début -->
        <div class="row mb-3 align-items-center">
          <div class="col-md-4"><label for="date">Date de début</label></div>
          <div class="col-md-4 text-end">
            <span class="text-muted me-2 fw-bold">{{ jourDebut }}</span>
          </div>
          <div class="col-md-4">
            <input type="date" id="date_deb" class="form-control" v-model="form.date_deb" />
          </div>
        </div>
        <!-- Date fin-->
        <div class="row mb-3 align-items-center">

          <!-- Message d'erreur -->
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
    de: '',
    a: '',
    commentaire: '',
    fichiers: []
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

  // Gestion des fichiers
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const maxSize = 5 * 1024 * 1024; // 5 Mo
    
    files.forEach(file => {
      if (file.size > maxSize) {
        alert(`Le fichier "${file.name}" dépasse la taille maximale de 5 Mo.`);
        return;
      }
      form.value.fichiers.push(file);
    });
    
    // Réinitialiser l'input pour permettre de sélectionner le même fichier à nouveau
    event.target.value = '';
  };

  const removeFile = (index) => {
    form.value.fichiers.splice(index, 1);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 octets';
    const k = 1024;
    const sizes = ['octets', 'Ko', 'Mo'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

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
<style>
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
