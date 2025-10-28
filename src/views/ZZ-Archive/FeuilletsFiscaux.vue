<template>
  <div class="services-container">
    <h2>Feuillets fiscaux</h2>

    <nav class="nav-links">
      <p @click="afficherFeuilletsFiscaux">2024</p>
      <p @click="afficherFeuilletsFiscaux">2023</p>
    </nav>

    <div class="releve-item"
         v-for="feuillet in feuillets"
         :key="feuillet.annee + feuillet.type"
         @click="ouvrirFeuillet(feuillet.annee, feuillet.type)">
      <span>{{ feuillet.annee }}</span> — {{ feuillet.description }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeuilletsFiscaux',
  data() {
    return {
      feuillets: [
        {
          annee: '2024',
          type: 'AE Plein',
          description: 'Combiné (R1 & T4) - AE Plein - Original',
        },
        {
          annee: '2024',
          type: 'AE Réduit',
          description: 'Combiné (R1 & T4) - AE Réduit - Original',
        },
        {
          annee: '2023',
          type: 'Feuillet fiscal',
          description: 'Feuillet fiscal (simulation)',
        },
      ],
    };
  },
  methods: {
    afficherFeuilletsFiscaux() {
      console.log("Affichage des feuillets fiscaux");
    },
    ouvrirFeuillet(annee, type) {
      console.log(`Ouverture du feuillet : ${annee} - ${type}`);
      // Tu peux ajouter ici une navigation ou une action
    },
  },
};
</script>

<style scoped>

  .services-container {
    padding: 2rem;
    color: rgba(100,100,100,100);
    border-radius: 8px;
    max-width: 66%;
    margin: auto;
  }

    .services-container h2 {
      font-weight: bold;
      margin-bottom: 1.5rem;
      text-align: Left;
    }

  .nav-links {
    display: flex;
    gap: 1rem;
    justify-content: left;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

    .nav-links a {
      color: #0073CF;
      text-decoration: underline;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border: 1px solid white;
      border-radius: 4px;
      transition: background-color 0.3s ease;
    }

      .nav-links a:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }

  .services-container h3 {
    margin-bottom: 1rem;
    font-weight: 600;
    text-align: center;
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
