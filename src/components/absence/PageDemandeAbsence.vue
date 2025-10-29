<template>
  <div v-if="affichage === 'popup'" class="modal fade show d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <FormulaireAbsence
          :form="form"
          :emplois="emplois"
          :lieuxTravail="lieuxTravail"
          :motifsAbsence="motifsAbsence"
          :jourDebut="jourDebut"
          :jourFin="jourFin"
          :isDateRangeValid="isDateRangeValid"
          :handleFileUpload="handleFileUpload"
          :removeFile="removeFile"
          :soumettre="soumettre"
          :mode="mode"
          :demande="demande"
          @fermer="emit('fermer')"
          @retirer="emit('retirer', demande)"
        />
      </div>
    </div>
  </div>

  <div v-else class="container mt-4">
    <h2>Nouvelle demande d’absence</h2>
    <FormulaireAbsence
      :form="form"
      :emplois="emplois"
      :lieuxTravail="lieuxTravail"
      :motifsAbsence="motifsAbsence"
      :jourDebut="jourDebut"
      :jourFin="jourFin"
      :isDateRangeValid="isDateRangeValid"
      :handleFileUpload="handleFileUpload"
      :removeFile="removeFile"
      :soumettre="soumettre"
      :mode="mode"
      :demande="demande"
      @fermer="emit('fermer')"
      @retirer="emit('retirer', demande)"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import FormulaireAbsence from '../absence/FormulaireAbsence.vue'
import corpsEmploiData from '@/types/corpsEmploi.json'
import motifAbsenceData from '@/types/MotifAbsence.json'

const props = defineProps({
  demande: {
    type: Object,
    default: null
  },
  affichage: {
    type: String,
    default: 'page' // 'page' ou 'popup'
  }
})

const emit = defineEmits(['fermer', 'modifier', 'ajouter', 'soumettrePiece', 'retirer'])

const form = ref({
  nomNaissance: 'Dorion',
  prenom: 'Cédric',
  emploi: '',
  lieu: '001',
  motif: '',
  date_deb: '',
  date_fin: '',
  touteJournee: false,
  de: '',
  a: '',
  commentaire: '',
  fichiers: []
})

// Utiliser les données des fichiers JSON
const emplois = corpsEmploiData.corpsEmploi.map(item => ({
  code: item.code,
  label: item.description,
  corps_emploi: item.code
}))

const lieuxTravail = [
  { code: '001', label: 'École Untel' },
  { code: '002', label: 'École Deux' },
  { code: '003', label: 'École Trois' }
]

const motifsAbsence = motifAbsenceData.motifAbsence.map(item => ({
  code: item.code,
  label: item.description
}))

const jourDebut = computed(() => {
  if (!form.value.date_deb) return ''
  return new Date(form.value.date_deb).toLocaleDateString('fr-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const jourFin = computed(() => {
  if (!form.value.date_fin) return ''
  return new Date(form.value.date_fin).toLocaleDateString('fr-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const isDateRangeValid = computed(() => {
  if (!form.value.date_deb || !form.value.date_fin) return true
  return new Date(form.value.date_fin) >= new Date(form.value.date_deb)
})

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  form.value.fichiers.push(...files)
}

const removeFile = (index) => {
  form.value.fichiers.splice(index, 1)
}

const mode = computed(() => props.demande ? 'modification' : 'ajout')

const demande = ref({
  date: '',
  demandePar: '',
  superviseur: '',
  secretaire: '',
  identifiant: '123456',
  motif: '',
  note: '',
  etat: '',
  pieceJointe: null
})

onMounted(() => {
  if (props.demande) {
    demande.value = { ...props.demande }
  } else {
    demande.value.date = new Date().toISOString()
  }
})

const soumettre = () => {
  if (!isDateRangeValid.value) {
    alert("La date de fin ne peut pas être antérieure à la date de début.")
    return
  }

  if (mode.value === 'modification') {
    emit('modifier', demande.value)
  } else {
    emit('ajouter', demande.value)
  }

  emit('fermer')
}
</script>