import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

/*import Login from '@/views/Login.vue'*/

import Approbation from '@/views/approbation/Approbation.vue'
import Accueil from '@/views/Accueil.vue'

import suiviDemandesAbsences from '@/views/absence/SuiviDemandesAbsences.vue'
import SuiviDemandesPaiements from '@/views/paiement/SuiviDemandesPaiements.vue'

import Horaire from '@/views/Horaire.vue'

const routes: Array<RouteRecordRaw>  = [
  { path: '/', redirect: '/accueil' },
 
  { path: '/suiviDemandesAbsences', name: 'suiviDemandesAbsences', component: suiviDemandesAbsences },
  { path: '/SuiviDemandesPaiements', name: 'SuiviDemandesPaiements', component: SuiviDemandesPaiements },
  { path: '/Horaire', name: 'Horaire', component: Horaire },

  { path: '/approbation', name: 'approbation', component: Approbation },
  { path: '/accueil', name: 'accueil', component: Accueil },
  
];

const basePath = import.meta.env.VITE_BASE_PATH;

const router = createRouter({
  history: createWebHistory(basePath),
  routes,
});
//Désactiver pour ne pas bloquer
// router.beforeEach((to, from, next) => {
//   if (to.meta.public) return next()
//   if (isAuthenticated()) return next()
//   next({ name: 'login', query: { redirect: to.fullPath } })
// })

export default router
