import { beforeEach, describe, expect, it, vi } from 'vitest'

const postMock = vi.fn()
const createMock = vi.fn(() => ({ post: postMock }))
const isAxiosErrorMock = vi.fn()

vi.mock('axios', () => ({
  default: {
    create: createMock,
    isAxiosError: isAxiosErrorMock,
  },
}))

describe('contact-api', () => {
  beforeEach(() => {
    vi.resetModules()
    postMock.mockReset()
    createMock.mockClear()
    isAxiosErrorMock.mockReset()
    vi.unstubAllEnvs()
  })

  it('returns response data on success', async () => {
    postMock.mockResolvedValue({ data: { ok: true } })
    isAxiosErrorMock.mockReturnValue(false)

    const { submitContactForm } = await import('@/lib/contact-api')
    const data = await submitContactForm({
      name: 'Gabriel',
      email: 'gabriel@example.com',
      message: 'Mensagem com tamanho minimo suficiente.',
    })

    expect(data).toEqual({ ok: true })
    expect(postMock).toHaveBeenCalledWith('/contact', expect.any(Object))
  })

  it('retries on first network failure and succeeds', async () => {
    vi.spyOn(window, 'setTimeout').mockImplementation(((handler: TimerHandler) => {
      if (typeof handler === 'function') handler()
      return 0
    }) as any)
    postMock
      .mockRejectedValueOnce({ isAxiosError: true })
      .mockResolvedValueOnce({ data: { ok: true } })
    isAxiosErrorMock.mockReturnValue(true)

    const { submitContactForm } = await import('@/lib/contact-api')
    await expect(submitContactForm({
      name: 'Gabriel',
      email: 'gabriel@example.com',
      message: 'Mensagem com tamanho minimo suficiente.',
    })).resolves.toEqual({ ok: true })
  })

  it('throws network error when no response after retry', async () => {
    vi.spyOn(window, 'setTimeout').mockImplementation(((handler: TimerHandler) => {
      if (typeof handler === 'function') handler()
      return 0
    }) as any)
    postMock.mockRejectedValue({ isAxiosError: true })
    isAxiosErrorMock.mockReturnValue(true)

    const { ContactRequestError, submitContactForm } = await import('@/lib/contact-api')
    await expect(submitContactForm({
      name: 'Gabriel',
      email: 'gabriel@example.com',
      message: 'Mensagem com tamanho minimo suficiente.',
    })).rejects.toMatchObject({
      name: 'ContactRequestError',
      message: 'contact.form.error_network',
      kind: 'network',
    })
  })

  it('throws validation error for 400/422 responses', async () => {
    postMock.mockRejectedValue({ response: { status: 422, data: { message: ['invalid message'] } } })
    isAxiosErrorMock.mockReturnValue(true)

    const { submitContactForm } = await import('@/lib/contact-api')
    await expect(
      submitContactForm({
        name: 'Gabriel',
        email: 'gabriel@example.com',
        message: 'Mensagem com tamanho minimo suficiente.',
      }),
    ).rejects.toMatchObject({ message: 'invalid message', kind: 'validation' })
  })

  it('handles string backend messages', async () => {
    postMock.mockRejectedValue({ response: { status: 500, data: { message: 'server down' } } })
    isAxiosErrorMock.mockReturnValue(true)

    const { submitContactForm } = await import('@/lib/contact-api')
    await expect(
      submitContactForm({
        name: 'Gabriel',
        email: 'gabriel@example.com',
        message: 'Mensagem com tamanho minimo suficiente.',
      }),
    ).rejects.toMatchObject({ message: 'server down', kind: 'server' })
  })

  it('uses fallback error key when backend payload has no message field', async () => {
    postMock.mockRejectedValue({ response: { status: 500, data: { foo: 'bar' } } })
    isAxiosErrorMock.mockReturnValue(true)

    const { submitContactForm } = await import('@/lib/contact-api')
    await expect(
      submitContactForm({
        name: 'Gabriel',
        email: 'gabriel@example.com',
        message: 'Mensagem com tamanho minimo suficiente.',
      }),
    ).rejects.toMatchObject({ message: 'contact.form.error_fallback', kind: 'server' })
  })

  it('throws server fallback for unknown non-axios errors', async () => {
    postMock.mockRejectedValue(new Error('unexpected'))
    isAxiosErrorMock.mockReturnValue(false)

    const { submitContactForm } = await import('@/lib/contact-api')
    await expect(
      submitContactForm({
        name: 'Gabriel',
        email: 'gabriel@example.com',
        message: 'Mensagem com tamanho minimo suficiente.',
      }),
    ).rejects.toMatchObject({ message: 'contact.form.error_fallback', kind: 'server' })
  })

  it('normalizes VITE_API_URL removing trailing slashes', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.com///')
    await import('@/lib/contact-api')
    expect(createMock).toHaveBeenCalledWith(expect.objectContaining({ baseURL: 'https://api.example.com' }))
  })

  it('uses the default API base URL when env is empty', async () => {
    vi.stubEnv('VITE_API_URL', '   ')
    await import('@/lib/contact-api')
    expect(createMock).toHaveBeenCalledWith(expect.objectContaining({ baseURL: '/v2' }))
  })

  it('constructs ContactRequestError with the default server kind', async () => {
    const { ContactRequestError } = await import('@/lib/contact-api')
    const error = new ContactRequestError('boom')

    expect(error).toMatchObject({
      name: 'ContactRequestError',
      message: 'boom',
      kind: 'server',
    })
  })
})
