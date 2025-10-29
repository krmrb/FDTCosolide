<template>
  <main class="flex-fill d-flex flex-column min-vh-100">
    <div class="main-content bg-white flex-column flex-fill p-3 p-sm-5 px-sm-1 pt-sm-3">
      <table class="table table-hover">
        <thead class="table-light">
          <tr>
            <th @click="$emit('trier', 'dateDebutAbsence')" style="cursor: pointer">
              <span style="white-space: nowrap;">
                <i class="bi bi-calendar-event-fill text-primary" title="Date d'absence"></i> Date d'absence
                <i :class="getIcon('dateDebutAbsence')"></i>
              </span>
            </th>
            <th>
              <span style="white-space: nowrap">
                <i class="bi bi-person-circle text-success" title="Initiée par"></i> Initiée par
              </span>
            </th>
            <th @click="$emit('trier', 'date')" style="cursor: pointer">
              <span style="white-space: nowrap">
                <i class="bi bi-calendar-event-fill text-primary" title="Initiée le"></i> Initiée le
                <i :class="getIcon('date')"></i>
              </span>
            </th>
            <th @click="$emit('trier', 'corpsEmploi')" style="cursor: pointer">
              <span style="white-space: nowrap">
                <i class="bi bi-briefcase-fill text-success" title="Emploi"></i> Emploi
                <i :class="getIcon('corpsEmploi')"></i>
              </span>
            </th>
            <th @click="$emit('trier', 'lieuTravail')" style="cursor: pointer">
              <span style="white-space: nowrap">
                <i class="bi bi-geo-alt-fill text-success" title="Lieu de travail"></i> Lieu de travail
                <i :class="getIcon('lieuTravail')"></i>
              </span>
            </th>
            <th @click="$emit('trier', 'motif')" style="cursor: pointer">
              <span style="white-space: nowrap">
                <i class="bi bi-chat-left-text-fill text-warning" title="Motif"></i> Motif
                <i :class="getIcon('motif')"></i>
              </span>
            </th>
            <th @click="$emit('trier', 'etat')" style="cursor: pointer">
              <span style="white-space: nowrap">
                <i class="bi bi-info-circle-fill text-danger" title="État"></i> État
                <i :class="getIcon('etat')"></i>
              </span>
            </th>
            <th>
              <span style="white-space: nowrap">
                <i class="bi bi-sticky-fill text-info" title="Note"></i> Note
              </span>
            </th>
            <th>
              <span style="white-space: nowrap">
                <i class="bi bi-gear-fill text-secondary" title="Actions"></i> Actions
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="demande in demandesFiltrees" :key="demande.id">
            <td>
              <span style="white-space: nowrap">Du {{ formatDateLong(demande.dateDebutAbsence) }}</span>
              <br />
              <span style="white-space: nowrap">Au {{ formatDateLong(demande.dateFinAbsence) }}</span>
            </td>
            <td>{{ demande.demandePar }}</td>
            <td><span style="white-space: nowrap">{{ formatDateLCour(demande.date) }}</span></td>
            <td>{{ demande.corpsEmploi }}</td>
            <td>{{ demande.lieuTravail }}</td>
            <td>{{ demande.motif }}</td>
            <td>
              <span :class="['badge', getEtatColor(demande.etat)]">{{ demande.etat }}</span>
            </td>
            <td>{{ demande.noteApprobation }}</td>
            <td align="center">
              <span style="white-space: nowrap">
              <button v-if="demande.etat !== 'Brouillon'" class="btn btn-sm" @click="$emit('voirDetails', demande)">
                <i class="bi-eye text-secondary" title="Voir les détails"></i>
              </button>
              <button v-if="demande.etat === 'Brouillon'" class="btn btn-sm" @click="$emit('modifier', demande)">
                <i class="bi-pencil-square text-secondary" title="Modifier"></i>
              </button>
              <button v-if="['Soumis', 'Brouillon'].includes(demande.etat)" class="btn btn-sm" @click="$emit('retirer', demande)">🗑️</button>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <nav class="w-80 mx-auto" aria-label="Pagination">
        <ul class="pagination justify-content-center mt-0">
            <li class="page-item disabled"><a class="page-link" hrefclass="page-item"><<</a></li>
            <li class="page-item">&nbsp;&nbsp;</li>
            <li class="page-item disabled"><a class="page-link" hrefclass="page-item">Précédent</a></li>
            <li class="page-item">&nbsp;&nbsp;&nbsp;&nbsp;</li>
            <li class="page-item"><a class="page-link" hrefclass="page-item">1</a></li>
            <li class="page-item"><a class="page-link" hrefclass="page-item">2</a></li>
            <li class="page-item"><a class="page-link" hrefclass="page-item">3</a></li>
            <li class="page-item active"><a class="page-link" hrefclass="page-item">4</a></li>
            <li class="page-item"><a class="page-link" hrefclass="page-item">5</a></li>
            <li class="page-item"><a class="page-link" hrefclass="page-item">6</a></li>
            <li class="page-item"><a class="page-link" hrefclass="page-item">7</a></li>
            <li class="page-item">&nbsp;&nbsp;&nbsp;&nbsp;</li><li class="page-item">
              <a class="page-link" hrefclass="page-item">Suivant</a>
            </li>
            <li class="page-item">&nbsp;&nbsp;</li>
            <li class="page-item"><a class="page-link" hrefclass="page-item">>></a></li>
        </ul>
      </nav>
    </div>
  </main>
</template>

<script setup>
const props = defineProps(['demandesFiltrees', 'tri'])

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('fr-CA');
function formatDateLong(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-CA', {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

function formatDateLCour(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

const getEtatColor = (etat) => {
  switch (etat) {
    case 'Brouillon': return 'bg-secondary';
    case 'Soumis': return 'bg-primary';
    case 'En attente d\'approbation': return 'bg-warning';
    case 'Modifié': return 'bg-info';
    case 'Traitée': return 'bg-success';
    case 'En attente d\'une pièce justificative': return 'bg-warning';
    case 'Annulé': return 'bg-dark';
    case 'Refusé': return 'bg-danger text-white';
    default: return 'bg-light';
  }
};

function getIcon(colonne) {
  if (props.tri.colonne !== colonne) return 'bi bi-arrow-down-up'
  return props.tri.ordre === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'
}

const emit = defineEmits(['voirDetails'])
</script>
