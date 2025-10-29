<template>
  <div :class="['event-item', getEventColor(evt.typeEvenement)]">
    <!-- Ligne 1 -->
    <div class="event-header">
      <span>
        <span class="me-3">
          <span class="me-1 label-soft">Création :</span> {{ formatDate(evt.dateCreation) }}
        </span>
        <span class="me-3">
          <span class="me-1 label-soft">De :</span> {{ formatDate(evt.dateDebut) }}
        </span>
        <span class="me-3">
          <span class="me-1 label-soft">à :</span> {{ formatDate(evt.dateFin) }}
        </span>
      </span>

      <span class="me-3">{{ evt.emploiCorps }} - {{ evt.emploiLabel }}</span>
      <span class="me-3">{{ evt.lieuCode }} - {{ evt.lieuLabel }}</span>

      <i class="bi bi-x-lg text-danger" @click="$emit('supprimer', evt)" title="Supprimer"></i>
    </div>

    <!-- Ligne 2 -->
    <div class="event-details-inline">
      <span><span class="me-3 label-soft">Type :</span> {{ evt.typeEvenement }}</span>
      <span><span class="me-3 label-soft">Heure :</span> {{ evt.touteJournee ? 'Journée entière' : evt.de + ' à ' + evt.a }}</span>

      <span v-if="evt.typeEvenement === 'Paiement'">
        <span class="me-3 label-soft">Validation :</span>
        <span :class="['badge-validation', 'badge-' + formatValidation(evt.etatValidation)]">
          {{ evt.etatValidation }}
        </span>
      </span>

      <div class="event-actions me-2">
        <i v-if="evt.commentaire"
           class="bi bi-chat-left-text-fill comment-icon"
           title="Commentaire disponible"></i>
        <i class="bi bi-pencil-fill edit-icon" @click="$emit('modifier', evt)" title="Modifier"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs'
  import type { Demande } from '@/types/demande'

  defineProps<{
    evt: Demande
  }>()

  defineEmits(['modifier', 'supprimer'])

  const formatDate = (date: string): string => dayjs(date).format('DD MMM YYYY')

  //const formatValidation = (val: string): string =>
  //  val.toLowerCase().replaceAll(' ', '_').replaceAll('é', 'e').replaceAll('è', 'e')

  const getEventColor = (type: string): string => {
    switch (type) {
      case 'congé maladie': return 'event-maladie'
      case 'vacances': return 'event-vacances'
      case 'congé personnel': return 'event-personnel'
      case 'Paiement': return 'event-paiement'
      default: return ''
    }
  }
</script>
<style scoped>

  .event-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .event-details {
    margin-top: 0.5rem;
    font-size: 0.9rem;
  }

  .event-item {
    background-color: #fff;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.3);
    position: relative;
    color: #333;
  }

  .event-details-inline {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem; /* espace entre les éléments */
    padding-top: 0.5rem;
  }

    .event-details-inline span {
      white-space: nowrap;
    }

  .event-maladie {
    border-left: 0.375rem solid rgba(255, 165, 0, 0.8);
  }

  .event-vacances {
    border-left: 0.375rem solid rgba(144, 238, 144, 0.8);
  }

  .event-personnel {
    border-left: 0.375rem solid rgba(224, 176, 255, 0.8);
  }

  .event-paiement {
    border-left: 0.375rem solid rgba(173, 216, 230, 0.8);
  }

  .event-item.event-maladie,
  .event-item.event-vacances,
  .event-item.event-personnel
  .event-item.event-paiement {
    background-color: rgba(240, 240, 240, 0.3);
  }

  .event-actions {
    position: absolute;
    bottom: 8px;
    right: 8px;
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }


  .edit-icon {
    color: #b8860b; /* jaune foncé */
    cursor: pointer;
    margin-left: auto;
    font-size: 1.2rem;
  }

  .edit-icon {
    color: #b8860b;
    cursor: pointer;
    font-size: 1.2rem;
  }

  .comment-icon {
    color: #17a2b8; /* Bootstrap info bleu */
    cursor: pointer;
    font-size: 1.2rem;
  }

  .label-soft {
    font-weight: 500; /* ou 600 pour semi-bold */
    color: #333; /* ou une couleur plus douce que noir */
  }
</style>
