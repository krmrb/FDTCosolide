<template>
  <div class="corps-approbation mt-4">
    <div class="container-fluid">
      <div class="row gx-3">

        <!-- Colonne 1 : listes -->
        <div class="col-md-5 d-flex flex-column gap-3">

          <!-- Liste 1 : Demandes en attente -->
          <div>
            <h5 class="border-bottom pb-2 mb-2"><strong>Demandes en attente d’approbation</strong></h5>
            <div class="liste-titres">
              <div>Matricule</div>
              <div>Nom</div>
              <div>Emploi</div>
              <div>Lieu</div>
              <div>Date créée</div>
              <div>État</div>
              <div class="x-accepte px-1">✓
              <span class="x-refuse px-2">✗
                </span> <span class="x-flag">⚑</span>
              </div>
            </div>

            <div class="scrollable-liste">
              <ul class="liste-demandes">
                <li v-for="item in demandes"
                    :key="item.id"
                    @click="selectionnerDemande(item)"
                    :class="['item-liste', { selected: item === evenementSelectionne }]">
                  <div class="text-start ps-1">{{ item.matricule }}</div>
                  <div class="text-start">{{ item.nomNaissance }}</div>
                  <div class="text-start">{{ item.emploiCorps }}</div>
                  <div class="text-start">{{ item.lieuLabel }}</div>
                  <div class="text-start">{{ item.dateDebut }}</div>
                  <div class="text-start">{{ item.etatValidation }}</div>
                  <div class="text-start ps-2 actions-ligne">
                    <input type="radio" :name="'decision-' + item.dateCreation" value="accepte" class="radio-accept" />
                    <input type="radio" :name="'decision-' + item.dateCreation" value="refuse" class="radio-refuse" />
                    <span :class="(item.attente_info || (item.noteApprobation && item.noteApprobation.trim() !== '')) ? 'etat-flag flag-red' : 'etat-flag flag-gray'">
                      ⚑
                    </span>
                    <div class="r-cell"></div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- Liste 2 : Demandes approuvées -->
          <div>
            <h5 class="border-bottom pb-2 mb-2"><strong>Demandes approuvées</strong></h5>

            <div class="liste-titres">
              <div>Matricule</div>
              <div>Nom</div>
              <div>Emploi</div>
              <div>Lieu</div>
              <div>Date créée</div>
              <div>État</div>
              <div class="x-accepte px-1">✓ <span class="x-refuse px-2">✗</span> <span class="x-flag">⚑</span></div>
            </div>

            <div class="scrollable-liste">
              <ul class="liste-approuves">
                <li v-for="item in approuves"
                    :key="item.id"
                    @click="selectionnerDemande(item)"
                    :class="['item-liste', { selected: item === evenementSelectionne }]">
                  <div>{{ item.matricule }}</div>
                  <div>{{ item.nomNaissance }}</div>
                  <div>{{ item.emploiCorps }}</div>
                  <div>{{ item.lieuLabel }}</div>
                  <div>{{ item.dateDebut }}</div>
                  <div>{{ item.etatValidation }}</div>
                  <div class="actions-ligne">

                    <input type="radio"
                           :name="'decision-' + item.id"
                           value="accepte"
                           v-model="item.decision"
                           class="radio-accept"
                          />
                    <input type="radio"
                           :name="'decision-' + item.id"
                           value="refuse"
                           v-model="item.decision"
                           class="radio-refuse" />

                    <span :class="(item.attente_info || (item.noteApprobation && item.noteApprobation.trim() !== '')) ? 'etat-flag flag-red' : 'etat-flag flag-gray'">
                      ⚑
                    </span>
                    <div class="r-cell"></div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

        </div>

        <!-- Colonne 2 : Formulaire -->
        <div class="col-md-6">
          <div class="p-4 rounded shadow-sm h-100">
            <SuiviDemandes :evenement="evenementSelectionne"
                           :modeModification="modeModification"
                           :emplois="emplois"
                           :lieuxTravail="lieuxTravail"
                           @nouvelleDemande="ajouterDemande"
                           @fermer="afficherSuiviDemandes = false" />
          </div>
        </div>

      </div>
    </div>
  </div>
  </template>
  <script setup lang="ts">
    import { ref, computed, watch, onMounted } from 'vue';
    import type { Demande } from '@/types/demande'
    import { ValidationStatut, Approbation } from '@/types/demande'
    import SuiviDemandes from '@/components//autorisation/SuiviDemandesApprobation.vue'

    const basePath = import.meta.env.VITE_BASE_PATH;

    //éléments API-simulé
    const demandes = ref<Demande[]>([])
    const approuves = ref<Demande[]>([])
    const evenementSelectionne = ref<Demande | null>(null)


    function ajouterDemande() {
      emit('nouvelleDemande', form.value)
    }

    defineProps<{
      evenement?: Demande
      modeModification?: boolean
      niveau1Actif?: boolean
      niveau2Actif?: boolean
    }>()


    onMounted(async () => {
      try {
        const response = await fetch(`${basePath}eventExemple.json`)
        const data: Demande[] = await response.json()

        // Séparer selon le statut de validation
        demandes.value = data.filter(d => d.etatValidation === ValidationStatut.EnCreation)
        approuves.value = data.filter(d =>
          d.validation === ValidationStatut.Soumis || d.etatValidation === ValidationStatut.Approuver
        )

        // Tri par date décroissante
        demandes.value.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
        approuves.value.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())


        // Initialiser le formulaire avec le premier objet
        if (demandes.value.length > 0) {
          form.value = { ...demandes.value[0] };
        }

      } catch (error) {
        console.error('Erreur lors du chargement des événements :', error)
      }
    })

    // Données du formulaire
    function initialiserDemande(): Demande {
      return {
        id: '',
        matricule: '',
        nomNaissance: '',
        prenom: '',
        emploi: '',
        emploiCorps: '',
        emploiLabel: '',
        lieu: '',
        lieuCode: '',
        lieuLabel: '',
        motif: '',
        motifCode: '',
        motifLabel: '',
        date: '',
        dateCreation: new Date().toISOString(),
        dateDebut: '',
        dateFin: '',
        typeEvenement: '',
        touteJournee: true,
        de: '',
        a: '',
        commentaire: '',
        etatValidation: ValidationStatut.EnCreation,
        niveau1validation: '',
        niveau2validation: '',
        noteApprobation: '',
        decision: null,
        attente_info: false
      }
    }

    const form = ref<Demande>(initialiserDemande());

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

    const dateCopier = ref(false);

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


    function handleCancel() {
      console.log("Annulation dans SuiviDemandes");
    }

    function selectionnerDemande(item: Demande) {
      form.value = { ...item };
      evenementSelectionne.value = item;
    }


  </script>
  <style scoped>
    .corps-approbation {
      padding-bottom: 7rem;
    }

    .container-fluid {
      background-color: white;
    }

    .shadow-sm {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }

    .h-100 {
      height: 100%;
    }


    .scrollable-liste {
      max-height: 18.75rem;
      overflow-y: auto;
      padding: 0.5rem;
      /*border-radius: 0.375rem;*/
      border: 0.0625rem solid #ddd;
      /*background-color: #f9f9f9;*/
      direction: rtl; /* Scrollbar à gauche */
    }

      .scrollable-liste > * {
        direction: ltr; /* Contenu lisible normalement */
      }


    .liste-demandes,
    .liste-approuves {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .liste-titres {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      align-items: center;
      font-size: 0.85rem;
      font-weight: bold;
      border-bottom: 2px solid #0d6efd;
      padding-bottom: 0.4rem;
      padding-left: 1.3rem;
      margin-bottom: 0.4rem;
    }

    .item-liste {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 0.5rem;
      align-items: center;
      background-color: transparent;
      border: none;
      border-bottom: 1px solid #0d6efd;
      border-radius: 0;
      padding: 0.3rem 0;
      font-size: 0.75rem;
    }

      .liste-titres > div,
      .item-liste > div {
        justify-self: start;
      }

      .item-liste > div {
        margin-bottom: 0.25rem;
      }

    .liste2-centree {
      margin-top: 10vh;
      transform: translateY(-50%);
    }

    .approbation-niv1 {
      padding-top: 50vh;
    }

    .r-cell {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      align-items: center;
    }

    .x-refuse {
      color: red;
    }

    .x-accepte {
      color: green;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
    }

    .x-flag {
      color: gray;
    }

    .radio-accept,
    .radio-refuse {
      position: relative;
      z-index: 2;
      cursor: pointer;
      accent-color: #198754; /* vert pour accept */
      flex-shrink: 0;
    }

    .radio-refuse {
      accent-color: #dc3545; /* rouge pour refus */
    }

    .etat-flag {
      font-size: 0.75rem;
      vertical-align: middle;
    }

    .flag-red {
      color: #dc3545;
    }

    .flag-gray {
      color: #6c757d;
    }

    .actions-ligne {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: nowrap; /* ⬅ empêche le retour à la ligne */
      overflow: hidden;
    }

      .actions-ligne input,
      .actions-ligne span {
        vertical-align: middle;
      }

    .detail-selection {
      background-color: white;
    }

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

    @media (max-width: 768px) {
      .liste-titres,
      .item-liste {
        grid-template-columns: repeat(2, 1fr);
        font-size: 0.75rem;
      }

      .checkbox-cell {
        justify-content: start;
      }
    }

    .selected {
      background-color: #e6f0ff;
      border-left: 0.25rem solid #0073CF;
    }

  </style>
