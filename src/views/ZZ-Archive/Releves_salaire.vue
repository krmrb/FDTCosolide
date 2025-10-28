<template>
  <div class="services-container">
    <h2>Relevés de salaire</h2>

    <nav class="nav-links">
      <p @click="afficherRelevesRecents">Relevés récents</p>
      <p @click="afficherAnneeCourante">Année courante</p>
      <p @click="afficherAnneePrecedente">Année précédente</p>
      <p @click="afficherAutresAnnees">Autres années</p>
    </nav>

    <div class="releve-item"
         v-for="releve in releves"
         :key="releve.periode"
         @click="ouvrirReleve(releve.periode)">
      <span>{{ releve.dates }}</span> ({{ releve.periode }})
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RelevésDeSalaire',
    data() {
      return {
        releves: [
          {
            dates: '7 sept. 2025 au 20 sept. 2025',
            periode: 'Période de paie no 15',
          },
          {
            dates: '24 août 2025 au 6 sept. 2025',
            periode: 'Période de paie no 14',
          },
          {
            dates: '10 août 2025 au 23 août 2025',
            periode: 'Période de paie no 13',
          },
        ],
      };
    },
    methods: {
      afficherRelevesRecents() {
        console.log('Relevés récents');
      },
      afficherAnneeCourante() {
        console.log('Année courante');
      },
      afficherAnneePrecedente() {
        console.log('Année précédente');
      },
      afficherAutresAnnees() {
        console.log('Autres années');
      },
      ouvrirReleve(periode) {
        console.log(`Ouverture du relevé : ${periode}`);
      },
    },
  };
</script>

<style scoped>
  .services-container {
    padding: 2rem;
    /*background: linear-gradient(to bottom right, #0073CF, #00AEEF);*/
    color: rgba(100,100,100,100);
    border-radius: 8px;
    max-width: 66%;
    margin: auto;
  }

    .services-container h2 {
      font-weight: bold;
      margin-bottom: 1.5rem;
      text-align: left;
    }

  .nav-links {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: left;
    margin-bottom: 2rem;
  }

    .nav-links a {
      color: #0073CF;
      text-decoration: underline;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s ease;
    }

      .nav-links a:hover {
        color: orange;
      }

  .releve-item {
    background: linear-gradient(45deg,rgba(225,225,225,0.3), rgba(225,225,225,0.1) );
    color: rgba(100,100,100,100);
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 5px 5px 5px rgba(0,0,0,0.6);
  }

    .releve-item:hover {
      background-color: #e6f0ff;
      transform: scale(1.01);
    }

    .releve-item span {
      font-weight: 500;
    }

</style>
