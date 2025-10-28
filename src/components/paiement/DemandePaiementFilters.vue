<template>
  <div class="d-flex flex-wrap align-items-end gap-3 mb-3">
    <!-- Période : De / À -->
    <div>
      <label class="form-label fw-bold">De :</label>
      <input type="date" class="form-control" v-model="periode.de" />
    </div>
    <div>
      <label class="form-label fw-bold">À :</label>
      <input type="date" class="form-control" v-model="periode.a" />
    </div>


    <!-- Filtre par état (style select) -->
    <div class="position-relative" style="min-width: 250px;">
      <label class="form-label fw-bold">État :</label>
      <div class="form-select" @click="toggleDropdown" style="cursor: pointer;">
        {{ etatSelectionnes.length > 0 ? etatSelectionnes.join(', ') : 'Sélectionner les états' }}
      </div>
      <div
        v-if="dropdownVisible"
        class="border rounded shadow-sm position-absolute bg-white p-2 mt-1"
        style="z-index: 1000; max-height: 300px; overflow-y: auto; width: 100%;"
      >
        <div v-for="etat in etatsDisponibles" :key="etat" class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            :id="etat"
            :value="etat"
            v-model="etatSelectionnes"
          />
          <label class="form-check-label" :for="etat">
            {{ etat }}
          </label>
        </div>
      </div>
    </div>


    <!-- Recherche -->
    <div>
      <label class="form-label fw-bold">Recherche :</label>
      <input
        type="text"
        class="form-control"
        v-model="recherche"
        placeholder="Rechercher..."
        style="min-width: 200px;"
      />
    </div>



    <!-- Bouton filtrer -->
    <div>
      <button class="btn btn-primary mt-4" @click="filtrer">Filtrer</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const etatsDisponibles = [
  'Brouillon',
  'Soumis',
  'En attente d\'approbation',
  'Modifié',
  'Traitée',
  'En attente d\'une pièce justificative',
  'Retiré',
  'Refusé'
]

const etatSelectionnes = ref([])
const recherche = ref('')
const periode = ref({
  de: new Date().toISOString().slice(0, 10),
  a: new Date().toISOString().slice(0, 10)
})

const dropdownVisible = ref(false)

function toggleDropdown() {
  dropdownVisible.value = !dropdownVisible.value
}

function closeDropdownOnClickOutside(event) {
  if (!event.target.closest('.position-relative')) {
    dropdownVisible.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdownOnClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeDropdownOnClickOutside)
})

const emit = defineEmits(['filtrer'])

function filtrer() {
  emit('filtrer', {
    etat: etatSelectionnes.value,
    recherche: recherche.value,
    periode: {
      type: 'intervalle',
      valeur: {
        de: periode.value.de,
        a: periode.value.a
      }
    }
  })
}
</script>
