<template>
  <div class="body">
    <div class="page-layout" :class="{ 'horaire-visible': afficherHoraire }">
      <!-- Formulaire principal -->
      <div class="form-container">
        <!-- Identité -->
        <div class="mt-4 p-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="mb-0">Demande d'absence</h3>
            
            <!-- Bouton toggle horaire -->
            <button 
              class="btn-toggle-horaire" 
              @click="afficherHoraire = !afficherHoraire"
              :title="afficherHoraire ? 'Masquer l\'horaire' : 'Afficher l\'horaire'">
              <i class="bi bi-calendar-week me-2"></i>
              <span>{{ afficherHoraire ? 'Masquer' : 'Consulter' }} horaire</span>
              <i class="bi ms-2" :class="afficherHoraire ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </button>
          </div>

      
          <div class="border-top border-3 border-primary my-4"></div>
        </div>

        <!-- Formulaire -->
        <div class="bg-light p-4">



 <!-- Date début -->
        <div class="row mb-3 align-items-center">
          <div class="col-md-4"><label for="date">Date de début</label></div>
          <div class="col-md-4 text-end">
            <span class="text-muted me-2 fw-bold">{{ jourDebut }}</span>
          </div>
          <div class="col-md-4">
            <input type="date" id="date_deb" class="form-control" v-model="form.date_deb" />
          </div>
        </div>
        <!-- Date fin-->
        <div class="row mb-3 align-items-center">

          <!-- Message d'erreur -->
          <div v-if="!isDateRangeValid" class="alert-message">
            ⚠️ La date de fin ne peut pas être antérieure à la date de début.
          </div>

          <div class="col-md-4"><label for="date">Date de fin</label></div>
          <div class="col-md-4 text-end">
            <span class="text-muted me-2 fw-bold">{{ jourFin }}</span>
          </div>
          <div class="col-md-4">
            <input type="date"
                   id="date_fin"
                   v-model="form.date_fin"
                   :class="['form-control', { 'is-invalid': !isDateRangeValid }]" />
          </div>
        </div>

        <!-- Checkbox "Journée entière" avec info au survol -->
        <div class="row mb-3">

          <div class="col-md-12 d-flex justify-content-end align-items-center">
            <label class="form-check-label me-2" for="touteJournee">Journée entière</label>
            <div class="form-check tooltip-hover">
              <input class="form-check-input me-2"
                     type="checkbox"
                     id="touteJournee"
                     v-model="form.touteJournee">

            </div>
          </div>
        </div>

        <!-- Champ "De" -->
        <div class="row mb-3" :style="{ opacity: form.touteJournee ? 0.5 : 1 }">
          <div class="col-md-7">
            <label for="de">Heure de début</label>
          </div>
          <div class="col-md-5">
            <input type="time" id="de" class="form-control form-control-sm" v-model="form.de" v-bind:disabled="form.touteJournee" placeholder="ex: 08:00" />
          </div>
        </div>

        <!-- Champ "À" -->
        <div class="row mb-3" :style="{ opacity: form.touteJournee ? 0.5 : 1 }">
          <div class="col-md-7">
            <label for="a">Heure de fin</label>
          </div>
          <div class="col-md-5">
            <input type="time" id="a" class="form-control form-control-sm" v-model="form.a" v-bind:disabled="form.touteJournee" placeholder="ex: 16:00" />
          </div>
        </div>

        <!-- Emploi -->
        <div class="row mb-3">
          <div class="col-md-7"><label for="emploi">Emploi</label></div>
          <div class="col-md-5">
            <select id="emploi" class="form-select" v-model="form.emploi">
              <option v-for="job in emplois" :key="job.code" :value="job.code">
                {{job.corps_emploi}} - {{ job.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Lieu de travail -->
        <div class="row mb-3">
          <div class="col-md-7"><label for="lieu">Lieu de travail</label></div>
          <div class="col-md-5">
            <select id="lieu" class="form-select" v-model="form.lieu">
              <option v-for="lieu in lieuxTravail" :key="lieu.code" :value="lieu.code">
                {{ lieu.code }} - {{ lieu.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Motif d'absence -->
        <div class="row mb-3">
          <div class="col-md-7"><label for="motif">Motif d'absence</label></div>
          <div class="col-md-5">
            <select id="motif" class="form-select" v-model="form.motif">
              <option v-for="motif in motifsAbsence" :key="motif.code" :value="motif.code">
                {{ motif.code }} - {{ motif.label }}
              </option>
            </select>
          </div>
        </div>

       

        <!-- Pièces jointes -->
        <div class="row mb-3">
          <div class="col-md-7">
            <label for="pieceJointe" class="label-piece-jointe">Pièce jointe</label>
          </div>
          <div class="col-md-5">
            <div class="custom-file-input-wrapper">
              <input type="file" 
                     id="pieceJointe" 
                     class="custom-file-input" 
                     @change="handleFileUpload"
                     accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                     multiple />
              <label for="pieceJointe" class="custom-file-label">
                <span class="file-button">Sélect. fichier</span>
                <span class="file-text">{{ form.fichiers.length > 0 ? form.fichiers.length + ' fichier(s) sélectionné(s)' : 'Aucun fichier choisi' }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Liste des fichiers sélectionnés -->
        <div v-if="form.fichiers.length > 0" class="row mb-3">
          <div class="col-md-7"></div>
          <div class="col-md-5">
            <div v-for="(fichier, index) in form.fichiers" :key="index" class="d-flex align-items-center justify-content-between bg-white border rounded p-2 mb-2">
              <div class="d-flex align-items-center flex-grow-1 me-2">
                <span class="me-2">📎</span>
                <span class="text-truncate small">{{ fichier.name }}</span>
              </div>
              <button type="button" 
                      class="btn btn-sm btn-outline-danger py-0 px-2" 
                      @click="removeFile(index)"
                      style="font-size: 0.8rem;">
                ✕
              </button>
            </div>
          </div>
        </div>

        <!-- Commentaire -->
        <div class="mb-3">
          <label for="commentaire" class="form-label">Commentaire</label>
          <textarea id="commentaire"
                    class="form-control"
                    v-model="form.commentaire"
                    rows="3"
                    placeholder="Ajouter un commentaire ici..."></textarea>
        </div>

        <!-- Soumettre -->
        <div class="mt-4 text-end">
          <button type="button"
                  class="btn btn-link text-danger text-decoration-underline"
                  @click="$emit('cancel')">
            Annuler
          </button>
          <button type="submit" class="btn btn-primary" @click.prevent="submitForm">Soumettre</button>
        </div>
      </div>
    </div>

    <!-- Panneau Horaire sur le côté (conditionnel) -->
    <transition name="slide-fade">
      <div v-if="afficherHoraire" class="horaire-panel">
        <div class="horaire-header">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h5 class="mb-0">
              <i class="bi bi-calendar-month me-2"></i>Mon horaire
            </h5>
          </div>
          <!-- Sélecteur de mois et année -->
          <div class="date-selector">
            <button class="btn-nav" @click="moisPrecedent">
              <i class="bi bi-chevron-left"></i>
            </button>
            <div class="date-display">
              <select v-model="moisSelectionne" class="select-mois">
                <option v-for="(mois, index) in moisListe" :key="index" :value="index">
                  {{ mois }}
                </option>
              </select>
              <select v-model="anneeSelectionnee" class="select-annee">
                <option v-for="annee in anneesDisponibles" :key="annee" :value="annee">
                  {{ annee }}
                </option>
              </select>
            </div>
            <button class="btn-nav" @click="moisSuivant">
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
        <div class="horaire-content">
          <!-- Calendrier mensuel -->
          <div class="calendrier-grid">
            <!-- En-têtes des jours -->
            <div v-for="jour in joursListe" :key="jour" class="jour-entete">
              {{ jour }}
            </div>
            
            <!-- Jours du mois -->
            <div 
              v-for="(jour, index) in joursCalendrier" 
              :key="index" 
              class="jour-cell"
              :class="{
                'jour-vide': !jour.numero,
                'jour-actif': jour.estAujourdhui,
                'jour-weekend': jour.estWeekend,
                'jour-avec-horaire': jour.horaire
              }">
              <div v-if="jour.numero" class="jour-numero">
                {{ jour.numero }}
              </div>
              <div v-if="jour.horaire" class="jour-horaire-mini">
                <i class="bi bi-clock"></i>
              </div>
              <div v-else-if="jour.numero && jour.estWeekend" class="jour-conge-mini">
                <i class="bi bi-x-circle"></i>
              </div>
            </div>
          </div>
          
          <!-- Légende -->
          <div class="legende mt-3">
            <div class="legende-item">
              <span class="legende-box legende-travail"></span>
              <small>Travail</small>
            </div>
            <div class="legende-item">
              <span class="legende-box legende-weekend"></span>
              <small>Congé</small>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
  </div>
</template>
<script setup>
  import { ref, computed, watch } from 'vue';

  // Données du formulaire
  const form = ref({
    nomNaissance: 'Dorion',
    prenom: 'Cédric',
    emploi: 'A',
    lieu: '001',
    motif: '',
    date_deb: '',
    date_fin: '',
    touteJournee: false,
    de: '',
    a: '',
    commentaire: '',
    fichiers: []
  });

  const emplois = [
    { code: 'A', label: 'Enseignant', corps_emploi: '3110' },
    { code: 'B', label: 'Suppléant', corps_emploi: '3457' },
    { code: 'C', label: 'Concierge', corps_emploi: '2520' }
  ];

  const lieuxTravail = [
    { code: '001', label: 'École Untel' },
    { code: '002', label: 'École Deux' },
    { code: '003', label: 'École Trois' }
  ];

  const motifsAbsence = [
    { code: '01', label: 'Maladie' },
    { code: '02', label: 'Congé' },
    { code: '03', label: 'Vacance' }
  ];

  // Données de l'horaire
  const afficherHoraire = ref(false);
  
  const aujourdhui = new Date();
  const moisSelectionne = ref(aujourdhui.getMonth());
  const anneeSelectionnee = ref(aujourdhui.getFullYear());
  
  const moisListe = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  const joursListe = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  
  const anneesDisponibles = computed(() => {
    const anneeActuelle = aujourdhui.getFullYear();
    return [anneeActuelle - 1, anneeActuelle, anneeActuelle + 1];
  });
  
  // Horaire type par défaut (peut être personnalisé)
  const horaireType = {
    lundi: '08:00-16:00',
    mardi: '08:00-16:00',
    mercredi: '08:00-12:00',
    jeudi: '08:00-16:00',
    vendredi: '08:00-15:00'
  };
  
  const joursCalendrier = computed(() => {
    const premierJour = new Date(anneeSelectionnee.value, moisSelectionne.value, 1);
    const dernierJour = new Date(anneeSelectionnee.value, moisSelectionne.value + 1, 0);
    
    // Ajuster pour commencer le lundi (0 = dimanche, 1 = lundi, etc.)
    let premierJourSemaine = premierJour.getDay();
    premierJourSemaine = premierJourSemaine === 0 ? 6 : premierJourSemaine - 1;
    
    const jours = [];
    
    // Ajouter les jours vides au début
    for (let i = 0; i < premierJourSemaine; i++) {
      jours.push({ numero: null });
    }
    
    // Ajouter les jours du mois
    for (let jour = 1; jour <= dernierJour.getDate(); jour++) {
      const date = new Date(anneeSelectionnee.value, moisSelectionne.value, jour);
      const jourSemaine = date.getDay();
      const estWeekend = jourSemaine === 0 || jourSemaine === 6;
      const estAujourdhui = 
        jour === aujourdhui.getDate() && 
        moisSelectionne.value === aujourdhui.getMonth() && 
        anneeSelectionnee.value === aujourdhui.getFullYear();
      
      let horaire = null;
      if (!estWeekend) {
        const nomsJours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        const nomJour = nomsJours[jourSemaine];
        horaire = horaireType[nomJour] || '08:00-16:00';
      }
      
      jours.push({
        numero: jour,
        estWeekend,
        estAujourdhui,
        horaire
      });
    }
    
    return jours;
  });
  
  const moisPrecedent = () => {
    if (moisSelectionne.value === 0) {
      moisSelectionne.value = 11;
      anneeSelectionnee.value--;
    } else {
      moisSelectionne.value--;
    }
  };
  
  const moisSuivant = () => {
    if (moisSelectionne.value === 11) {
      moisSelectionne.value = 0;
      anneeSelectionnee.value++;
    } else {
      moisSelectionne.value++;
    }
  };

  const horaire = ref([
    { nom: 'Lundi', date: '21 oct', heures: '08:00 - 16:00', estAujourdhui: true },
    { nom: 'Mardi', date: '22 oct', heures: '08:00 - 16:00', estAujourdhui: false },
    { nom: 'Mercredi', date: '23 oct', heures: '08:00 - 12:00', estAujourdhui: false },
    { nom: 'Jeudi', date: '24 oct', heures: '08:00 - 16:00', estAujourdhui: false },
    { nom: 'Vendredi', date: '25 oct', heures: '08:00 - 15:00', estAujourdhui: false },
    { nom: 'Samedi', date: '26 oct', heures: null, estAujourdhui: false },
    { nom: 'Dimanche', date: '27 oct', heures: null, estAujourdhui: false }
  ]);

  const semaineActuelle = computed(() => {
    const aujourd = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return aujourd.toLocaleDateString('fr-FR', options);
  });

  const dateCopier = ref(false);

  // Gestion des fichiers
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const maxSize = 5 * 1024 * 1024; // 5 Mo
    
    files.forEach(file => {
      if (file.size > maxSize) {
        alert(`Le fichier "${file.name}" dépasse la taille maximale de 5 Mo.`);
        return;
      }
      form.value.fichiers.push(file);
    });
    
    // Réinitialiser l'input pour permettre de sélectionner le même fichier à nouveau
    event.target.value = '';
  };

  const removeFile = (index) => {
    form.value.fichiers.splice(index, 1);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 octets';
    const k = 1024;
    const sizes = ['octets', 'Ko', 'Mo'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Méthode de soumission
  const submitForm = () => {
    if (!isDateRangeValid.value) {
      alert("La date de fin ne peut pas être antérieure à la date de début.");
      return;
    }
    console.log('Formulaire soumis:', form.value);
  };

  // Validation des dates
  const isDateRangeValid = computed(() => {
    if (!form.value.date_deb || !form.value.date_fin) return true;
    return new Date(form.value.date_fin) >= new Date(form.value.date_deb);
  });

  // Copier automatiquement la date de début vers la date de fin
  watch(() => form.value.date_deb, (newDate) => {
    if (!dateCopier.value && newDate) {
      form.value.date_fin = newDate;
      dateCopier.value = true;
    }
  });

  // Calcul des jours
  const jourDebut = computed(() => {
    if (!form.value.date_deb) return '';
    const date = new Date(form.value.date_deb);
    return date.toLocaleDateString('fr-FR', { weekday: 'long' });
  });

  const jourFin = computed(() => {
    if (!form.value.date_fin) return '';
    const date = new Date(form.value.date_fin);
    return date.toLocaleDateString('fr-FR', { weekday: 'long' });
  });
</script>
<style>
  .tooltip-hover {
    position: relative;
    cursor: pointer;
  }

    .tooltip-hover::after {
      content: "Cocher si l'absence couvre toute la journée";
      position: absolute;
      top: -30px;
      left: 0;
      background-color: rgba(0, 0, 0, 0.75);
      color: #fff;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 0.8rem;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      z-index: 10;
    }

    .tooltip-hover:hover::after {
      opacity: 1;
    }

  .alert-message {
    color: #d9534f;
    background-color: #ffffff;
    border: 1px solid #d9534f;
    padding: 8px 12px;
    border-radius: 6px;
    margin-bottom: 8px;
    font-size: 0.9rem;
    box-shadow: 0 0 4px rgba(217, 83, 79, 0.2);
  }

  .body {
    padding-bottom: 24rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
  }

  .btn-toggle-horaire {
    background: white;
    border: 2px solid #0d6efd;
    color: #0d6efd;
    padding: 0.5rem 1rem;
    border-radius: 25px;
    display: flex;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .btn-toggle-horaire:hover {
    background: #0d6efd;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
  }

  .page-layout {
    display: flex;
    gap: 2rem;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    transition: all 0.3s ease;
    justify-content: center;
    align-items: flex-start;
  }

  .page-layout:not(.horaire-visible) .form-container {
    max-width: 45%;
    margin: 0 auto;
  }

  .form-container {
    flex: 1;
    min-width: 0;
    max-width: 800px;
    transition: all 0.3s ease;
  }

  /* Panneau horaire */
  .horaire-panel {
    width: 100%;
    max-width: 420px;
    flex-shrink: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    height: fit-content;
    position: sticky;
    top: 80px;
  }

  .horaire-header {
    background: linear-gradient(135deg, #095797 0%, #073d6b 100%);
    color: white;
    padding: 1rem;
    border-radius: 8px 8px 0 0;
  }

  .date-selector {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  .btn-nav {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-nav:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .date-display {
    display: flex;
    gap: 0.5rem;
    flex: 1;
    justify-content: center;
  }

  .select-mois,
  .select-annee {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .select-mois {
    flex: 1;
  }

  .select-annee {
    width: 70px;
  }

  .select-mois option,
  .select-annee option {
    background: #095797;
    color: white;
  }

  .horaire-content {
    padding: 1rem;
    overflow-x: auto;
  }

  /* Calendrier Grid */
  .calendrier-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    min-width: 320px;
  }

  .jour-entete {
    text-align: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6c757d;
    padding: 0.5rem 0.25rem;
    border-bottom: 2px solid #dee2e6;
  }

  .jour-cell {
    aspect-ratio: 1;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 0.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background: white;
    transition: all 0.2s ease;
    position: relative;
    min-width: 0;
    overflow: hidden;
  }

  .jour-cell:hover:not(.jour-vide) {
    background: #f8f9fa;
    transform: scale(1.05);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .jour-vide {
    border: none;
    background: transparent;
  }

  .jour-actif {
    background: #e7f3ff;
    border: 2px solid #0d6efd;
    font-weight: bold;
  }

  .jour-actif .jour-numero {
    color: #0d6efd;
  }

  .jour-weekend {
    background: #fff5f5;
  }

  .jour-avec-horaire {
    background: #f0f9ff;
    border-color: #bde0fe;
  }

  .jour-numero {
    font-size: 0.85rem;
    font-weight: 600;
    color: #495057;
    margin-bottom: 0.125rem;
  }

  .jour-horaire-mini {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.125rem;
    margin-top: 0.125rem;
  }

  .jour-horaire-mini i {
    font-size: 0.85rem;
    color: #198754;
  }

  .jour-conge-mini {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .jour-conge-mini i {
    font-size: 0.9rem;
    color: #dc3545;
  }

  /* Légende */
  .legende {
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid #dee2e6;
  }

  .legende-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .legende-box {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    border: 1px solid #dee2e6;
  }

  .legende-travail {
    background: #f0f9ff;
    border-color: #bde0fe;
  }

  .legende-weekend {
    background: #fff5f5;
    border-color: #ffc9c9;
  }

  .semaine-info {
    text-align: center;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #dee2e6;
  }

  .jour-item {
    margin-bottom: 0.75rem;
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  .jour-item:hover {
    background: #e9ecef;
    transform: translateX(2px);
  }

  .jour-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .jour-actif {
    font-weight: bold;
  }

  .jour-actif .jour-nom {
    color: #0d6efd;
  }

  .jour-nom {
    font-size: 0.95rem;
    font-weight: 600;
    color: #495057;
  }

  .jour-date {
    font-size: 0.85rem;
    color: #6c757d;
  }

  .jour-horaire {
    font-size: 0.85rem;
  }

  .horaire-details {
    color: #198754;
    display: flex;
    align-items: center;
  }

  .jour-conge {
    color: #dc3545;
    display: flex;
    align-items: center;
  }

  /* Animation pour l'apparition du panneau */
  .slide-fade-enter-active {
    transition: all 0.3s ease-out;
  }

  .slide-fade-leave-active {
    transition: all 0.3s ease-in;
  }

  .slide-fade-enter-from {
    transform: translateX(20px);
    opacity: 0;
  }

  .slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }

  /* Responsive */
  @media (max-width: 1200px) {
    .page-layout.horaire-visible {
      flex-direction: column;
    }

    .horaire-panel {
      width: 100%;
      max-width: 450px;
      margin: 0 auto;
      position: relative;
      top: 0;
    }

    .form-container {
      max-width: 45%;
      margin: 0 auto;
    }
  }

  @media (max-width: 768px) {
    .form-container {
      max-width: 100% !important;
    }

    .btn-toggle-horaire {
      font-size: 0.8rem;
      padding: 0.4rem 0.8rem;
    }

    .btn-toggle-horaire span {
      font-size: 0.75rem;
    }
  }

  .label-piece-jointe {
    display: block;
    white-space: normal;
    word-wrap: break-word;
    line-height: 1.5;
  }

  /* Custom file input */
  .custom-file-input-wrapper {
    position: relative;
    width: 100%;
  }

  .custom-file-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .custom-file-label {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.25rem 0.5rem;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    background-color: #fff;
    cursor: pointer;
    margin-bottom: 0;
  }

  .file-button {
    display: inline-block;
    padding: 0.2rem 0.4rem;
    background-color: #0d6efd;
    color: white;
    border-radius: 0.25rem;
    font-size: 0.7rem;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .file-button:hover {
    background-color: #0b5ed7;
  }

  .file-text {
    margin-left: 0.5rem;
    font-size: 0.875rem;
    color: #6c757d;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }

</style>