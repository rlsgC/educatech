// Cuentas de docentes. Esta versión no tiene servidor: las cuentas y la sesión viven en el
// navegador de cada persona. En el backend (Spring Boot) esto será el registro y el inicio de sesión reales.

const accountsKey = 'educatech:accounts'
const sessionKey = 'educatech:session'
export const DEMO_SESSION = 'demo'

const normalizeEmail = email => String(email || '').trim().toLowerCase()

function readAccounts() {
  try {
    const value = JSON.parse(window.localStorage.getItem(accountsKey))
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function writeAccounts(accounts) {
  window.localStorage.setItem(accountsKey, JSON.stringify(accounts))
}

// La contraseña nunca se guarda tal cual: se guarda su huella SHA-256 con una sal propia de la cuenta.
async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`)
  const digest = await window.crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('')
}

const newSalt = () => [...window.crypto.getRandomValues(new Uint8Array(16))].map(byte => byte.toString(16).padStart(2, '0')).join('')

export function readSession() {
  try {
    return window.sessionStorage.getItem(sessionKey) || window.localStorage.getItem(sessionKey)
  } catch {
    return null
  }
}

function writeSession(value, remember) {
  window.localStorage.removeItem(sessionKey)
  window.sessionStorage.removeItem(sessionKey)
  ;(remember ? window.localStorage : window.sessionStorage).setItem(sessionKey, value)
}

export function readSessionAccount() {
  const session = readSession()
  if (!session || session === DEMO_SESSION) return null
  return readAccounts().find(account => account.email === session) ?? null
}

export const hasSession = () => {
  const session = readSession()
  return session === DEMO_SESSION || Boolean(readSessionAccount())
}

export const emailExists = email => readAccounts().some(account => account.email === normalizeEmail(email))

export async function registerAccount({ firstName, lastName, email, password, institution }) {
  const cleanEmail = normalizeEmail(email)
  if (emailExists(cleanEmail)) return { ok: false, error: 'exists' }
  const salt = newSalt()
  const account = {
    email: cleanEmail,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    institution: institution?.trim() || '',
    salt,
    passwordHash: await hashPassword(password, salt),
    createdAt: new Date().toISOString(),
  }
  writeAccounts([...readAccounts(), account])
  writeSession(cleanEmail, true)
  return { ok: true, account }
}

export async function loginAccount(email, password, remember = true) {
  const account = readAccounts().find(item => item.email === normalizeEmail(email))
  if (!account) return { ok: false, error: 'not-found' }
  if (await hashPassword(password, account.salt) !== account.passwordHash) return { ok: false, error: 'wrong-password' }
  writeSession(account.email, remember)
  return { ok: true }
}

export function enterDemo() {
  writeSession(DEMO_SESSION, true)
}

export function logout() {
  window.localStorage.removeItem(sessionKey)
  window.sessionStorage.removeItem(sessionKey)
}

// Cambiar de cuenta recarga la página para que todo (nombre, cursos, certificados) se lea de la cuenta nueva.
export function reloadAt(path) {
  window.location.hash = path
  window.location.reload()
}
