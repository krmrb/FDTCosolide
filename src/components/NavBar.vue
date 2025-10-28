<template>
  <header class="container-fluid p-0">
    <div class="nav-wrapper">
      <!-- Niveau 1 : Titre + utilisateur -->
      <div class="d-flex justify-content-between align-items-center px-3 py-1">
        <!-- <h2 class="m-0 text-white">GRICS <span class="fw-semibold fs-5 text-white">organisme css/cs</span></h2> -->
        <img class="img-fluid" src="@/assets/grics_icone_blanc.png" alt="GRICS" @click="goToAccueil"></img>

        <div class="dropdown">
          <button class="btn btn-outline-light dropdown-toggle" type="button" id="dropdownMenuButton"
            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{ name }}
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li>
              <RouterLink class="dropdown-item" to="/">Mon profil</RouterLink>
            </li>
            <li>
              <RouterLink class="dropdown-item" to="/">Paramètres</RouterLink>
            </li>
            <li>
              <RouterLink class="dropdown-item" to="/">Se déconnecter</RouterLink>
            </li>
          </ul>
        </div>
      </div>
      <!-- Niveau 3 : Navigation -->
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
          <button class="navbar-toggler" type="button" @click="toggleMenu">
            <span class="navbar-toggler-icon"></span>
          </button>

<!--
       <routerlink to="/approbationtest" class="btn btn-danger">espace test</routerlink> -->


          <div :class="['collapse navbar-collapse', { show: isMenuOpen }]" id="menuPrincipal">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
              <li class="nav-item" v-for="item in filteredMenu" :key="item.name">
                <RouterLink :to="item.link" class="nav-link" :class="{ active: isActive(item.link) }">
                  {{ item.name }}
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Props reçus du parent
const props = defineProps<{
  role: string;
  name: string;
}>();

const route = useRoute();
const router = useRouter();
const isMenuOpen = ref(false);

// Menu complet
const menusParRole: Record<string, { name: string, link: string }[]> =
{
  employe: [
    { name: 'Accueil', link: '/' },
    { name: 'Mes demandes d\'absence', link: '/suiviDemandesAbsences' },
    { name: 'Mes demandes de paiement', link: '/SuiviDemandesPaiements' },
    { name: '📅 Horaire', link: '/horaire' },
  ],
  rh: [
    { name: 'Accueil', link: '/' },
    { name: 'Approbation des demandes', link: '/approbationV3' },
    { name: 'Mes demandes d\'absence', link: '/suiviDemandesAbsences' },
    { name: 'Mes demandes de paiement', link: '/SuiviDemandesPaiements' },
  ],
  secretaire: [
    { name: 'Accueil', link: '/' },
    { name: 'Approbation des demandes', link: '/approbationV3' },
    { name: 'Mes demandes d\'absence', link: '/suiviDemandesAbsences' },
    { name: 'Mes demandes de paiement', link: '/SuiviDemandesPaiements' },
  ],
  directeur: [
    { name: 'Accueil', link: '/' },
    { name: 'Approbation des demandes', link: '/approbationV3' },
    { name: 'Mes demandes d\'absence', link: '/suiviDemandesAbsences' },
    { name: 'Mes demandes de paiement', link: '/SuiviDemandesPaiements' },
  ],
  developpeur : [
    { name: 'Accueil', link: '/' },
    { name: 'Formulaire demande d\'absence', link: '/formAbsence' },
    { name: 'Formulaire demande de paiement', link: '/formPaiement' },
  ]
};

const filteredMenu = computed(() => {
  return menusParRole[props.role] || [];
});

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function isActive(link: string) {
  return route.path === link;
}

function goToAccueil() {
  router.push('/accueil');
}
</script>
<style scoped>
.img-fluid {
  width: 6rem;
  height: auto;
}

.nav-wrapper {
  position: relative;
  background: linear-gradient(135deg, #095797, rgba(9, 87, 151, 0.8));
  backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  z-index: 1;
  /* assure que le fond est derrière */
}

.navbar-nav .nav-link {
  color: #ffffff;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.navbar-nav .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.navbar-nav .nav-link.active {
  background-color: #ffffff;
  color: #095797 !important;
}

.dropdown-menu {
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  right: 0;
  left: auto;
  position: absolute;
  z-index: 1000;
}

.btn.no-border {
  border: 0;
  font-weight: bold;
}

.dropdown-item {
  color: #095797;
  font-weight: 500;
}

.navbar-nav .nav-item.dropdown .dropdown-toggle {
  margin-left: 0.5rem;
}

/*  Responsive */
@media (max-width: 768px) {
  .navbar-nav {
    flex-direction: column;
    width: 100%;
  }

  .nav-item {
    width: 100%;
  }

  .nav-link {
    width: 100%;
    text-align: center;
  }

  .dropdown-menu {
    position: static;
    float: none;
    width: 100%;
    margin-top: 0.5rem;
  }

  .nav-wrapper {
    text-align: center;
  }
}
</style>
