import React from 'react'
import VoiceRecorder from './VoiceRecorder'

const AudioTest = () => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Test d'enregistrement audio
      </h3>
      <VoiceRecorder 
        onTranscriptionChange={(text) => console.log('Transcription:', text)}
        placeholder="Testez l'enregistrement vocal ici..."
      />
    </div>
  )
}

export default AudioTest
