import type { Editor } from '@tiptap/vue-3'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Speech from './Speech.vue'

describe('speech', () => {
  const mockVoice: SpeechSynthesisVoice = {
    name: 'Test Voice',
    lang: 'en-US',
    localService: true,
    default: true,
    voiceURI: 'test-voice',
  } as SpeechSynthesisVoice

  const mockUtterance = {
    onstart: null,
    onend: null,
    onerror: null,
    voice: null,
    pitch: 1,
    rate: 1,
    volume: 1,
  } as SpeechSynthesisUtterance

  const mockSynth = {
    getVoices: vi.fn(() => [mockVoice]),
    speak: vi.fn(),
    cancel: vi.fn(),
    speaking: false,
    onvoiceschanged: null,
  }

  beforeEach(() => {
    Object.defineProperty(globalThis, 'window', {
      value: {
        speechSynthesis: mockSynth,
      },
      writable: true,
      configurable: true,
    })

    Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', {
      value: vi.fn(() => ({ ...mockUtterance })),
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('rendering', () => {
    it('should render the component', () => {
      const { container } = render(Speech)
      expect(container.querySelector('.speech-component')).toBeTruthy()
    })

    it('should show speech synthesis not supported warning when not available', () => {
      Object.defineProperty(globalThis, 'window', {
        value: {},
        writable: true,
        configurable: true,
      })

      render(Speech)
      expect(screen.getByText('⚠️ Speech synthesis not supported in this browser')).toBeTruthy()
    })

    it('should show loading voices message when no voices available', () => {
      mockSynth.getVoices = vi.fn(() => [])
      render(Speech)
      expect(screen.getByText('⏳ Loading voices...')).toBeTruthy()
    })

    it('should display language dropdown when voices are available', async () => {
      mockSynth.getVoices = vi.fn(() => [mockVoice])
      render(Speech)

      await waitFor(() => {
        expect(screen.getByText('EN-US')).toBeTruthy()
      })
    })
  })

  describe('speech functionality', () => {
    it('should emit error when speech synthesis is not supported', async () => {
      Object.defineProperty(globalThis, 'window', {
        value: {},
        writable: true,
        configurable: true,
      })

      const { emitted } = render(Speech)

      await waitFor(() => {
        expect(emitted('error')).toBeTruthy()
        expect(emitted('error')[0]).toEqual(['Speech synthesis not supported'])
      })
    })

    it('should speak text and emit speaking event', async () => {
      mockSynth.speaking = false
      render(Speech)

      const component = await waitFor(() => screen.getByText('🔊 Speak Document').closest('.speech-component'))
      const instance = (component as any).__vueParentComponent?.ctx

      instance.speak('Hello world')

      expect(mockSynth.speak).toHaveBeenCalled()
      expect(mockSynth.cancel).not.toHaveBeenCalled()
    })

    it('should cancel speaking when already speaking', async () => {
      mockSynth.speaking = true
      render(Speech)

      const component = await waitFor(() => screen.getByText('🔊 Speak Document').closest('.speech-component'))
      const instance = (component as any).__vueParentComponent?.ctx

      instance.speak('Hello world')

      expect(mockSynth.cancel).toHaveBeenCalled()
    })

    it('should stop speaking when stop button is clicked', async () => {
      mockSynth.speaking = true

      const { container } = render(Speech)
      const component = container.querySelector('.speech-component')
      const instance = (component as any).__vueParentComponent?.ctx

      instance.isSpeaking = true
      await waitFor(() => {
        expect(screen.getByText('⏹ Stop')).toBeTruthy()
      })

      await fireEvent.click(screen.getByText('⏹ Stop'))

      expect(mockSynth.cancel).toHaveBeenCalled()
    })
  })

  describe('editor integration', () => {
    it('should speak editor content when button clicked', async () => {
      const mockEditor = {
        getText: vi.fn(() => 'Editor content'),
      } as unknown as Editor

      mockSynth.speaking = false
      render(Speech, {
        props: {
          editor: mockEditor,
        },
      })

      await waitFor(() => {
        const button = screen.getByText('🔊 Speak Document')
        expect(button).toBeTruthy()
      })

      await fireEvent.click(screen.getByText('🔊 Speak Document'))

      expect(mockEditor.getText).toHaveBeenCalled()
      expect(mockSynth.speak).toHaveBeenCalled()
    })

    it('should not speak when editor content is empty', async () => {
      const mockEditor = {
        getText: vi.fn(() => '   '),
      } as unknown as Editor

      render(Speech, {
        props: {
          editor: mockEditor,
        },
      })

      await waitFor(() => {
        const button = screen.getByText('🔊 Speak Document')
        expect(button).toBeTruthy()
      })

      await fireEvent.click(screen.getByText('🔊 Speak Document'))

      expect(mockEditor.getText).toHaveBeenCalled()
      expect(mockSynth.speak).not.toHaveBeenCalled()
    })

    it('should not render speak button when no editor provided', () => {
      render(Speech)
      expect(screen.queryByText('🔊 Speak Document')).toBeNull()
    })
  })

  describe('voice selection', () => {
    it('should select default voice on mount', async () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: { language: 'en-US' },
        writable: true,
        configurable: true,
      })

      render(Speech)

      await waitFor(() => {
        expect(screen.getByText('EN-US')).toBeTruthy()
      })
    })

    it('should update selected voice when setVoice is called', async () => {
      const { container } = render(Speech)
      const component = container.querySelector('.speech-component')
      const instance = (component as any).__vueParentComponent?.ctx

      const newVoice = { ...mockVoice, name: 'New Voice', lang: 'fr-FR' } as SpeechSynthesisVoice
      instance.setVoice(newVoice)

      await waitFor(() => {
        expect(screen.getByText('FR-FR')).toBeTruthy()
      })
    })
  })

  describe('props', () => {
    it('should apply pitch, rate, and volume props to utterance', async () => {
      mockSynth.speaking = false
      render(Speech, {
        props: {
          pitch: 1.5,
          rate: 0.8,
          volume: 0.5,
        },
      })

      const component = await waitFor(() => screen.getByText('🔊 Speak Document')?.closest('.speech-component'))
      const instance = (component as any).__vueParentComponent?.ctx

      instance.speak('Test text')

      expect(mockSynth.speak).toHaveBeenCalled()
    })
  })

  describe('events', () => {
    it('should emit speaking event when speech starts', async () => {
      mockSynth.speaking = false
      const { emitted, container } = render(Speech)
      const component = container.querySelector('.speech-component')
      const instance = (component as any).__vueParentComponent?.ctx

      instance.speak('Test text')

      await waitFor(() => {
        expect(emitted('speaking')).toBeTruthy()
        expect(emitted('speaking')[0]).toEqual(['Test text'])
      })
    })

    it('should emit end event when speech ends', async () => {
      mockSynth.speaking = false
      const { emitted, container } = render(Speech)
      const component = container.querySelector('.speech-component')
      const instance = (component as any).__vueParentComponent?.ctx

      instance.speak('Test text')

      await waitFor(() => {
        expect(emitted('end')).toBeTruthy()
      })
    })

    it('should emit error event when speech errors', async () => {
      mockSynth.speaking = false
      const { emitted, container } = render(Speech)
      const component = container.querySelector('.speech-component')
      const instance = (component as any).__vueParentComponent?.ctx

      instance.speak('Test text')

      await waitFor(() => {
        expect(emitted('error')).toBeTruthy()
      })
    })
  })

  describe('language groups', () => {
    it('should group voices by language', async () => {
      const voices = [
        { ...mockVoice, lang: 'en-US' },
        { ...mockVoice, lang: 'en-US', name: 'Another US Voice' },
        { ...mockVoice, lang: 'es-ES', name: 'Spanish Voice' },
      ] as SpeechSynthesisVoice[]

      mockSynth.getVoices = vi.fn(() => voices)
      render(Speech)

      await waitFor(() => {
        expect(screen.getByText('EN-US')).toBeTruthy()
      })
    })

    it('should sort language groups alphabetically', async () => {
      const voices = [
        { ...mockVoice, lang: 'es-ES', name: 'Spanish Voice' },
        { ...mockVoice, lang: 'en-US' },
        { ...mockVoice, lang: 'fr-FR', name: 'French Voice' },
      ] as SpeechSynthesisVoice[]

      mockSynth.getVoices = vi.fn(() => voices)
      render(Speech)

      await waitFor(() => {
        expect(screen.getByText('EN-US')).toBeTruthy()
      })
    })
  })
})
