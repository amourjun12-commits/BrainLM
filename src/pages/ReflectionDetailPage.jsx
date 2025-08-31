import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, ExternalLink, Calendar, Clock } from 'lucide-react'
import { useReflection } from '../context/ReflectionContext'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const ReflectionDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getReflectionById, updateReflection, deleteReflection } = useReflection()
  const [reflection, setReflection] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const foundReflection = getReflectionById(id)
    if (foundReflection) {
      setReflection(foundReflection)
      setEditedData(foundReflection)
    } else {
      navigate('/')
    }
  }, [id, getReflectionById, navigate])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      updateReflection(id, editedData)
      setReflection(editedData)
      setIsEditing(false)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedData(reflection)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réflexion ?')) {
      deleteReflection(id)
      navigate('/')
    }
  }

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!reflection) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  const questions = [
    {
      id: 'learned',
      title: 'Qu\'est-ce que j\'ai appris ?',
      icon: '🧠'
    },
    {
      id: 'importance',
      title: 'En quoi est-ce important ?',
      icon: '⭐'
    },
    {
      id: 'actions',
      title: 'Qu\'est-ce que je vais faire ?',
      icon: '🚀'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Détail de la réflexion</h1>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <>
                <button
                  onClick={handleEdit}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Informations du contenu */}
        <div className="card mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.contentTitle || ''}
                  onChange={(e) => handleInputChange('contentTitle', e.target.value)}
                  className="text-xl font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:border-primary-500 outline-none w-full"
                />
              ) : (
                <h2 className="text-xl font-semibold text-gray-900">
                  {reflection.contentTitle}
                </h2>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>
                {format(new Date(reflection.createdAt), 'EEEE dd MMMM yyyy', { locale: fr })}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>
                {format(new Date(reflection.createdAt), 'HH:mm', { locale: fr })}
              </span>
            </div>
          </div>

          {reflection.contentLink && (
            <a
              href={reflection.contentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Voir le contenu original</span>
            </a>
          )}
        </div>

        {/* Questions et réponses */}
        <div className="space-y-6">
          {questions.map((question) => (
            <div key={question.id} className="card">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">{question.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900">
                  {question.title}
                </h3>
              </div>
              
              {isEditing ? (
                <textarea
                  value={editedData[question.id] || ''}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  placeholder="Tapez votre réponse..."
                  className="input-field min-h-[100px] resize-none"
                  rows={4}
                />
              ) : (
                <div className="text-gray-700 leading-relaxed">
                  {reflection[question.id] ? (
                    <p className="whitespace-pre-wrap">{reflection[question.id]}</p>
                  ) : (
                    <p className="text-gray-500 italic">Aucune réponse fournie</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions rapides */}
        {!isEditing && (
          <div className="mt-8 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200">
            <h3 className="font-semibold text-gray-900 mb-3">Actions rapides</h3>
            <div className="flex space-x-3">
              <button
                onClick={handleEdit}
                className="flex-1 btn-primary text-sm py-2"
              >
                Modifier
              </button>
              <button
                onClick={() => navigate('/new')}
                className="flex-1 btn-secondary text-sm py-2"
              >
                Nouvelle réflexion
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReflectionDetailPage
