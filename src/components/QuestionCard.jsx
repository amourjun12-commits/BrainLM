import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Mic, FileText } from 'lucide-react'
import VoiceRecorder from './VoiceRecorder'

const QuestionCard = ({ 
  question, 
  subQuestions = [], 
  value = '', 
  onChange, 
  placeholder = "Tapez votre réponse..." 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const [voiceTranscription, setVoiceTranscription] = useState('')

  const handleVoiceTranscription = (transcription) => {
    setVoiceTranscription(transcription)
    onChange(transcription)
  }

  const toggleVoiceRecorder = () => {
    setShowVoiceRecorder(!showVoiceRecorder)
  }

  return (
    <div className="card mb-6">
      {/* Question principale */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900 leading-relaxed">
          {question}
        </h3>
        <div className="flex items-center space-x-1">
          <button
            onClick={toggleVoiceRecorder}
            className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Enregistrer vocalement"
          >
            <Mic className="w-4 h-4" />
          </button>
          {subQuestions.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Sous-questions */}
      {subQuestions.length > 0 && isExpanded && (
        <div className="mb-4 pl-4 border-l-2 border-primary-200">
          <div className="space-y-3">
            {subQuestions.map((subQ, index) => (
              <div key={index} className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">• {subQ}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enregistreur vocal */}
      {showVoiceRecorder && (
        <div className="mb-4 p-4 bg-primary-50 rounded-xl">
          <VoiceRecorder
            onTranscriptionChange={handleVoiceTranscription}
            placeholder="Enregistrez votre réponse..."
          />
        </div>
      )}

      {/* Zone de texte */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-field min-h-[120px] resize-none"
          rows={4}
        />
        {voiceTranscription && (
          <div className="mt-2 flex items-center space-x-2 text-sm text-primary-600">
            <FileText className="w-4 h-4" />
            <span>Transcription vocale disponible</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionCard
