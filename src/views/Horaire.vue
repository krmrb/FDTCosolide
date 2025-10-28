<template>

   <main class="container-xl bg-light border-bottom border-3 min-vh-100">
      <div class="container">
         <h2>Horaire</h2>
         <div id="declarationTempsContent">
         </div>
         <h4 id="calendar-title" class="fw-bold text-center my-4"></h4>
         <div id="datepicker-container" class="fc-toolbar-chunk d-flex align-items-center">
            <input type="date" id="datepicker" class="form-control small-datepicker" />
         </div>
         <div id="filter-container" class="fc-toolbar-chunk d-flex align-items-center m-0 p-0">
            <div class="dropdown">
               <button class="btn btn-success" type="button" data-bs-toggle="dropdown">
               <i class="bi bi-filter"></i>
               </button>
               <ul class="dropdown-menu p-3" style="min-width: 250px;">
                  <li>
                     <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="Disponibilites" id="checkDisponibilites" checked />
                        <label class="form-check-label" for="checkDisponibilites">Disponibilités</label>
                     </div>
                  </li>
                  <li class="mt-3 text-center">
                     <button class="btn btn-primary btn-sm" @click="submitSelections">Appliquer</button>
                  </li>
               </ul>
            </div>
         </div>
         <div id="external-events" class="d-flex gap-2 flex-wrap mb-3">
            <button class="fc-event btn btn-primary" data-event='{"title":"Absence"}'>Absence</button>
            <button class="fc-event btn btn-success" data-event='{"title":"Réunion"}'>Réunion</button>
         </div>
         <!-- Bouton pour ouvrir la modale -->
         <div class="text-end mb-3">
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#elementModal">
            Générer une nouvelle absence
            </button>
         </div>
         <!-- Modale Bootstrap -->
         <div class="modal fade" id="elementModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
               <div class="modal-content">
                  <div class="modal-header">
                     <h5 class="modal-title">Générer une absence</h5>
                     <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                  </div>
                  <div class="modal-body">
                     <form @submit.prevent="submitElement">
                        <div class="row g-3">
                           <!--
                              <div class="col-md-4">
                                <label class="form-label">Employé ID</label>
                                <input type="number" v-model="form.employeId" class="form-control" required />
                              </div>
                              <div class="col-md-4">
                                <label class="form-label">Période ID</label>
                                <input type="number" v-model="form.periodeId" class="form-control" required />
                              </div>
                              <div class="col-md-12">
                                <label class="form-label">Description</label>
                                <input type="text" v-model="form.description" class="form-control" required />
                              </div>
                              -->
                           <div class="col-md-12">
                              <p><strong>Demande d'absence initiée le :</strong> Mardi le 2025-09-30</p>
                              <p><strong>Demandé par  ou Initié par :</strong> Cédric Doiron</p>
                           </div>
                           <div class="col-md-6">
                              <label class="form-label"><strong>Date début</strong></label>
                              <input type="datetime-local" v-model="form.dateHeureDebut" class="form-control" required />
                           </div>
                           <div class="col-md-6">
                              <label class="form-label"><strong>Date fin</strong></label>
                              <input type="datetime-local" v-model="form.dateHeureFin" class="form-control" required />
                           </div>
                           <div class="col-md-4">
                              <label class="form-label"><strong>Code emploi</strong></label>
                              <select v-model="form.corpEmploiCode" class="form-select">
                                 <option value="Commissaire">Commissaire</option>
                                 <option value="Représentant parents">Représentant parents</option>
                                 <option value="Membre du CA">Membre du CA</option>
                                 <option value="Tuteur Étudiant Coll Univ">Tuteur Étudiant Coll Univ</option>
                              </select>
                           </div>
                           <div class="col-md-4">
                              <label class="form-label"><strong>Lieu de travail</strong></label>
                              <select v-model="form.lieuTravailCode" class="form-select">
                                 <option value="École 001">École 001</option>
                                 <option value="École 002">École 002</option>
                                 <option value="École 003">École 003</option>
                                 <option value="École 004">École 004</option>
                              </select>
                           </div>
                           <div class="col-md-4">
                              <label class="form-label"><strong>Motif</strong></label>
                              <select v-model="form.motifCode" class="form-select">
                                 <option value="Demande de maladie">Demande de maladie</option>
                                 <option value="Demande de choix de vacances">Demande de choix de vacances</option>
                                 <option value="Demande de journée flottante mobile">Demande de journée flottante mobile</option>
                                 <option value="Demande de journée de cause majeure">Demande de journée de cause majeure</option>
                              </select>
                           </div>
                           <div class="col-12">
                              <label class="form-label"><strong>Commentaire</strong></label>
                              <textarea v-model="form.commentaire" class="form-control"></textarea>
                           </div>
                           <!--
                              <div class="col-md-4">
                                <label class="form-label"><strong>Statut</strong></label>
                                <select v-model="form.statut" class="form-select">
                                  <option :value="0">Soumis</option>
                                  <option :value="1">En cours</option>
                                  <option :value="2">Traitée</option>
                                  <option :value="3">En attente d'une pièce justificative</option>
                                </select>
                              </div>
                              -->
                        </div>
                        <div class="mt-4 text-end">
                           <button type="submit" class="btn btn-success">Enregistrer</button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         </div>
         <div id="calendar" style="color: black; font-weight: bold;"></div>
         <!-- Modal -->
         <div class="modal fade" id="eventModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog" id="eventModalDialog">
               <div class="modal-content">
                  <div class="modal-header">
                     <h5 class="modal-title text-center w-100" id="eventModalLabel">Détail</h5>
                  </div>
                  <div class="modal-body">
                     <p id="eventTitle"></p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </main>
   <div id="context-menu" class="position-absolute bg-white border shadow-sm p-2" style="display: none; z-index: 999;">
      <button class="btn btn-sm btn-outline-primary w-100 mb-1" @click="modifierElement">Modifier</button>
      <button class="btn btn-sm btn-outline-danger w-100" @click="supprimerElement">Supprimer</button>
   </div>
</template>


<script setup lang="ts">
import { Draggable } from '@fullcalendar/interaction'
import { onMounted } from 'vue'
import HoraireCalendar from "@/components/horaire/HoraireCalendar"

defineEmits(['personaSelected'])

const isEditing = ref(false)
const editingId = ref(null)

import { ref } from 'vue'

const form = ref({
  employeId: 1,
  periodeId: 3,
  description: '',
  dateHeureDebut: '',
  dateHeureFin: '',
  commentaire: '',
  corpEmploiCode: '',
  lieuTravailCode: '',
  motifCode: '',
  statut: 0
})

function submitElement() {
  const url = isEditing.value
    ? `http://localhost:5287/api/elements/${editingId.value}`
    : 'http://localhost:5287/api/elements'

  const method = isEditing.value ? 'PUT' : 'POST'

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  })
    .then(res => {
      if (!res.ok) throw new Error("Erreur API")
      return res.json()
    })
    .then(data => {
      const calendar = window.sieCalandarHoraire

      if (isEditing.value) {
        // Mise à jour dans le calendrier
        const event = calendar.getEventById(editingId.value)
        if (event) {
          event.setProp('title', form.value.description)
          event.setStart(form.value.dateHeureDebut)
          event.setEnd(form.value.dateHeureFin)
        }
      } else {
        // Ajout dans le calendrier
        calendar.addEvent({
          id: data.id,
          title: form.value.description,
          start: form.value.dateHeureDebut,
          end: form.value.dateHeureFin
        })
      }

      const modal = window.bootstrap.Modal.getInstance(document.getElementById('elementModal'))
      modal.hide()

      // Réinitialiser
      isEditing.value = false
      editingId.value = null
      form.value = {
        employeId: 1,
        periodeId: 3,
        description: '',
        dateHeureDebut: '',
        dateHeureFin: '',
        commentaire: '',
        corpEmploiCode: '',
        lieuTravailCode: '',
        motifCode: '',
        statut: 0
      }
    })
    .catch(err => {
      console.error("Erreur lors de la soumission :", err)
    })
}

function submitSelections(event) {
  if (event) event.preventDefault()

  document.querySelectorAll('.form-check-input').forEach(input => {
    localStorage.setItem(input.id, input.checked)
  })

  const calendar = window.sieCalandarHoraire
  if (calendar && calendar.refetchEvents) {
    calendar.refetchEvents()
  }

  const dropdown = event.target.closest('.dropdown')
  const toggleButton = dropdown.querySelector('[data-bs-toggle="dropdown"]')
  const dropdownInstance = bootstrap.Dropdown.getOrCreateInstance(toggleButton)
  dropdownInstance.hide()
}

onMounted(() => {
  const calendarEl = document.getElementById('calendar')
  const datepickerEl = document.getElementById('datepicker')
  const url = 'http://localhost:5287/api/elements/periode/0/calendar'

  window.calendarLocale = 'fr'
  new HoraireCalendar(calendarEl, datepickerEl, url)

  // Initialiser FullCalendar Draggable
  /*new Draggable(document.getElementById('external-events'), {
    itemSelector: '.fc-event',
    eventData: function (eventEl) {
      const data = eventEl.getAttribute('data-event')
      return data ? JSON.parse(data) : { title: eventEl.innerText.trim() }
    }
  })*/
})


function modifierElement() {
  const event = window.selectedCalendarEvent
  if (!event) return

  isEditing.value = true
  editingId.value = event.id

  form.value = {
    employeId: 1,
    periodeId: 3,
    description: event.title,
    dateHeureDebut: event.start.toISOString().slice(0, 16),
    dateHeureFin: event.end?.toISOString().slice(0, 16) ?? event.start.toISOString().slice(0, 16),
    commentaire: '',
    corpEmploiCode: '',
    lieuTravailCode: '',
    motifCode: '',
    statut: 0
  }

  const modal = new window.bootstrap.Modal(document.getElementById('elementModal'))
  modal.show()
  hideContextMenu()

}

function supprimerElement() {
  const event = window.selectedCalendarEvent
  if (!event) return

  fetch(`http://localhost:5287/api/elements/${event.id}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (!res.ok) throw new Error("Erreur suppression")
      window.sieCalandarHoraire.refetchEvents()
      hideContextMenu()
    })
    .catch(err => console.error("Erreur suppression :", err))
}

function hideContextMenu() {
  const menu = document.getElementById('context-menu')
  menu.style.display = 'none'
}

document.addEventListener('click', hideContextMenu)

</script>


<style scoped>
#external-events .fc-event {
  cursor: grab;
  border-radius: 4px;
  user-select: none;
}
.fc-event {
  cursor: grab;
  user-select: none;
}

/* Classes pour les événements en vue Mois */
.fc-event-absence {
  background-color: #FFA500 !important;
  border-color: #FF8C00 !important;
  color: #000000 !important;
}

.fc-event-paiement {
  background-color: #87CEEB !important;
  border-color: #4682B4 !important;
  color: #000000 !important;
}








/* SIMPLE ET EFFICACE */
.fc-event-absence {
  background-color: #FFA500 !important;
}

.fc-event-paiement {
  background-color: #87CEEB !important;
}





/* Masquer les boutons externes originaux */
#external-events {
  display: none !important;
}
</style>

import '@fullcalendar/common/main.css'
import '@fullcalendar/daygrid/main.css'
<style src="@/assets/Horaire.css"></style>