<template>
  <div>
    <div v-if="eventsFiltres.length === 0" class="text-muted">Aucun événement en création</div>

    <EvenementObjet v-for="evt in eventsFiltres"
                    :key="evt.id"
                    :evt="evt"
                    @modifier="modifierEvenement"
                    @supprimer="supprimerEvenement" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import EvenementObjet from './EvenementObjet.vue';
  import type { Demande } from '@/types/demande';

  const props = defineProps<{
    events: Demande[]
  }>()


  const emit = defineEmits(['modifier', 'supprimer'])

  const eventsFiltres = computed(() =>
    Array.isArray(props.events)
      ? props.events.filter(e => (e.etatValidation || '').toLowerCase() === 'en création'.toLowerCase())
      : []
  )

  const modifierEvenement = (evt: Demande) => emit('modifier', evt)
  const supprimerEvenement = (evt: Demande) => emit('supprimer', evt)

  </script>
