<template>
  <div class="corps-formulaire">
    <div class="container" style="max-width: 45%;">
      <!-- Identité -->
      <div class="mt-4 p-3">
        <h4 class="mb-4">Demande de paiement</h4>

        <div class="border-top border-3 border-primary "></div>
      </div>

      <!-- Formulaire -->
      <div class="bg-light p-4">
        <div class="row mb-3">
          <div class="col-md-2">
            <strong>Matricule</strong>
            <div>{{ form.matricule }}</div>
          </div>
          <div class="col-md-2">
            <strong>Nom </strong>
            <div>{{ form.nomNaissance }}</div>
          </div>
          <div class="col-md-2">
            <strong>Prénom</strong>
            <div>{{ form.prenom }}</div>
          </div>
        </div>

        <hr />

        <!-- Date début -->
        <div class="row mb-3 align-items-center">
          <div class="col-md-4"><label for="date">Date de début</label></div>
          <div class="col-md-4 text-end">
            <span class="text-muted me-2 fw-bold">{{ jourDebut }}</span>
          </div>
          <div class="col-md-4">
            <input type="date" id="dateDebut" class="form-control" v-model="form.dateDebut" />
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
                   id="dateFin"
                   v-model="form.dateFin"
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
            <select id="emploi" class="form-select select-compact" v-model="form.emploi">
              <option v-for="job in emplois" :key="job.code" :value="job.code">
                {{job.corpsEmploi}} - {{ job.emploiLabel }}
              </option>
            </select>
          </div>
        </div>

        <!-- Lieu de travail -->
        <div class="row mb-3">
          <div class="col-md-7"><label for="lieu">Lieu de travail</label></div>
          <div class="col-md-5">
            <select id="lieu" class="form-select select-compact" v-model="form.lieu">
              <option v-for="lieu in lieuxTravail" :key="lieu.code" :value="lieu.code">
                {{ lieu.lieuCode }} - {{ lieu.lieuLabel }}
              </option>
            </select>
          </div>
        </div>

        <!-- Motif d'absence -->
        <div class="row mb-3">
          <div class="col-md-7"><label for="motif">Type de demande</label></div>
          <div class="col-md-5">
            <select id="paiement" class="form-select select-compact" v-model="form.typePaiement">
              <option value="">Sélectionner un type</option>
              <option v-for="paiement in listePaiements" :key="paiement" :value="paiement">
                {{ paiement }}
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
          <button type="submit" class="btn btn-primary" @click.prevent="submitForm">Soumettre</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue'
  import { Paiement } from '@/types/demande'

  // Liste des types de paiement à partir de l'enum
  const listePaiements = Object.values(Paiement)

  // Données du formulaire
  const form = ref({
    id: "3210789789",
    matricule: "00889966",
    date: "",
    dateCreation: "2025-10-18",
    dateDebut: "2025-10-18",
    dateFin: "2025-10-18",
    emploiCode: "C",
    emploiCorps: "2520",
    emploiLabel: "Concierge",
    lieuCode: "003",
    lieuLabel: "École Trois",
    motifCode: "03",
    motifLabel: "congé personnel",
    typeEvenement: "congé personnel",
    typePaiement: "Surcroît", // ✅ valeur par défaut correcte
    touteJournee: true,
    de: "",
    a: "",
    nomNaissance: "Lavoie",
    prenom: "Sophie",
    commentaire: "",
    etatValidation: "Soumis",
    niveau1validation: "En attente d\'approbation",
    niveau2validation: "En attente d\'approbation",
    noteApprobation: "",
    decision: "",
    attente_info: false
  })

  // Listes statiques
  const emplois = [
    { emploiCode: 'A', emploiLabel: 'Enseignant', corpsEmploi: '3110' },
    { emploiCode: 'B', emploiLabel: 'Suppléant', corpsEmploi: '3457' },
    { emploiCode: 'C', emploiLabel: 'Concierge', corpsEmploi: '2520' }
  ]

  const lieuxTravail = [
    { lieuCode: '001', lieuLabel: 'École Untel' },
    { lieuCode: '002', lieuLabel: 'École Deux' },
    { lieuCode: '003', lieuLabel: 'École Trois' }
  ]

  const motifsAbsence = [
    { motifCode: '01', motifLabel: 'Maladie' },
    { motifCode: '02', motifLabel: 'Congé' },
    { motifCode: '03', motifLabel: 'Vacance' }
  ]

  // Copier automatiquement la date de début vers la date de fin
  const dateCopier = ref(false)

  watch(() => form.value.dateDebut, (newDate) => {
    if (!dateCopier.value && newDate) {
      form.value.dateFin = newDate
      dateCopier.value = true
    }
  })

  // Validation des dates
  const isDateRangeValid = computed(() => {
    if (!form.value.dateDebut || !form.value.dateFin) return true
    return new Date(form.value.dateFin) >= new Date(form.value.dateDebut)
  })

  // Calcul des jours
  const jourDebut = computed(() => {
    if (!form.value.dateDebut) return ''
    const date = new Date(form.value.dateDebut)
    return date.toLocaleDateString('fr-FR', { weekday: 'long' })
  })

  const jourFin = computed(() => {
    if (!form.value.dateFin) return ''
    const date = new Date(form.value.dateFin)
    return date.toLocaleDateString('fr-FR', { weekday: 'long' })
  })

  // Méthode de soumission
  const submitForm = () => {
    if (!isDateRangeValid.value) {
      alert("La date de fin ne peut pas être antérieure à la date de début.")
      return
    }
    console.log('Formulaire soumis:', form.value)
  }

  // Gestion des fichiers
  function telechargerFichier() {
    window.open('/fichiers/justificatif_conge.pdf', '_blank')
  }

  function supprimerFichier() {
    alert('Fichier supprimé (simulation)')
  }
</script>
<style scoped>

  .container{
    padding-bottom:10rem;
  }
  .input-compact,
  .select-compact {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
    height: auto;
    line-height: 1.2;
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

  .corps-formulaire {
    padding-bottom: 24rem;
    margin-top: -2rem;
    background-color: white;
  }
</style>
