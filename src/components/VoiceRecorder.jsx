import React, { useState, useEffect } from 'react'
import { Mic, Square, Play, Pause, Volume2, FileText, Trash2 } from 'lucide-react'
import { useVoiceRecorder } from '../hooks/useVoiceRecorder'

const VoiceRecorder = ({ onTranscriptionChange, placeholder = "Appuyez pour enregistrer..." }) => {
  const {
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
  } = useVoiceRecorder()

  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTranscription, setShowTranscription] = useState(false)
  const audioRef = React.useRef(null)

  useEffect(() => {
    let interval
    if (isRecording) {
      interval = setInterval(() => {
        setDuration(getRecordingDuration())
      }, 1000)
    } else {
      setDuration(0)
    }
    return () => clearInterval(interval)
  }, [isRecording, getRecordingDuration])

  useEffect(() => {
    if (transcription && onTranscriptionChange) {
      onTranscriptionChange(transcription)
    }
  }, [transcription, onTranscriptionChange])

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  const handleTranscribe = () => {
    if (audioBlob && !transcription) {
      transcribeAudio()
    } else {
      setShowTranscription(!showTranscription)
    }
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start space-x-2">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">!</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-red-800 mb-1">Erreur d'enregistrement</h4>
              <p className="text-sm text-red-700">{error}</p>
              {error.includes('HTTPS') && (
                <p className="text-xs text-red-600 mt-2">
                  💡 Conseil : Utilisez l'application en mode développement (localhost) ou déployez-la sur HTTPS.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bouton d'enregistrement */}
      <div className="flex items-center justify-center">
        <button
          onClick={handleRecordClick}
          disabled={!!error}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            isRecording
              ? 'bg-red-500 animate-pulse-slow shadow-lg'
              : error
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 shadow-md'
          }`}
        >
          {isRecording ? (
            <Square className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Indicateur de durée */}
      {isRecording && (
        <div className="text-center">
          <div className="text-sm text-gray-600">Enregistrement en cours...</div>
          <div className="text-lg font-semibold text-primary-600">
            {formatDuration(duration)}
          </div>
          <div className="voice-wave justify-center mt-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="voice-bar w-1 mx-1"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Contrôles audio */}
      {audioUrl && (
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handlePlayPause}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {isPlaying ? 'Pause' : 'Écouter'}
              </span>
            </button>

            <button
              onClick={handleTranscribe}
              disabled={isTranscribing}
              className="flex items-center space-x-2 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors disabled:opacity-50"
            >
              {isTranscribing ? (
                <div className="w-4 h-4 border-2 border-secondary-500 border-t-transparent rounded-full animate-spin" />
              ) : transcription ? (
                <FileText className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {isTranscribing ? 'Transcription...' : transcription ? 'Voir texte' : 'Transcrire'}
              </span>
            </button>

            <button
              onClick={clearRecording}
              className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm font-medium">Effacer</span>
            </button>
          </div>

          {/* Audio element caché */}
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={handleAudioEnded}
            className="hidden"
          />

          {/* Transcription */}
          {showTranscription && transcription && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Transcription :</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{transcription}</p>
            </div>
          )}
        </div>
      )}

      {/* Placeholder */}
      {!audioUrl && !isRecording && (
        <div className="text-center text-gray-500 text-sm">
          {placeholder}
        </div>
      )}
    </div>
  )
}

export default VoiceRecorder
