<template>
  <div>
    <div v-if="afficherSuiviDemandes" class="suiviDemandes-container">
      <SuiviDemandes
                     :evenement="evenementSelectionne"
                     :modeModification="modeModification"
                     @nouvelleDemande="ajouterDemande"
                     @fermer="afficherSuiviDemandes = false" />
    </div>

    <div v-else class="declaration-container">
      <!-- Colonne 1 : Calendrier mensuel -->
      <div class="calendar-column">
        <div class="calendar-box">
          <div class="calendar-header">
            <i class="bi bi-chevron-left" @click="afficherMoisPrecedent"></i>
            <span>{{ moisAffiche.format('MMMM YYYY') }}</span>
            <i class="bi bi-chevron-right" @click="afficherMoisSuivant"></i>
          </div>

          <div class="calendar-bar"></div>

          <div class="calendar-weekdays">
            <div v-for="day in joursSemaine" :key="day" class="weekday">
              {{ day }}
            </div>
          </div>

          <div class="calendar-grid">
            <div v-for="(jour, index) in joursDuMois"
                 :key="index"
                 :class="jour ? getClassesJour(jour) : 'calendar-day empty'">
              {{ jour ? jour.date() : '' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Colonne 2 : Événements -->
      <div class="events-column">
        <div class="ligne-evenement d-flex align-items-center justify-content-between">
          <div>
            <h3 class="titre-evenement">Événements</h3>
          </div>
          <div class="icon-haut">
            <div class="dropdown">
              <i class="bi bi-plus-circle add-icon text-success dropdown-toggle"
                 id="dropdownAjout"
                 data-bs-toggle="dropdown"
                 aria-expanded="false"
                 title="Ajouter un événement"></i>

              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownAjout">
                <li>
                  <button class="dropdown-item" @click="ajouterAbsence">
                    <i class="bi bi-person-plus me-2 text-success"></i> Ajouter une absence
                  </button>
                </li>
                <li>
                  <button class="dropdown-item" @click="ajouterPaiement">
                    <i class="bi bi-cash-coin me-2 text-primary"></i> Ajouter un paiement
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Élément tabulation -->
        <div>
          <ul class="nav nav-tabs">
            <li class="nav-item" v-for="tab in tabs" :key="tab.nom">
              <button :class="['nav-link', { active: ongletActif === tab.nom }]"
                      @click="ongletActif = tab.nom">
                {{ tab.label }}
              </button>
            </li>
          </ul>

          <div class="overflow-auto  mt-3" >
            <div class="me-3">
              <component v-if="composantActif"
                         :is="composantActif"
                         :events="events"
                         :key="ongletActif + '-' + (events?.value?.length ?? 0)"
                         @modifier="modifierEvenement"
                         @supprimer="supprimerEvenement" />

              <div v-else class="text-muted">
                Onglet invalide ou composant introuvable.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import dayjs from 'dayjs';
  import 'dayjs/locale/fr';
  import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
  import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

  import FormulaireAbsence from '@/components/autorisation/FormulaireAbsence.vue';
  import FormulairePaiement from '@/components/autorisation/FormulairePaiement.vue';
  import EnCreation from '@/components/autorisation/EnCreation.vue';
  import EnSoumission from '@/components/autorisation/EnSoumission.vue';
  import EstTraite from '@/components/autorisation/EstTraite.vue';
  import SuiviDemandes from '@/components/autorisation/SuiviDemandes.vue'

  import type { Demande } from '@/types/demande';

  const basePath = import.meta.env.VITE_BASE_PATH;

  dayjs.locale('fr');
  dayjs.extend(isSameOrAfter);
  dayjs.extend(isSameOrBefore);

  const router = useRouter();

  // Onglet actif
  const ongletActif = ref('en_creation');

  // Mois affiché
  const moisAffiche = ref(dayjs().startOf('month'));

  // Jours de la semaine
  const joursSemaine = ['D', 'L', 'Ma', 'Me', 'J', 'V', 'S'];

  // Jours du mois
  const joursDuMois = computed(() => {
    const jours = [];
    const premierJour = moisAffiche.value.startOf('month');
    const decalage = (premierJour.day() + 1) % 7;
    for (let i = 0; i < decalage; i++) {
      jours.push(null);
    }
    const nbJours = moisAffiche.value.daysInMonth();
    for (let i = 1; i <= nbJours; i++) {
      jours.push(dayjs(moisAffiche.value).date(i));
    }
    return jours;
  });

  // Périodes de paie
  const toutesPeriodesDePaie = computed(() => {
    const periodes = [];
    let debut = dayjs(`${moisAffiche.value.year()}-01-01`);
    for (let i = 0; i < 26; i++) {
      const fin = debut.add(13, 'day');
      periodes.push({ debut, fin });
      debut = fin.add(1, 'day');
    }
    return periodes;
  });

  const periodeActive = computed(() => {
    const aujourdHui = dayjs();
    return toutesPeriodesDePaie.value.find(p =>
      aujourdHui.isSameOrAfter(p.debut, 'day') &&
      aujourdHui.isSameOrBefore(p.fin, 'day')
    );
  });

  const estDansPeriodeDePaie = (jour: dayjs.Dayjs): boolean => {
    if (!periodeActive.value) return false;
    return jour.isSameOrAfter(periodeActive.value.debut, 'day') &&
      jour.isSameOrBefore(periodeActive.value.fin, 'day');
  };

  // Événements
  const events = ref<Demande[]>([]);

  onMounted(() => {
    fetch(`${basePath}eventExemple.json`)
      .then(response => {
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
        return response.json();
      })
      .then((data: Demande[]) => {
        events.value = data.map(evt => ({
          ...evt,
          dateDebut: dayjs(evt.dateDebut).format('YYYY-MM-DD'),
          dateFin: dayjs(evt.dateFin).format('YYYY-MM-DD'),
          dateCreation: dayjs(evt.dateCreation).format('YYYY-MM-DD'),
          niveau1validation: evt.niveau1validation ?? '',
          niveau2validation: evt.niveau2validation ?? '',
          decision: evt.decision ?? null,
          attente_info: evt.attente_info ?? false
        }));
      })
      .catch(error => {
        console.error('Erreur de chargement des événements :', error);
      });
  });

  // Onglets
  const tabs = [
    { nom: 'en_creation', label: 'En création', composant: EnCreation },
    { nom: 'soumis', label: 'Soumis', composant: EnSoumission },
    { nom: 'traite', label: 'Traités', composant: EstTraite }
  ];

  const composantActif = computed(() => {
    const tab = tabs.find(tab => tab.nom === ongletActif.value);
    return tab?.composant ?? null;
  });

  // Navigation
  const afficherMoisPrecedent = () => {
    moisAffiche.value = moisAffiche.value.subtract(1, 'month');
  };
  const afficherMoisSuivant = () => {
    moisAffiche.value = moisAffiche.value.add(1, 'month');
  };

  // Couleurs
  const getClassesJour = (jour: dayjs.Dayjs): string => {
    let classes = 'calendar-day';
    if (estDansPeriodeDePaie(jour)) classes += ' highlighted';

    const evt = events.value.find(e =>
      dayjs(jour).isSameOrAfter(dayjs(e.dateDebut), 'day') &&
      dayjs(jour).isSameOrBefore(dayjs(e.dateFin), 'day')
    );

    if (evt) {
      switch (evt.typeEvenement) {
        case 'congé maladie': classes += ' event-maladie'; break;
        case 'vacances': classes += ' event-vacances'; break;
        case 'congé personnel': classes += ' event-personnel'; break;
        case 'paiement': classes += ' event-paiement'; break;
      }
    }

    return classes;
  };

  // Ajout d'une absence
  const ajouterAbsence = (): void => {
    evenementSelectionne.value = {
      id: '',
      matricule: '',
      dateCreation: dayjs().format('YYYY-MM-DD'),
      dateDebut: '',
      dateFin: '',
      emploi: '',
      lieu: '',
      motif: '',
      typeEvenement: 'Absence',
      touteJournee: true,
      de: '',
      a: '',
      nomNaissance: '',
      prenom: '',
      commentaire: '',
      etatValidation: 'En création',
      niveau1validation: '',
      niveau2validation: '',
      decision: null,
      attente_info: false
    }
    modeModification.value = false
    afficherSuiviDemandes.value = true
  }

  // Ajout d'un paiement
  const ajouterPaiement = (): void => {
    evenementSelectionne.value = {
      id: '',
      matricule: '',
      dateCreation: dayjs().format('YYYY-MM-DD'),
      dateDebut: '',
      dateFin: '',
      emploi: '',
      lieu: '',
      motif: '',
      typeEvenement: 'Paiement',
      touteJournee: true,
      de: '',
      a: '',
      nomNaissance: '',
      prenom: '',
      commentaire: '',
      etatValidation: 'En création',
      niveau1validation: '',
      niveau2validation: '',
      decision: null,
      attente_info: false
    }
    modeModification.value = false
    afficherSuiviDemandes.value = true
  }

  // Réception de la demande depuis SuiviDemandes.vue
  const ajouterDemande = (demande: Demande): void => {
    console.log('Nouvelle demande reçue :', demande)
    events.value.push(demande)
  }

  // Modification
  const afficherFormulaire = ref(false);
  const evenementAModifier = ref<Demande | null>(null);

  const afficherFormulairePaiement = ref(false);
  const paiementAModifier = ref<Demande | null>(null);

  const modifierEvenement = (evt: Demande) => {
    evenementSelectionne.value = { ...evt }
    modeModification.value = true
    afficherSuiviDemandes.value = true
  }


  //Affichage
  const afficherSuiviDemandes = ref(false)
  const evenementSelectionne = ref<Demande | null>(null)
  const modeModification = ref(false)



  // Suppression
  const supprimerEvenement = (evt: Demande) => {
    events.value = events.value.filter(e =>
      !(e.id === evt.id && e.typeEvenement === evt.typeEvenement)
    );
  };

  // Ajout dans demandes soumises
  const demandesSoumises = ref<Demande[]>([]);
  function ajouterDemandeSoumise(demande: Demande) {
    if (demande.etatValidation === 'Soumis' &&
      !demandesSoumises.value.some(d => d.id === demande.id)) {
      demandesSoumises.value.push(demande);
    }
  }


</script>

<style scoped>

  .declaration-container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 1rem;
    padding: 2rem;
    height: 100%;
    padding-bottom: 6.7rem;
  }

  .calendar-column {
    padding: 1rem;
    border: 0.0625rem solid #ccc;
    border-radius: 0.5rem;
    background-color: #fff;
    max-width: 25rem;
    min-width: 18.75rem;
    flex-shrink: 0;
    box-shadow: 0.3125rem 0.3125rem 0.3125rem rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    align-self: flex-start;
  }

  .calendar-box {
    max-height: 18rem;
    height: 18rem;
    overflow-y: auto;
  }

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    margin-bottom: 0.3rem;
    font-size: 1.1rem;
    color: #0073CF;
  }

  .calendar-bar {
    height: 4px;
    background-color: #0073CF;
    margin-bottom: 0.5rem;
    border-radius: 2px;
  }

  .calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-weight: bold;
    margin-bottom: 0.3rem;
    color: #0073CF;
  }

  .weekday {
    font-size: 0.8rem;
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.2rem;
    line-height: 1.2;
  }

  .calendar-day {
    text-align: center;
    padding: 0.3rem;
    border-radius: 4px;
    background-color: #fff;
    transition: background-color 0.3s ease;
    font-size: 0.85rem;
    color: #333;
  }

    .calendar-day.empty {
      background-color: transparent;
      pointer-events: none;
    }

  .highlighted {
    background-color: rgba(200, 200, 200, 0.4);
  }

  .event-maladie {
    background-color: rgba(255, 165, 0, 0.3);
  }

  .event-vacances {
    background-color: rgba(144, 238, 144, 0.3);
  }

  .event-personnel {
    background-color: rgba(173, 216, 230, 0.3);
  }

  .events-column {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    backdrop-filter: blur(4px);
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.6);
  }


    .events-column h3 {
      color: #656565;
      padding: 1rem;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

  .add-icon {
    cursor: pointer;
    font-size: 1.5rem;
  }

  .icon-haut {
    margin-top: -3rem;
  }

  #dropdownAjout::after {
    display: none !important;
  }

  .bi-x-circle-fill {
    cursor: pointer;
    font-size: 1.2rem;
  }

  .nav-tabs {
    border-bottom: 0.1rem solid #095797;
  }

    .nav-tabs .nav-link.active {
      background-color: white;
      color: #656565;
      border: 0.1rem solid #095797;
      border-bottom-color: white; /* casse la ligne du bas */
      font-weight: 600;
      border-top-left-radius: 0.3rem;
      border-top-right-radius: 0.3rem;
    }

  .overflow-auto{
      max-height: 50vh;
  }

  .event-details-inline {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem; /* espace entre les éléments */
    padding-top: 0.5rem;
  }

    .event-details-inline span {
      white-space: nowrap;
    }

  .event-maladie {
    border-left: 0.375rem solid rgba(255, 165, 0, 0.8);
  }

  .event-vacances {
    border-left: 0.375rem solid rgba(144, 238, 144, 0.8);
  }

  .event-personnel {
    border-left: 0.375rem solid rgba(224, 176, 255, 0.8);
  }

  .event-paiement {
    border-left: 0.375rem solid rgba(173, 216, 230, 0.8);
  }

  .event-item.event-maladie,
  .event-item.event-vacances,
  .event-item.event-personnel,
  .event-item.event-paiement {
    background-color: rgba(240, 240, 240, 0.3);
  }

  /* partie lorsque l'espace écran est plus petite (ex. mobile)*/
  @media (max-width: 768px) {
    .declaration-container {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto;
      padding: 1rem;
    }

    .calendar-column {
      order: 2;
    }

    .events-column {
      order: 1;
    }

    .calendar-column,
    .events-column {
      margin-bottom: 1rem;
    }
  }
  .suiviDemandes-container {
    max-width: 45%;
    margin: 0 auto;
  }
</style>
