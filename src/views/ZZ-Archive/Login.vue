<template>
  <div class="corps-login">
  <div class="login-background">
    <div class="login-page">
      <h1>Admin 360</h1>

      <form @submit.prevent="onSubmit" class="login-form">
        <label>
          Identifiant
          <input v-model.trim="username" type="text" placeholder="ex: testuser" required />
        </label>

        <label>
          Mot de passe
          <input v-model="password" type="password" placeholder="••••••" required />
        </label>

        <button type="submit" :disabled="loading">
          <span v-if="!loading">Se connecter</span>
          <span v-else>Connexion…</span>
        </button>

        <p v-if="error" class="error">{{ error }}</p>
      </form>

      <router-link to="/login">PAIE et GRH </router-link>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { login } from '@/services/authentification'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await login({ username: username.value, password: password.value })
    const redirect = route.query.redirect || '/login'
    router.push(redirect)
  } catch (e) {
    error.value = e?.message || 'Échec de connexion'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
  .corps-login {
    padding-bottom: 2rem;
    padding-top: 3.9rem;
  }

  .login-background {
    background-image: url("../assets/login_background.webp");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 110rem;
    height: 43rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 1.5rem;
  }

  h1 {
    color: rgb(0, 115, 207);
  }

  .login-page {
    width: 75%; /* ou max-width: 380px si tu veux une limite */
    max-width: 380px;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 1rem;
    border: 2px solid lightgray;
    border-radius: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: grid;
    gap: 1rem;
  }

  .login-form {
    display: grid;
    gap: 12px;
  }

  label {
    display: grid;
    gap: 0.5rem;
    color: rgb(0, 115, 207);
  }

  input {
    padding: 10px;
    border: 1px solid #bbb;
    border-radius: 6px;
  }

  button {
    padding: 10px 14px;
    border: none;
    background: #1f7aec;
    color: #fff;
    border-radius: 6px;
    cursor: pointer;
  }

    button[disabled] {
      opacity: 0.7;
      cursor: not-allowed;
    }

  .error {
    color: #c0392b;
  }

  @media (max-width: 480px) {
    .login-page {
      width: 90%;
    }
  }
</style>
