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
      console.log('🚀 Démarrage de l\'enregistrement...')
      
      // Vérifier si l'API est supportée
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('L\'enregistrement audio n\'est pas supporté sur ce navigateur')
      }

      // Vérifier si on est en HTTPS (requis pour getUserMedia)
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        throw new Error('L\'enregistrement audio nécessite une connexion HTTPS')
      }

      console.log('📡 Demande d\'accès au microphone...')
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      })
      
      console.log('✅ Accès au microphone accordé')
      streamRef.current = stream
      
      // Déterminer le meilleur format audio supporté
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/wav'
      ]
      
      let selectedMimeType = null
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType
          break
        }
      }
      
      if (!selectedMimeType) {
        throw new Error('Aucun format audio supporté trouvé')
      }
      
      console.log('🎵 Format audio sélectionné:', selectedMimeType)
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: selectedMimeType
      })
      
      audioChunksRef.current = []
      setRecordingStartTime(Date.now())

      mediaRecorderRef.current.ondataavailable = (event) => {
        console.log('📦 Données audio reçues:', event.data.size, 'bytes')
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        console.log('⏹️ Enregistrement arrêté, traitement des données...')
        if (audioChunksRef.current.length > 0) {
          const totalSize = audioChunksRef.current.reduce((sum, chunk) => sum + chunk.size, 0)
          console.log('📊 Taille totale des données:', totalSize, 'bytes')
          
          const blob = new Blob(audioChunksRef.current, { 
            type: mediaRecorderRef.current.mimeType 
          })
          console.log('🎵 Blob audio créé:', blob.size, 'bytes, type:', blob.type)
          
          setAudioBlob(blob)
          const url = URL.createObjectURL(blob)
          setAudioUrl(url)
          console.log('🔗 URL audio créée:', url)
        } else {
          console.warn('⚠️ Aucune donnée audio reçue')
        }
        
        // Arrêter tous les tracks du stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => {
            console.log('🛑 Arrêt du track:', track.kind)
            track.stop()
          })
          streamRef.current = null
        }
      }

      mediaRecorderRef.current.onerror = (event) => {
        console.error('❌ Erreur MediaRecorder:', event.error)
        setError('Erreur lors de l\'enregistrement audio: ' + event.error.message)
        setIsRecording(false)
      }

      mediaRecorderRef.current.onstart = () => {
        console.log('🎙️ Enregistrement démarré avec succès')
      }

      console.log('▶️ Démarrage de l\'enregistrement...')
      mediaRecorderRef.current.start(1000) // Collecter les données toutes les secondes
      setIsRecording(true)
      console.log('✅ Enregistrement en cours')
    } catch (error) {
      console.error('❌ Erreur lors du démarrage de l\'enregistrement:', error)
      
      let errorMessage = 'Impossible d\'accéder au microphone'
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Accès au microphone refusé. Veuillez autoriser l\'accès dans les paramètres de votre navigateur.'
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'Aucun microphone trouvé. Veuillez connecter un microphone.'
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'L\'enregistrement audio n\'est pas supporté sur ce navigateur.'
      } else if (error.message.includes('HTTPS')) {
        errorMessage = 'L\'enregistrement audio nécessite une connexion HTTPS sécurisée.'
      } else {
        errorMessage = `Erreur: ${error.message}`
      }
      
      setError(errorMessage)
      setIsRecording(false)
    }
  }, [])

  const stopRecording = useCallback(() => {
    console.log('🛑 Demande d\'arrêt de l\'enregistrement...')
    if (mediaRecorderRef.current && isRecording) {
      try {
        console.log('⏹️ Arrêt de l\'enregistrement...')
        mediaRecorderRef.current.stop()
        setIsRecording(false)
        console.log('✅ Enregistrement arrêté')
      } catch (error) {
        console.error('❌ Erreur lors de l\'arrêt de l\'enregistrement:', error)
        setError('Erreur lors de l\'arrêt de l\'enregistrement: ' + error.message)
        setIsRecording(false)
      }
    } else {
      console.warn('⚠️ Tentative d\'arrêt sans enregistrement en cours')
    }
  }, [isRecording])

  const transcribeAudio = useCallback(async () => {
    if (!audioBlob) {
      console.warn('⚠️ Aucun audio à transcrire')
      return
    }

    console.log('🎤 Début de la transcription...')
    setIsTranscribing(true)
    setError(null)
    
    try {
      // Simulation de transcription (dans une vraie app, vous utiliseriez une API comme OpenAI Whisper)
      console.log('⏳ Simulation de transcription en cours...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockTranscription = "Ceci est une transcription simulée de votre enregistrement vocal. Dans une version complète, cette fonctionnalité utiliserait l'API Whisper d'OpenAI pour transcrire automatiquement votre audio en texte."
      setTranscription(mockTranscription)
      console.log('✅ Transcription simulée terminée')
    } catch (error) {
      console.error('❌ Erreur lors de la transcription:', error)
      setError('Erreur lors de la transcription audio: ' + error.message)
    } finally {
      setIsTranscribing(false)
    }
  }, [audioBlob])

  const clearRecording = useCallback(() => {
    console.log('🗑️ Nettoyage de l\'enregistrement...')
    setAudioBlob(null)
    setAudioUrl(null)
    setTranscription('')
    setError(null)
    audioChunksRef.current = []
    setRecordingStartTime(null)
    
    // Nettoyer l'URL créée
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      console.log('🔗 URL audio nettoyée')
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
