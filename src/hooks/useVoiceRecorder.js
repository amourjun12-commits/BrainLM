import { useState, useRef, useCallback } from 'react'

export const useVoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [transcription, setTranscription] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [error, setError] = useState(null)
  const [recordingStartTime, setRecordingStartTime] = useState(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const streamRef = useRef(null)

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      
      // Vérifier si l'API est supportée
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('L\'enregistrement audio n\'est pas supporté sur ce navigateur')
      }

      // Vérifier si on est en HTTPS (requis pour getUserMedia)
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        throw new Error('L\'enregistrement audio nécessite une connexion HTTPS')
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      })
      
      streamRef.current = stream
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      })
      
      audioChunksRef.current = []
      setRecordingStartTime(Date.now())

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, { 
            type: mediaRecorderRef.current.mimeType || 'audio/webm' 
          })
          setAudioBlob(blob)
          const url = URL.createObjectURL(blob)
          setAudioUrl(url)
        }
        
        // Arrêter tous les tracks du stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
      }

      mediaRecorderRef.current.onerror = (event) => {
        console.error('Erreur MediaRecorder:', event.error)
        setError('Erreur lors de l\'enregistrement audio')
        setIsRecording(false)
      }

      mediaRecorderRef.current.start(1000) // Collecter les données toutes les secondes
      setIsRecording(true)
    } catch (error) {
      console.error('Erreur lors du démarrage de l\'enregistrement:', error)
      
      let errorMessage = 'Impossible d\'accéder au microphone'
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Accès au microphone refusé. Veuillez autoriser l\'accès dans les paramètres de votre navigateur.'
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'Aucun microphone trouvé. Veuillez connecter un microphone.'
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'L\'enregistrement audio n\'est pas supporté sur ce navigateur.'
      } else if (error.message.includes('HTTPS')) {
        errorMessage = 'L\'enregistrement audio nécessite une connexion HTTPS sécurisée.'
      }
      
      setError(errorMessage)
      setIsRecording(false)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop()
        setIsRecording(false)
      } catch (error) {
        console.error('Erreur lors de l\'arrêt de l\'enregistrement:', error)
        setError('Erreur lors de l\'arrêt de l\'enregistrement')
        setIsRecording(false)
      }
    }
  }, [isRecording])

  const transcribeAudio = useCallback(async () => {
    if (!audioBlob) return

    setIsTranscribing(true)
    setError(null)
    
    try {
      // Simulation de transcription (dans une vraie app, vous utiliseriez une API comme OpenAI Whisper)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockTranscription = "Ceci est une transcription simulée de votre enregistrement vocal. Dans une version complète, cette fonctionnalité utiliserait l'API Whisper d'OpenAI pour transcrire automatiquement votre audio en texte."
      setTranscription(mockTranscription)
    } catch (error) {
      console.error('Erreur lors de la transcription:', error)
      setError('Erreur lors de la transcription audio')
    } finally {
      setIsTranscribing(false)
    }
  }, [audioBlob])

  const clearRecording = useCallback(() => {
    setAudioBlob(null)
    setAudioUrl(null)
    setTranscription('')
    setError(null)
    audioChunksRef.current = []
    setRecordingStartTime(null)
    
    // Nettoyer l'URL créée
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const getRecordingDuration = useCallback(() => {
    if (!recordingStartTime || !isRecording) return 0
    return Math.floor((Date.now() - recordingStartTime) / 1000)
  }, [recordingStartTime, isRecording])

  return {
    isRecording,
    audioBlob,
    audioUrl,
    transcription,
    isTranscribing,
    error,
    startRecording,
    stopRecording,
    transcribeAudio,
    clearRecording,
    getRecordingDuration
  }
}
