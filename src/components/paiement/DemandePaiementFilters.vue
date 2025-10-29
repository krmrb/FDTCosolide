<template>
  <div class="d-flex flex-wrap align-items-end gap-3 mb-3">
    <!-- Période : De / À -->
    <div>
      <label class="form-label fw-bold">De :</label>
      <input type="date" class="form-control" v-model="periode.de" />
    </div>
    <div>
      <label class="form-label fw-bold">À :</label>
      <input type="date" class="form-control" v-model="periode.a" />
    </div>

    <!-- État -->
    <div style="min-width: 200px;">
      <label class="form-label fw-bold">État :</label>
      <select class="form-select" v-model="etatSelectionne">
        <option value="">Tous</option>
        <option v-for="etat in etatsDisponibles" :key="etat" :value="etat">{{ etat }}</option>
      </select>
    </div>

    <!-- Type de paiement -->
    <div style="min-width: 200px;">
      <label class="form-label fw-bold">Type de paiement :</label>
      <select class="form-select" v-model="typePaiement">
        <option value="">Tous</option>
        <option v-for="type in typesPaiement" :key="type" :value="type">{{ type }}</option>
      </select>
    </div>

    <!-- Bouton filtrer -->
    <div>
      <button class="btn btn-primary mt-4" @click="filtrer">
        <i class="bi bi-funnel me-1 text-light"></i> Filtrer
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const etatsDisponibles = [
  'Brouillon',
  'Soumis',
  'En attente d\'approbation',
  'Modifié',
  'Traitée',
  'En attente d\'une pièce justificative',
  'Retiré',
  'Refusé'
]

const typesPaiement = [
  'Temps supplémentaire',
  'Surcroît',
  'Remplacement',
  'Suppléance occasionnelle',
  'Temps compensé',
  'ATP',
  'Taux horaire',
  'Suppléance en sus de la tâche',
  'Prime de disponibilité'
]

const etatSelectionne = ref('')
const typePaiement = ref('')
const periode = ref({
  de: new Date().toISOString().slice(0, 10),
  a: new Date().toISOString().slice(0, 10)
})

const emit = defineEmits(['filtrer'])

function filtrer() {
  emit('filtrer', {
    etat: etatSelectionne.value ? [etatSelectionne.value] : [],
    recherche: typePaiement.value,
    periode: {
      type: 'intervalle',
      valeur: {
        de: periode.value.de,
        a: periode.value.a
      }
    }
  })
}
</script>
