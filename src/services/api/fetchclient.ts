
const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

function buildUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${BASE}${p}`
}

function isJsonContent(headers) {
  const ct = headers['Content-Type'] || headers['content-type']
  return ct && ct.includes('application/json')
}

export async function apiFetch(path, {
  method = 'GET',
  headers = {},
  body,
  auth = true,
  timeout = 15000,
} = {}) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  const finalHeaders = {
    'Accept': 'application/json',
    ...headers,
  }

  // Si on envoie un objet et qu'on veut JSON
  if (body !== undefined && !(body instanceof FormData) && !isJsonContent(finalHeaders)) {
    finalHeaders['Content-Type'] = 'application/json'
  }

  // Injecte le token si demandé
  if (auth) {
    const token = localStorage.getItem('token')
    if (token) finalHeaders['Authorization'] = `Bearer ${token}`
  }

  // Sérialise le body si nécessaire
  let finalBody = body
  if (body && isJsonContent(finalHeaders) && !(body instanceof FormData) && typeof body !== 'string') {
    finalBody = JSON.stringify(body)
  }

  let res
  try {
    res = await fetch(buildUrl(path), {
      method,
      headers: finalHeaders,
      body: finalBody,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(id)
  }

  // Tente de lire JSON (sinon texte), même en cas d'erreur HTTP
  const contentType = res.headers.get('Content-Type') || ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => '')

  if (!res.ok) {
    const message =
      (payload && (payload.message || payload.error || payload.title)) ||
      `HTTP ${res.status} ${res.statusText}`
    const error = new Error(message)
    error.status = res.status
    error.data = payload
    throw error
  }

  return payload
}

// Helpers pratiques
export const get = (path, opts) => apiFetch(path, { ...opts, method: 'GET' })
export const post = (path, body, opts) => apiFetch(path, { ...opts, method: 'POST', body })
export const put = (path, body, opts) => apiFetch(path, { ...opts, method: 'PUT', body })
export const del = (path, opts) => apiFetch(path, { ...opts, method: 'DELETE' })
