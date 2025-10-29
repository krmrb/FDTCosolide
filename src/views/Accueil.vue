<template>
  <div class="container">
  <section id="launchpad">
    <div class="text-center mb-5 text-primary">
   
      <h3> Persona - Activation des modules/options selon le choix</h3>
      <h5> Cette page d'accueil ne fait pas partie des maquettes.</h5>
    </div>

    <div class="row g-4 mb-5">
      <div
        v-for="persona in personas"
        :key="persona.id"
        class="col-md-6 col-lg-3"
      >
        <div
          class="persona-card card h-100 shadow-sm"
          :data-persona="persona.role"
          role="button"
          tabindex="0"
          @click="selectPersona(persona.role, persona.name)"
        >
          <div class="card-body text-center p-4">
            <div class="persona-icon mb-3">
              <i :class="persona.icon"></i>
            </div>
            <h3 class="h5 fw-bold">{{ persona.name }}</h3>
            <p class="text-muted small mb-0">{{ persona.title }}</p>
          </div>
        </div>
      </div>
    </div> 

  </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const showModules = ref(false);
const showModulePage = ref(false);

const personas = [
  {
    id: 1,
    name: 'Nathalie Fortin',
    title: 'Employée',
    role: 'employe',
    icon: 'bi bi-person-fill',
  },
  {
    id: 2,
    name: 'Sylvie Morin',
    title: 'Secrétaire',
    role: 'secretaire',
    icon: 'bi bi-person-badge-fill',
  },
  {
    id: 3,
    name: 'Louise Mercier',
    title: 'Directrice',
    role: 'directeur',
    icon: 'bi bi-clipboard-check-fill',
  },
  {
    id: 4,
    name: 'Michel Paradis',
    title: 'Supérieur hiérarchique',
    role: 'rh',
    icon: 'bi bi-award-fill',
  }, 
  // {
  //   id: 5,
  //   name: 'Développeur',
  //   title: 'Accès des anciennes maquettes',
  //   role: 'developpeur',
  //   icon: 'bi bi-cone-striped',
  // },
];

const emit = defineEmits(['personaSelected']);

function selectPersona(role: string, name: string) {
  emit('personaSelected', { role, name });
}

</script>

<style scoped>
.container{
 height: 89vh; 
}
#launchpad {
  padding: 2rem 1rem;
}

.persona-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.persona-card:hover,
.persona-card:focus {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.persona-icon i {
  font-size: 2rem;
  color: #0073cf;
}

#moduleContainer {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>