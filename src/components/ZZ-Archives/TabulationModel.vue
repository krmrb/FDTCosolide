<template>
  <div>
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <RouterLink to="en-creation" class="nav-link" active-class="active">En création</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink to="soumis" class="nav-link" active-class="active">Soumis</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink to="traite" class="nav-link" active-class="active">Traité</RouterLink>
      </li>
    </ul>

    <div class="tab-content mt-3">
      <router-view />
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import EnCreation from './EnCreation.vue'
  import Soumis from './enSoumission.vue'
  import Traite from './EstTraite.vue'

  const tabs = [
    { nom: 'enCreation', label: 'En création', composant: EnCreation },
    { nom: 'soumis', label: 'Soumis', composant: Soumis },
    { nom: 'traite', label: 'Traité', composant: Traite },
  ]

  const ongletActif = ref('enCreation')

  const composantActif = computed(() => {
    return tabs.find(tab => tab.nom === ongletActif.value)?.composant || null
  })
</script>

<style scoped>
  .nav-tabs .nav-link.active {
    background-color: #095797;
    color: white;
  }

  .nav-tabs .nav-link {
    cursor: pointer;
  }

  button.nav-link {
    border: none;
    background: none;
  }
</style>
