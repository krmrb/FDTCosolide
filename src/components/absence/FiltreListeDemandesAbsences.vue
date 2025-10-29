<template>
  <div class="d-flex flex-wrap align-items-end gap-3 mb-3">
    <!-- Période : De / À -->
    <div>
      <label class="form-label fw-bold">De :</label>
      <input type="date" class="form-control" v-model="filters.dateDebut" />
    </div>
    <div>
      <label class="form-label fw-bold">À :</label>
      <input type="date" class="form-control" v-model="filters.dateFin" />
    </div>

    <!-- État -->
    <div style="min-width: 200px;">
      <label class="form-label fw-bold">État :</label>
      <select class="form-select" v-model="filters.etat">
        <option value="">Tous</option>
        <option v-for="e in etats" :key="e" :value="e">{{ e }}</option>
      </select>
    </div>

    <!-- Motif -->
    <div style="min-width: 200px;">
      <label class="form-label fw-bold">Motif :</label>
      <select class="form-select" v-model="filters.motif">
        <option value="">Tous</option>
        <option v-for="m in motifs" :key="m" :value="m">{{ m }}</option>
      </select>
    </div>

    <!-- Bouton Filtrer -->
    <div>
      <button class="btn btn-primary mt-4" @click="$emit('filtrer', filters)">
        <i class="bi bi-funnel me-1 text-light"></i> Filtrer
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const filters = reactive({
  dateDebut: '',
  dateFin: '',
  etat: '',
  motif: '',
  initiePar: ''
});

const etats = [
  'Brouillon', 'Soumis', 'En attente d\'approbation', 'Modifié', 'Traitée',
  'En attente d\'une pièce justificative', 'Annulé', 'Refusé'
];

const motifs = [
  'Maladie', 'Vacances', 'Force majeure', 'Affaires personnelles',
  'Responsabilité parentale', 'Retour progressif', 'Congé sans solde',
  'Grève', 'Retraite progressive', 'Temps compensé en congé',
  'Absence autorisée payée', 'Décès famille', 'Déménagement'
];
</script>
