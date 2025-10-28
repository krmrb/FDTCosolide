import { post } from '../api/fetchclient'

// Adapte selon ta Swagger
const LOGIN_PATH = 'https://identityprovidertestnonregressiontemplatedata.devgrics.ca/connect/token' // ex: '/api/Auth/login' si besoin
const TOKEN_FIELDS = ['token', 'access_token', 'jwt', 'id_token'] // champs possibles

export async function login({ username, password }) {
  const data = await post(LOGIN_PATH, { username, password }, { auth: false })
  const token = TOKEN_FIELDS.map(f => data?.[f]).find(Boolean)
  if (!token) throw new Error('Jeton introuvable dans la réponse du serveur.')
  localStorage.setItem('token', token)
  return token
}

export function logout() {
  localStorage.removeItem('token')
}

export function isAuthenticated() {
  return !!localStorage.getItem('token')
}

export function getToken() {
  return localStorage.getItem('token')
}
