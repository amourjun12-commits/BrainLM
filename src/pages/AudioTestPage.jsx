import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mic, AlertCircle, CheckCircle } from 'lucide-react'
import AudioTest from '../components/AudioTest'
import AudioDiagnostic from '../components/AudioDiagnostic'

const AudioTestPage = () => {
  const isHttps = window.location.protocol === 'https:'
  const isLocalhost = window.location.hostname === 'localhost'
  const isSupported = navigator.mediaDevices && navigator.mediaDevices.getUserMedia

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-4 py-5 text-white">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-xl transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-bold">Test Audio</h1>
          <div className="w-8"></div>
        </div>
        <p className="text-primary-100 text-xs mt-2 text-center">
          Testez l'enregistrement vocal de BrainLM
        </p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Statut de compatibilité */}
        <div className="bg-white rounded-xl p-4 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Mic className="w-5 h-5 mr-2 text-primary-600" />
            Statut de compatibilité
          </h2>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Support navigateur</span>
              <div className="flex items-center space-x-2">
                {isSupported ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-xs font-medium ${isSupported ? 'text-green-600' : 'text-red-600'}`}>
                  {isSupported ? 'Supporté' : 'Non supporté'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Connexion sécurisée</span>
              <div className="flex items-center space-x-2">
                {(isHttps || isLocalhost) ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-xs font-medium ${(isHttps || isLocalhost) ? 'text-green-600' : 'text-red-600'}`}>
                  {isHttps ? 'HTTPS' : isLocalhost ? 'Localhost' : 'HTTP (non sécurisé)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Instructions</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Cliquez sur le bouton microphone pour commencer l'enregistrement</li>
            <li>• Cliquez sur le bouton carré pour arrêter l'enregistrement</li>
            <li>• Utilisez le bouton "Écouter" pour vérifier votre enregistrement</li>
            <li>• Cliquez sur "Transcrire" pour obtenir le texte (simulation)</li>
          </ul>
        </div>

        {/* Diagnostic audio */}
        <AudioDiagnostic />

        {/* Test d'enregistrement */}
        <AudioTest />

        {/* Informations techniques */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Informations techniques</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• Format audio : WebM ou MP4</p>
            <p>• Qualité : 44.1kHz, suppression de bruit activée</p>
            <p>• Transcription : Simulation (API Whisper dans la version complète)</p>
            <p>• Compatibilité : Chrome, Firefox, Safari, Edge</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AudioTestPage
