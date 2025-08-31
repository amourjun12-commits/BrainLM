import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, BookOpen, Clock, TrendingUp, Brain, Sparkles, Target, Zap } from 'lucide-react'
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
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200'
    },
    {
      icon: Clock,
      label: 'Aujourd\'hui',
      value: recentReflections.filter(r => {
        const today = format(new Date(), 'yyyy-MM-dd')
        const reflectionDate = format(new Date(r.createdAt), 'yyyy-MM-dd')
        return reflectionDate === today
      }).length,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
      borderColor: 'border-secondary-200'
    },
    {
      icon: TrendingUp,
      label: 'Progression',
      value: 'En cours',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header amélioré */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 opacity-95"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="relative px-6 py-16 text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 shadow-2xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">BrainLM</h1>
              <p className="text-primary-100 text-sm font-medium">Ancrez vos apprentissages</p>
            </div>
          </div>
          <p className="text-white text-base max-w-sm mx-auto leading-relaxed font-light">
            Transformez chaque contenu consommé en actions concrètes grâce à des réflexions structurées
          </p>
          
                     {/* Indicateur de progression */}
           <div className="mt-6 flex items-center justify-center space-x-3">
             <div className="flex items-center space-x-1 text-white text-xs">
               <Target className="w-3 h-3" />
               <span>Objectif quotidien</span>
             </div>
             <div className="w-20 h-1.5 bg-white bg-opacity-20 rounded-full overflow-hidden">
               <div className="h-full bg-white rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.min((recentReflections.length / 3) * 100, 100)}%` }}></div>
             </div>
             <span className="text-white text-xs font-medium">{recentReflections.length}/3</span>
           </div>
        </div>
      </div>

      {/* Stats améliorées */}
      <div className="px-4 -mt-6 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className={`card ${stat.bgColor} ${stat.borderColor} border-2 text-center py-4 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}>
              <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-2 shadow-inner`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions principales améliorées */}
      <div className="px-4 mb-6">
        <Link
          to="/new"
          className="group relative overflow-hidden bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 text-base"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-secondary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-3">
            <div className="w-7 h-7 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <span>Nouvelle réflexion</span>
          </div>
        </Link>
      </div>

            {/* Réflexions récentes - Design complètement refait */}
      <div className="px-4 mb-6">
        {/* Header de la section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Réflexions récentes</h2>
          </div>
          <Link
            to="/history"
            className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
          >
            <span>Voir tout</span>
            <Zap className="w-3 h-3" />
          </Link>
        </div>

        {/* Contenu de la section */}
        {recentReflections.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center py-12">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Commencez votre apprentissage
            </h3>
            <p className="text-gray-500 mb-6 text-sm max-w-xs mx-auto">
              Créez votre première réflexion pour ancrer vos connaissances
            </p>
            <Link 
              to="/new" 
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Créer ma première réflexion</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentReflections.map((reflection, index) => (
              <div
                key={reflection.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* En-tête de la réflexion */}
                <div className="p-4 border-b border-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-base leading-tight flex-1 pr-3">
                      {reflection.contentTitle || 'Réflexion sans titre'}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {reflection.contentLink && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {format(new Date(reflection.createdAt), 'dd/MM', { locale: fr })}
                      </span>
                    </div>
                  </div>
                  
                  {/* Aperçu du contenu */}
                  <div className="space-y-1">
                    {reflection.learned && (
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-xs text-gray-600 line-clamp-1">
                          <span className="font-medium text-gray-700">Appris :</span> {reflection.learned}
                        </p>
                      </div>
                    )}
                    
                    {reflection.importance && (
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-secondary-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-xs text-gray-600 line-clamp-1">
                          <span className="font-medium text-gray-700">Important :</span> {reflection.importance}
                        </p>
                      </div>
                    )}
                    
                    {reflection.actions && (
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-xs text-gray-600 line-clamp-1">
                          <span className="font-medium text-gray-700">Actions :</span> {reflection.actions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Pied de la réflexion */}
                <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <BookOpen className="w-3 h-3" />
                    <span>{format(new Date(reflection.createdAt), 'dd MMM yyyy', { locale: fr })}</span>
                  </div>
                  <Link
                    to={`/reflection/${reflection.id}`}
                    className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Voir détails →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conseils améliorés */}
      <div className="px-4 mb-6">
        <div className="card bg-gradient-to-r from-primary-50 via-secondary-50 to-primary-50 border-2 border-primary-200 p-4">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <Sparkles className="w-4 h-4 text-primary-600 mr-2" />
            Conseil du jour
          </h3>
          <p className="text-gray-700 leading-relaxed mb-3 text-sm">
            Prenez 5 minutes après chaque contenu pour répondre aux trois questions clés. 
            Cette habitude transformera votre façon d'apprendre et d'intégrer l'information.
          </p>
          <div className="flex items-center space-x-2 text-xs text-primary-600">
            <Target className="w-3 h-3" />
            <span>Objectif : 3 réflexions par jour</span>
          </div>
        </div>
      </div>

      {/* Navigation bottom améliorée */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <Link
            to="/"
            className="flex flex-col items-center space-y-1 text-primary-600"
          >
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">Accueil</span>
          </Link>
          <Link
            to="/new"
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary-100 transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">Nouveau</span>
          </Link>
          <Link
            to="/history"
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary-100 transition-colors">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">Historique</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
