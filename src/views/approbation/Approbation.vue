<template>
  <div class="d-flex  gestion-demandes-container">
    <!-- Barre de navigation gauche -->
    <div :class="['sidebar', { collapsed: isCollapsed }]">
      <div class="toggle-btn" @click="toggleSidebar">
        <i :class="isCollapsed ? '' : 'bi bi-chevron-left'" class="arrow-icon"></i>
      </div>
      <div v-if="!isCollapsed" class="sidebar-content">
        <!-- <h5 class="titre-nav-barre">Approbation</h5> -->
        <ul class="nav flex-column mt-3 ">
          <li class="nav-item tooltip-wrapper">
            <button class="nav-link btn btn-link" @click="currentView = 'absence'" title="Absence">
              <i class="bi bi-calendar-fill icon-absence" title="Absence"></i> Absence
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link btn btn-link" @click="currentView = 'paiement'" title="Paiement">
              <i class="bi bi-wallet-fill icon-paiement" title="Paiement"></i> Paiement
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link btn btn-link" @click="currentView = 'creation'" title="Création d'une demande">
              <i class="bi bi-plus-circle" title="Création d'une demande"></i> Création d'une demande
            </button>
          </li>
        </ul>
      </div>
      <div v-else class="burger-menu">
        <div class="toggle-btn mb-4" @click="toggleSidebar">
          <i class="bi bi-chevron-right arrow-icon"></i>
        </div>
        <ul class="nav flex-column">
          <li class="nav-item">
            <button class="nav-link btn btn-link" @click="currentView = 'absence'">
              <i class="bi bi-calendar-fill icon-absence"></i>
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link btn btn-link" @click="currentView = 'paiement'">
              <i class="bi bi-wallet-fill icon-paiement"></i>
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link btn btn-link" @click="currentView = 'creation'">
              <i class="bi bi-plus-circle"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>
   <div class="main-area">
    <div class="main-content">

      <component :is="currentComponent" @ouvrir-details="ouvrirDetails"
        :demande-affichee-id="demandeSelectionnee?.id ?? null" />

    </div>
    <div :class="['details-panel', { expanded: isCollapsed }]" v-if="showDetails">

      <component :is="detailsComponent" :evenement="demandeSelectionnee" :mode-modification="true"
        @fermer="showDetails = false" />

    </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { Demande } from '@/types/demande'
  import ListeDemandes from '@/components/approbation/ListeDemandesAbsence.vue'
  import ListeDemandesPaiement from '@/components/approbation/ListeDemandesPaiement.vue'
  import CreationDemande from "@/components/autorisation/CreationDemande.vue"
  import ApprobationDetails from '@/components/approbation/ApprobationDetailsAbsence.vue'
  import ApprobationDetailsPaiement from '@/components/approbation/ApprobationDetailsPaiement.vue'

const isCollapsed = ref(false)
const currentView = ref<'absence' | 'paiement' | 'creation'>('absence')
const showDetails = ref(false)

const demandeSelectionnee = ref<Demande | null>(null)

const detailsComponent = computed(() => {
  switch (currentView.value) {
    case 'paiement':
      return ApprobationDetailsPaiement
    default:
      return ApprobationDetails
  }
})
 
function ouvrirDetails(demande: Demande) {
  if (demandeSelectionnee.value?.id === demande.id && showDetails.value) {
    // Si on clique sur le même item, on ferme
    showDetails.value = false
    demandeSelectionnee.value = null
  } else {
    // Sinon, on ouvre avec la nouvelle demande
    demandeSelectionnee.value = demande
    showDetails.value = true
  }
}

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}

const currentComponent = computed(() => {
  switch (currentView.value) {
    case 'absence':
      showDetails.value = false;
      return ListeDemandes
    case 'paiement':
      showDetails.value = false;
      return ListeDemandesPaiement
    case 'creation':
      showDetails.value = false;
      return CreationDemande
    default:
      return ''
  }
}) 
</script>
<style scoped>
.gestion-demandes-container {
  display: flex;
  flex-direction: row;
  height: 100vh; 
  width: 100%;
  overflow: hidden;
  gap: 0.2rem; 
}

.titre-nav-barre {
  text-decoration: underline;
  color: black;
  margin-left: 1rem;
  padding-left: 1rem;
  margin-top: 1rem;
  margin-right: 1rem;
  border-radius: 0.5rem;
}

.sidebar {
  flex: 0 0 15.625rem;
  width: 15.625rem;
  height: 100%;
  background: linear-gradient(to bottom, #095797 0%, #095797 1%, #FFFFFF 8%, #f5f5f5 100%);
  color: #095797;
  border-right: 0.1rem solid #09579765;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow-y: auto;
  margin: 0;
  padding: 0;
}

.sidebar.collapsed {
  flex: 0 0 3.75rem;
  height: 100%;
  width: 3.75rem;
  background: linear-gradient(135deg, #fdfdfd, #f0f0f0);
  overflow-x: hidden;
}

.burger-menu {
  width: 3.75rem;
  background: linear-gradient(to bottom, #095797 0%, #095797 1%, #FFFFFF 40%, #f5f5f5 100%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0;
  margin-top: -1rem;
  padding-right: 1rem; 
}

.toggle-btn {
  align-self: flex-end;
  margin: 0.3rem;
  cursor: pointer;
  font-size: 1.5rem;
  color: #FFFFFF;
  background: transparent;
  border: none;
}

.arrow-icon {
  font-weight: bold;
  text-shadow: 0 0.2rem 0.3rem rgba(0, 0, 0, 0.6);
}

.sidebar-title {
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.6;
  margin: 1rem;
  color: #095797;
  white-space: pre-line;
}

.sidebar .nav-link {
  width: 100%;
  color: #095797;
  font-weight: 600;
  font-size: 1rem;
  background: transparent;
  border: none;
  text-align: left;
}

.sidebar .nav-link:hover {
  background-color: rgba(9, 87, 151, 0.1);
  border-radius: 4px;
}
.main-area {
  display: flex;
  flex-direction: column;
  flex: 1;  
  overflow: hidden;
}

.main-content {
  flex: 1; 
  overflow-y: auto;
  overflow-x: hidden;
  margin-inline: 0.8rem;  
  padding-bottom: 0;
  
}

.details-panel {
  height: 63.3%;
  overflow-y: auto;
  background: white;
  padding: 1rem;
  box-sizing: border-box;
  border-top: 1px solid #ccc;
}

.details-panel.expanded {
  flex: 0 0 35rem; 
}

.sidebar.collapsed~.main-content {
  margin-left: 5rem;
  width: calc(100% - 5rem);
}

.icon-absence {
  color: #7E57C2; 
}

.icon-paiement {
  color: #4CAF50; 
}
</style>
