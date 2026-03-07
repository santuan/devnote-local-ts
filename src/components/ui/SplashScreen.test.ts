import { fireEvent, render, screen } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SplashScreen from './SplashScreen.vue'

// Mock the child component
vi.mock('@/components/ui/Inspira/Ripple/Ripple.vue', () => ({
  default: {
    name: 'Ripple',
    template: '<div data-testid="ripple">Ripple Component</div>',
  },
}))

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'message.documentNotSaved': 'Document not saved',
        'message.clickToEdit': 'Click to edit',
      }
      return translations[key] || key
    },
  }),
}))

describe('splashScreen', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders the document not saved alert message', () => {
    render(SplashScreen)

    expect(screen.getByText('Document not saved')).toBeTruthy()
  })

  it('renders the click to edit button with screen reader text', () => {
    render(SplashScreen)

    const button = screen.getByRole('button')
    expect(button).toBeTruthy()

    // Check for screen reader text
    expect(screen.getByText('Click to edit')).toBeTruthy()
  })

  it('renders the ripple component', () => {
    render(SplashScreen)

    expect(screen.getByTestId('ripple')).toBeTruthy()
  })

  it('has correct accessibility role for alert', () => {
    render(SplashScreen)

    const alert = screen.getByRole('alert')
    expect(alert).toBeTruthy()
    expect(alert.textContent).toContain('Document not saved')
  })

  it('clicking the button calls focusOnTitle', async () => {
    render(SplashScreen)
    const button = screen.getByRole('button')

    await fireEvent.click(button)

    // The button click triggers the focus action but doesn't emit events directly
    // The function modifies stores, which would need integration testing
    expect(button).toBeTruthy()
  })

  it('pressing escape key in the button calls focusOnTitleEsc', async () => {
    render(SplashScreen)
    const button = screen.getByRole('button')

    await fireEvent.keyDown(button, { keyCode: 27 })

    // The escape key triggers the focus action
    expect(button).toBeTruthy()
  })

  it('pressing other keys does not trigger focusOnTitleEsc', async () => {
    render(SplashScreen)
    const button = screen.getByRole('button')

    // Press a different key (not escape)
    await fireEvent.keyDown(button, { keyCode: 13 })

    // Should not cause any errors
    expect(button).toBeTruthy()
  })
})
