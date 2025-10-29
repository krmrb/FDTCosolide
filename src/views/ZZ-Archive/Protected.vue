<template>
  <div class="protected">
    <h2>Zone protégée</h2>
    <p>Si vous voyez cette page, c’est que l’authentification fonctionne ✅</p>
    <router-link to="/login">Retour Dashboard</router-link>
  </div>
</template>

<script setup>
</script>

<style scoped>
  .protected {
    max-width: 700px;
    margin: 32px auto;
  }
</style>
