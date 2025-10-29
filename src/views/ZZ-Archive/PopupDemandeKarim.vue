<template>
  <div v-if="visible" class="popup-overlay" @click.self="close">
    <div class="popup-content">
      <h5>Détails de la demande d'absence</h5>
      <ul class="list-group">
        <li class="list-group-item"><strong>Note :</strong> {{ demande.note }}</li>

        <li class="list-group-item"><strong>Matricule :</strong> {{ demande.matricule }}</li>
        <li class="list-group-item">
            <strong>Employé(e) :</strong> {{ demande.nom }} {{ demande.prenom }}
        </li>
        <li class="list-group-item"><strong>Emploi :</strong> {{ demande.emploi }}</li>
        <li class="list-group-item"><strong>Lieu de travail :</strong> {{ demande.lieuTravail }}</li>
        <li class="list-group-item"><strong>Date & Heure :</strong> {{ demande.dateDemande }}</li>
        <li class="list-group-item"><strong>Initiée par :</strong> {{ demande.initiateur }}</li>
        <li class="list-group-item"><strong>Motif :</strong> {{ demande.motif }}</li>
        <li class="list-group-item"><strong>Solde :</strong> {{ demande.solde }} j</li>
        <li class="list-group-item"><strong>Statut :</strong> {{ demande.statut }}</li>
      </ul>
      <button class="btn btn-sm btn-secondary mt-3" @click="close">Fermer</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  demande: Object,
  visible: Boolean
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}
.popup-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
}
</style>