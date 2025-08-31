import React from 'react'
import { Brain } from 'lucide-react'

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Chargement...</h2>
        <p className="text-gray-600">Préparation de votre espace d'apprentissage</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
