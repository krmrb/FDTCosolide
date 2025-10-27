<template>
  <div id="app">
    <NavBar :role="selectedRole" :name="selectedName" />
    <main>
      <RouterView v-slot="{ Component }">
        <component :is="Component" @personaSelected="handlePersonaSelected" />
      </RouterView>
    </main>
    <PiedPage v-if="!routesSansPied.includes(route.name as string)" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import PiedPage from '@/components/PiedPage.vue'

const selectedRole = ref('');
const selectedName = ref('');
const route = useRoute();

// Liste des routes sans pied de page
const routesSansPied = [
  'approbationV3',
  'relevesalaire',
  'feuilletsfiscaux',
  'formulaireabsencev1_1',
  'demandepaiementV1'
];

// Fonction appelée par Accueil.vue via emit
function handlePersonaSelected(data: { role: string; name: string }) {
  selectedRole.value = data.role;
  selectedName.value = data.name;
}
</script>


<style>
@import './assets/styles.css';

.footer-hidden {
  display: none;
}
</style>
