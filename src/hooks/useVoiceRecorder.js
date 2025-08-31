import { useState, useRef, useCallback } from 'react'

export const useVoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [transcription, setTranscription] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        
        // Arrêter tous les tracks du stream
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Erreur lors du démarrage de l\'enregistrement:', error)
      alert('Impossible d\'accéder au microphone. Veuillez autoriser l\'accès.')
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  const transcribeAudio = useCallback(async () => {
    if (!audioBlob) return

    setIsTranscribing(true)
    try {
      // Simulation de transcription (dans une vraie app, vous utiliseriez une API comme OpenAI Whisper)
      // Pour l'instant, nous simulons une transcription
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockTranscription = "Ceci est une transcription simulée de votre enregistrement vocal. Dans une version complète, cette fonctionnalité utiliserait l'API Whisper d'OpenAI pour transcrire automatiquement votre audio."
      setTranscription(mockTranscription)
    } catch (error) {
      console.error('Erreur lors de la transcription:', error)
      setTranscription('Erreur lors de la transcription')
    } finally {
      setIsTranscribing(false)
    }
  }, [audioBlob])

  const clearRecording = useCallback(() => {
    setAudioBlob(null)
    setAudioUrl(null)
    setTranscription('')
    audioChunksRef.current = []
  }, [])

  const getRecordingDuration = useCallback(() => {
    if (!mediaRecorderRef.current) return 0
    return Math.floor((Date.now() - mediaRecorderRef.current.startTime) / 1000)
  }, [])

  return {
    isRecording,
    audioBlob,
    audioUrl,
    transcription,
    isTranscribing,
    startRecording,
    stopRecording,
    transcribeAudio,
    clearRecording,
    getRecordingDuration
  }
}
