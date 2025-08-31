import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, BookOpen, Clock, TrendingUp, Brain, Sparkles } from 'lucide-react'
import { useReflection } from '../context/ReflectionContext'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const HomePage = () => {
  const { getRecentReflections } = useReflection()
  const recentReflections = getRecentReflections(3)

  const stats = [
    {
      icon: BookOpen,
      label: 'Réflexions',
      value: recentReflections.length,
      color: 'text-primary-600'
    },
    {
      icon: Clock,
      label: 'Aujourd\'hui',
      value: recentReflections.filter(r => {
        const today = format(new Date(), 'yyyy-MM-dd')
        const reflectionDate = format(new Date(r.createdAt), 'yyyy-MM-dd')
        return reflectionDate === today
      }).length,
      color: 'text-secondary-600'
    },
    {
      icon: TrendingUp,
      label: 'Progression',
      value: 'En cours',
      color: 'text-green-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-90"></div>
        <div className="relative px-6 py-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">BrainLM</h1>
              <p className="text-primary-100 text-sm">Ancrez vos apprentissages</p>
            </div>
          </div>
          <p className="text-white text-lg max-w-md mx-auto leading-relaxed">
            Transformez chaque contenu consommé en actions concrètes grâce à des réflexions structurées
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 -mt-8 mb-8">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="card text-center py-4">
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions principales */}
      <div className="px-6 mb-8">
        <Link
          to="/new"
          className="btn-primary w-full flex items-center justify-center space-x-3 text-lg py-4"
        >
          <Plus className="w-6 h-6" />
          <span>Nouvelle réflexion</span>
        </Link>
      </div>

      {/* Réflexions récentes */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Réflexions récentes</h2>
          <Link
            to="/history"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Voir tout
          </Link>
        </div>

        {recentReflections.length === 0 ? (
          <div className="card text-center py-12">
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Commencez votre voyage d'apprentissage
            </h3>
            <p className="text-gray-600 mb-6">
              Créez votre première réflexion pour ancrer vos apprentissages
            </p>
            <Link to="/new" className="btn-primary">
              Créer ma première réflexion
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentReflections.map((reflection) => (
              <Link
                key={reflection.id}
                to={`/reflection/${reflection.id}`}
                className="card hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {reflection.contentTitle || 'Réflexion sans titre'}
                  </h3>
                  <span className="text-xs text-gray-500 ml-2">
                    {format(new Date(reflection.createdAt), 'dd/MM', { locale: fr })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {reflection.learned || 'Aucun contenu saisi'}
                </p>
                <div className="flex items-center mt-3 text-xs text-gray-500">
                  <BookOpen className="w-3 h-3 mr-1" />
                  <span>
                    {format(new Date(reflection.createdAt), 'EEEE dd MMMM', { locale: fr })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Conseils */}
      <div className="px-6 mb-8">
        <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Sparkles className="w-5 h-5 text-primary-600 mr-2" />
            Conseil du jour
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Prenez 5 minutes après chaque contenu pour répondre aux trois questions clés. 
            Cette habitude transformera votre façon d'apprendre et d'intégrer l'information.
          </p>
        </div>
      </div>

      {/* Navigation bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <Link
            to="/"
            className="flex flex-col items-center space-y-1 text-primary-600"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-xs font-medium">Accueil</span>
          </Link>
          <Link
            to="/new"
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-primary-600"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs font-medium">Nouveau</span>
          </Link>
          <Link
            to="/history"
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-primary-600"
          >
            <Clock className="w-5 h-5" />
            <span className="text-xs font-medium">Historique</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
