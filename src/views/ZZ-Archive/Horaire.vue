<template>
  <div class="horaire-container container-fluid py-4">
    <div class="horaire-grid">
      <!-- En-tête des jours -->
      <div class="horaire-header">
        <div class="horaire-cell empty-cell"></div>
        <div v-for="jour in jours" :key="jour" class="horaire-cell jour-header">
          {{ jour }}
        </div>
      </div>

      <!-- Grille horaire -->
      <div class="horaire-body">
        <div v-for="heure in heures" :key="heure" class="horaire-row">
          <div class="horaire-cell heure-cell">
            {{ heure }}
          </div>
          <div v-for="jour in jours"
               :key="`${jour}-${heure}`"
               class="horaire-cell slot-cell">
            <!-- Cellule blanche pour événements -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
  const heures = Array.from({ length: 12 }, (_, i) => `${8 + i}h`)
</script>

<style scoped>
  :root {
    --bleu-base: #095797;
    --bleu-pale: #a3cce9;
    --bleu-translucide: rgba(9, 87, 151, 0.15);
  }

  .horaire-container {
    background: linear-gradient(135deg, var(--bleu-base), #0a3c6e);
    border-radius: 20px;
    box-shadow: 0 0 40px rgba(9, 87, 151, 0.3);
    color: var(--bleu-pale);
    font-family: 'Segoe UI', sans-serif;
    padding: 20px;
  }

  .horaire-grid {
    display: grid;
    grid-template-columns: 80px repeat(7, 1fr);
    gap: 8px;
    border-radius: 16px;
    overflow: hidden;
  }

  .horaire-header,
  .horaire-body,
  .horaire-row {
    display: contents;
  }

  .horaire-cell {
    padding: 12px;
    text-align: center;
    border-radius: 12px;
    backdrop-filter: blur(6px);
    transition: background-color 0.3s ease;
  }

  /* Titres en bleu pâle */
  .jour-header {
    font-weight: 600;
    font-size: 0.9rem;
    background-color: var(--bleu-translucide);
    color: var(--bleu-pale);
    border-bottom: 2px solid var(--bleu-pale);
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 2px 6px rgba(163, 204, 233, 0.3);
  }

  .heure-cell {
    font-weight: 600;
    background-color: var(--bleu-translucide);
    color: var(--bleu-pale);
    border-right: 2px solid var(--bleu-pale);
    letter-spacing: 1px;
    box-shadow: 2px 0 6px rgba(163, 204, 233, 0.3);
  }

  /* Cellules d'événements en blanc doux avec shadow */
  .slot-cell {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(255, 255, 255, 0.2);
    border: none;
    color: #2c3e50;
    font-weight: 500;
  }

    .slot-cell:hover {
      box-shadow: 0 4px 10px rgba(255, 255, 255, 0.3);
    }
</style>
