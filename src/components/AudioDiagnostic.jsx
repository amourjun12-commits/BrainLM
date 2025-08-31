import React, { useState, useEffect } from 'react'
import { Mic, AlertCircle, CheckCircle, Info } from 'lucide-react'

const AudioDiagnostic = () => {
  const [diagnostics, setDiagnostics] = useState({
    mediaDevices: false,
    getUserMedia: false,
    mediaRecorder: false,
    https: false,
    localhost: false,
    permissions: 'unknown'
  })

  useEffect(() => {
    runDiagnostics()
  }, [])

  const runDiagnostics = async () => {
    const results = {
      mediaDevices: !!navigator.mediaDevices,
      getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      mediaRecorder: !!window.MediaRecorder,
      https: window.location.protocol === 'https:',
      localhost: window.location.hostname === 'localhost',
      permissions: 'unknown'
    }

    // Test des permissions
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      results.permissions = 'granted'
      stream.getTracks().forEach(track => track.stop())
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        results.permissions = 'denied'
      } else if (error.name === 'NotFoundError') {
        results.permissions = 'no-device'
      } else {
        results.permissions = 'error'
      }
    }

    setDiagnostics(results)
  }

  const getStatusIcon = (status) => {
    return status ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <AlertCircle className="w-4 h-4 text-red-500" />
    )
  }

  const getPermissionText = (permission) => {
    switch (permission) {
      case 'granted': return 'Autorisé'
      case 'denied': return 'Refusé'
      case 'no-device': return 'Aucun appareil'
      case 'error': return 'Erreur'
      default: return 'Inconnu'
    }
  }

  const getPermissionColor = (permission) => {
    switch (permission) {
      case 'granted': return 'text-green-600'
      case 'denied': return 'text-red-600'
      case 'no-device': return 'text-orange-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-xl p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
        <Mic className="w-5 h-5 mr-2 text-primary-600" />
        Diagnostic Audio
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">navigator.mediaDevices</span>
          <div className="flex items-center space-x-2">
            {getStatusIcon(diagnostics.mediaDevices)}
            <span className={`text-xs font-medium ${diagnostics.mediaDevices ? 'text-green-600' : 'text-red-600'}`}>
              {diagnostics.mediaDevices ? 'Disponible' : 'Non disponible'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">getUserMedia</span>
          <div className="flex items-center space-x-2">
            {getStatusIcon(diagnostics.getUserMedia)}
            <span className={`text-xs font-medium ${diagnostics.getUserMedia ? 'text-green-600' : 'text-red-600'}`}>
              {diagnostics.getUserMedia ? 'Supporté' : 'Non supporté'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">MediaRecorder</span>
          <div className="flex items-center space-x-2">
            {getStatusIcon(diagnostics.mediaRecorder)}
            <span className={`text-xs font-medium ${diagnostics.mediaRecorder ? 'text-green-600' : 'text-red-600'}`}>
              {diagnostics.mediaRecorder ? 'Supporté' : 'Non supporté'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">HTTPS</span>
          <div className="flex items-center space-x-2">
            {getStatusIcon(diagnostics.https)}
            <span className={`text-xs font-medium ${diagnostics.https ? 'text-green-600' : 'text-red-600'}`}>
              {diagnostics.https ? 'Oui' : 'Non'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Localhost</span>
          <div className="flex items-center space-x-2">
            {getStatusIcon(diagnostics.localhost)}
            <span className={`text-xs font-medium ${diagnostics.localhost ? 'text-green-600' : 'text-red-600'}`}>
              {diagnostics.localhost ? 'Oui' : 'Non'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Permissions microphone</span>
          <div className="flex items-center space-x-2">
            {diagnostics.permissions === 'granted' ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-xs font-medium ${getPermissionColor(diagnostics.permissions)}`}>
              {getPermissionText(diagnostics.permissions)}
            </span>
          </div>
        </div>
      </div>

      {/* Informations supplémentaires */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-800">
            <p className="font-medium mb-1">Informations techniques :</p>
            <p>• Navigateur : {navigator.userAgent.split(' ')[0]}</p>
            <p>• URL : {window.location.href}</p>
            <p>• Protocole : {window.location.protocol}</p>
            <p>• Hostname : {window.location.hostname}</p>
          </div>
        </div>
      </div>

      {/* Bouton de re-test */}
      <button
        onClick={runDiagnostics}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
      >
        Re-tester le diagnostic
      </button>
    </div>
  )
}

export default AudioDiagnostic
