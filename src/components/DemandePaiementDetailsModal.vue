<template>
  <div class="modal-backdrop fade show"></div>
  <div class="modal d-block" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Détails de la demande</h5>
          <button type="button" class="btn-close" @click="$emit('fermer')"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3"><strong>Matricule :</strong> {{ demande.matricule }} </div>
          <div class="mb-3"><strong>Demande par :</strong> {{ demande.demandePar }}</div>
           <div class="mb-3"><strong>État :</strong> <span :class="['badge', getEtatColor(demande.etat)]">{{ demande.etat }}</span></div>
          <div class="mb-3"><strong>Date :</strong> {{ demande.dateDemande }}</div>
          <div class="mb-3"><strong>Heure :</strong> De {{ demande.heureDebut }} à {{ demande.heureFin }}</div>
          <div class="mb-3"><strong>Corps d'emploi :</strong> {{ demande.corpsEmploi }}</div>
          <div class="mb-3"><strong>Lieu de travail :</strong> {{ demande.lieuTravail }}</div>
          <div class="mb-3"><strong>Type de paiement :</strong> {{ demande.typePaiement }}</div>
          <div class="mb-3"><strong>Note du demandeur :</strong> {{ demande.noteDemande }}</div>
          <div class="mb-3"><strong>Note de l'approbateur :</strong> {{ demande.noteApprobation }}</div>
          <div class="mb-3"><strong>Pièces jointes :</strong></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('fermer')">Fermer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ demande: Object })
defineEmits(['fermer'])

function getEtatColor(etat) {
  switch (etat) {
    case 'Brouillon': return 'bg-secondary'
    case 'Soumis': return 'bg-primary'
    case 'en attente d\'approbation': return 'bg-warning'
    case 'Modifié': return 'bg-info'
    case 'Traitée': return 'bg-success'
    case 'En attente d\'une pièce justificative': return 'bg-warning'
    case 'Annulé': return 'bg-danger'
    case 'Refusé': return 'bg-danger text-white'
    default: return 'bg-light'
  }
}
</script>