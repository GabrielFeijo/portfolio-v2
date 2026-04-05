import axios from 'axios'
import type { ContactFormValues } from '@/schemas/contact-form-schema'

const DEFAULT_API_URL = 'http://localhost:3333/v2'

function getApiBaseUrl() {
  const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim()

  if (!configuredBaseUrl) {
    return DEFAULT_API_URL
  }

  return configuredBaseUrl.replace(/\/+$/, '')
}

export class ContactRequestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContactRequestError'
  }
}

const contactApi = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function submitContactForm(payload: ContactFormValues) {
  try {
    const response = await contactApi.post('/contact', payload)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseBody = error.response?.data
      const message =
        typeof responseBody === 'object' &&
          responseBody !== null &&
          'message' in responseBody
          ? Array.isArray(responseBody.message)
            ? responseBody.message[0]
            : String(responseBody.message)
          : 'Nao foi possível enviar sua mensagem agora.'

      throw new ContactRequestError(message)
    }

    throw new ContactRequestError('Nao foi possível enviar sua mensagem agora.')
  }
}
