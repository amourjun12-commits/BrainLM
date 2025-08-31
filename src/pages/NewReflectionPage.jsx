import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Link as LinkIcon, BookOpen } from 'lucide-react'
import { useReflection } from '../context/ReflectionContext'
import QuestionCard from '../components/QuestionCard'

const NewReflectionPage = () => {
  const navigate = useNavigate()
  const { addReflection } = useReflection()
  
  const [formData, setFormData] = useState({
    contentTitle: '',
    contentLink: '',
    learned: '',
    importance: '',
    actions: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const questions = [
    {
      id: 'learned',
      question: 'Qu\'est-ce que j\'ai appris spécifiquement de ce contenu ?',
      subQuestions: [],
      placeholder: 'Décrivez les points clés que vous avez retenus de ce contenu...'
    },
    {
      id: 'importance',
      question: 'En quoi cela est-il important pour moi ?',
      subQuestions: [
        'Qu\'est-ce que je rêvais spécifiquement sur ma vie ?',
        'Quelle partie de ma vie est concernée ?',
        'Quelle habitude ou comportement est touché par le contenu que j\'ai regardé ?'
      ],
      placeholder: 'Expliquez pourquoi ce contenu est significatif pour vous...'
    },
    {
      id: 'actions',
      question: 'Qu\'est-ce que je vais faire différemment à cause de ce que je viens d\'apprendre ?',
      subQuestions: [
        'J\'essaye quoi de nouveau ?',
        'Cette semaine, à quoi du ce contenu ?',
        'Et quelle décision je prends à quoi du ce contenu ?'
      ],
      placeholder: 'Décrivez les actions concrètes que vous allez mettre en place...'
    }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.contentTitle.trim()) {
      alert('Veuillez saisir un titre pour votre contenu')
      return
    }

    if (!formData.learned.trim() && !formData.importance.trim() && !formData.actions.trim()) {
      alert('Veuillez répondre à au moins une des questions de réflexion')
      return
    }

    setIsSubmitting(true)
    
    try {
      const newReflection = addReflection(formData)
      navigate(`/reflection/${newReflection.id}`)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      alert('Erreur lors de la sauvegarde de votre réflexion')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    // Sauvegarder comme brouillon (implémentation future)
    alert('Fonctionnalité brouillon à venir')
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header amélioré */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-6 text-white">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-xl transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Nouvelle réflexion</h1>
          <button
            onClick={handleSaveDraft}
            className="text-sm text-white hover:text-white hover:bg-white hover:bg-opacity-20 px-3 py-1 rounded-lg transition-all duration-300"
          >
            Brouillon
          </button>
        </div>
        <p className="text-primary-100 text-sm mt-2 text-center">
          Ancrez vos apprentissages en répondant à ces questions clés
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6">
        {/* Informations du contenu */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-primary-600" />
            Informations du contenu
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre du contenu *
              </label>
              <input
                type="text"
                value={formData.contentTitle}
                onChange={(e) => handleInputChange('contentTitle', e.target.value)}
                placeholder="Ex: Podcast sur la productivité, Vidéo YouTube sur..."
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lien du contenu (optionnel)
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.contentLink}
                  onChange={(e) => handleInputChange('contentLink', e.target.value)}
                  placeholder="https://..."
                  className="input-field pl-10"
                />
                <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Questions de réflexion */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Questions de réflexion
          </h2>
          
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question.question}
              subQuestions={question.subQuestions}
              value={formData[question.id]}
              onChange={(value) => handleInputChange(question.id, value)}
              placeholder={question.placeholder}
            />
          ))}
        </div>

        {/* Boutons d'action */}
        <div className="space-y-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sauvegarde...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Sauvegarder ma réflexion</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary w-full"
          >
            Annuler
          </button>
        </div>

        {/* Conseils */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Conseils</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Prenez votre temps pour réfléchir à chaque question</li>
            <li>• Utilisez l'enregistrement vocal pour capturer vos pensées rapidement</li>
            <li>• Soyez spécifique dans vos réponses pour un meilleur ancrage</li>
            <li>• Relisez vos réflexions régulièrement pour consolider vos apprentissages</li>
          </ul>
        </div>
      </form>
    </div>
  )
}

export default NewReflectionPage
