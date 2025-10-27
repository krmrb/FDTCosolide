<template>
  <div class="mb-4">
    <div class="row g-2 align-items-end">
      <!-- Période -->
      <div class="col-md-3">
        <label class="form-label"><strong>Période (De ... À ...)</strong></label>
        <div class="d-flex gap-2">
          <input type="date" class="form-control w-50" v-model="filters.dateDebut" />
          <input type="date" class="form-control w-50" v-model="filters.dateFin" />
        </div>
      </div>

      <!-- État -->
      <div class="col-md-2">
        <label class="form-label"><strong>État</strong></label>
        <select class="form-select" v-model="filters.etat">
          <option value="">Tous</option>
          <option v-for="e in etats" :key="e" :value="e">{{ e }}</option>
        </select>
      </div>

      <!-- Motif -->
      <div class="col-md-2">
        <label class="form-label"><strong>Motif</strong></label>
        <select class="form-select" v-model="filters.motif">
          <option value="">Tous</option>
          <option v-for="m in motifs" :key="m" :value="m">{{ m }}</option>
        </select>
      </div>

      <!-- Initiée par -->
      <div class="col-md-3">
        <label class="form-label"><strong>Initiée par</strong></label>
        <!--<input type="text" class="form-control" v-model="filters.initiePar" placeholder="Nom ou code utilisateur" />-->
        <input
          type="text"
          class="form-control"
          v-model="filters.initiePar"
          list="initiateurs"
          placeholder="Nom ou code utilisateur" />

          <datalist id="initiateurs">
            <option value="Jean Martin" />
            <option value="Sophie Tremblay" />
            <option value="Marc Lavoie" />
            <option value="Julie Roy" />
          </datalist>
      </div>

      <!-- Bouton Filtrer -->
      <div class="col-md-2">
        <button class="btn btn-primary w-55" @click="$emit('filtrer', filters)">
          <i class="bi bi-funnel me-1 text-light"></i> Filtrer
        </button>
      </div>
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
  'Brouillon', 'Soumis', 'en attente d\'approbation', 'Modifié', 'Traitée',
  'En attente d\'une pièce justificative', 'Annulé', 'Refusé'
];

const motifs = [
  'Demande de maladie', 'Choix de vacances',
  'Journée flottante mobile', 'Journée de cause majeure'
];
</script>
