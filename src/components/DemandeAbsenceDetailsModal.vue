<template>
  <div class="modal-backdrop fade show"></div>
  <div class="modal d-block" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">Détails de la demande d'absence</h5>
          <button type="button" class="btn-close" @click="$emit('fermer')" aria-label="Fermer"></button>
        </div>

        <div class="modal-body">
          <p><strong>Date d'absence :</strong> 
            <strong>Du</strong> {{ formatDateLong(demande.dateDebutAbsence) }} <strong>au</strong> {{ formatDateLong(demande.dateFinAbsence) }}
          </p>
          <p><strong>Initiée par :</strong> {{ demande.demandePar }}</p>
          <p><strong>Initiée le :</strong> {{ formatDateLong(demande.date) }}</p>
          <p><strong>Motif :</strong> {{ demande.motif }}</p>
          <p><strong>État :</strong> {{ demande.etat }}</p>
          <p><strong>Note du demandeur :</strong> {{ demande.noteDemande }}</p>
           <p><strong>Note de l'approbateur :</strong> {{ demande.noteApprobation }}</p>
       </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('fermer')">Fermer</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['demande'])

function formatDateLong(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-CA', {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}
</script>