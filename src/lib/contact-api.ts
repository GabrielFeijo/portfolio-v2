import type { ContactFormValues } from '@/schemas/contact-form-schema'
import axios from 'axios'

const DEFAULT_API_URL = '/v2'
const CONTACT_ERROR_KEYS = {
  fallback: 'contact.form.error_fallback',
  network: 'contact.form.error_network',
} as const

function getApiBaseUrl() {
  const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim()

  if (!configuredBaseUrl) {
    return DEFAULT_API_URL
  }

  return configuredBaseUrl.replace(/\/+$/, '')
}

export class ContactRequestError extends Error {
  readonly kind: 'network' | 'validation' | 'server'

  constructor(message: string, kind: 'network' | 'validation' | 'server' = 'server') {
    super(message)
    this.name = 'ContactRequestError'
    this.kind = kind
  }
}

const contactApi = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function getErrorMessage(responseBody: unknown) {
  if (typeof responseBody === 'object' && responseBody !== null && 'message' in responseBody) {
    const message = responseBody.message
    return Array.isArray(message) ? String(message[0]) : String(message)
  }

  return CONTACT_ERROR_KEYS.fallback
}

export async function submitContactForm(payload: ContactFormValues) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await contactApi.post('/contact', payload)
      return response.data
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        throw new ContactRequestError(CONTACT_ERROR_KEYS.fallback)
      }

      if (!error.response && attempt === 0) {
        await wait(350)
        continue
      }

      if (!error.response) {
        throw new ContactRequestError(CONTACT_ERROR_KEYS.network, 'network')
      }

      const kind =
        error.response.status === 400 || error.response.status === 422 ? 'validation' : 'server'
      throw new ContactRequestError(getErrorMessage(error.response.data), kind)
    }
  }
}
