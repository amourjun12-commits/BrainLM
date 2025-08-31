import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search, Filter, Calendar, BookOpen, TrendingUp } from 'lucide-react'
import { useReflection } from '../context/ReflectionContext'
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'
import { fr } from 'date-fns/locale'

const HistoryPage = () => {
  const { reflections } = useReflection()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPeriod, setFilterPeriod] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const periods = [
    { id: 'all', label: 'Toutes', icon: BookOpen },
    { id: 'today', label: 'Aujourd\'hui', icon: Calendar },
    { id: 'week', label: 'Cette semaine', icon: TrendingUp },
    { id: 'month', label: 'Ce mois', icon: Calendar }
  ]

  const sortOptions = [
    { id: 'date', label: 'Plus récent' },
    { id: 'date-asc', label: 'Plus ancien' },
    { id: 'title', label: 'Titre A-Z' }
  ]

  const filteredReflections = useMemo(() => {
    let filtered = reflections

    // Filtre par période
    const now = new Date()
    switch (filterPeriod) {
      case 'today':
        const today = format(now, 'yyyy-MM-dd')
        filtered = filtered.filter(reflection => {
          const reflectionDate = format(new Date(reflection.createdAt), 'yyyy-MM-dd')
          return reflectionDate === today
        })
        break
      case 'week':
        const weekStart = startOfWeek(now, { weekStartsOn: 1 })
        const weekEnd = endOfWeek(now, { weekStartsOn: 1 })
        filtered = filtered.filter(reflection => {
          const reflectionDate = new Date(reflection.createdAt)
          return isWithinInterval(reflectionDate, { start: weekStart, end: weekEnd })
        })
        break
      case 'month':
        const currentMonth = format(now, 'yyyy-MM')
        filtered = filtered.filter(reflection => {
          const reflectionMonth = format(new Date(reflection.createdAt), 'yyyy-MM')
          return reflectionMonth === currentMonth
        })
        break
      default:
        break
    }

    // Filtre par recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(reflection => 
        reflection.contentTitle?.toLowerCase().includes(term) ||
        reflection.learned?.toLowerCase().includes(term) ||
        reflection.importance?.toLowerCase().includes(term) ||
        reflection.actions?.toLowerCase().includes(term)
      )
    }

    // Tri
    switch (sortBy) {
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      case 'title':
        filtered.sort((a, b) => (a.contentTitle || '').localeCompare(b.contentTitle || ''))
        break
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
    }

    return filtered
  }, [reflections, searchTerm, filterPeriod, sortBy])

  const groupedReflections = useMemo(() => {
    const groups = {}
    filteredReflections.forEach(reflection => {
      const date = format(new Date(reflection.createdAt), 'yyyy-MM-dd')
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(reflection)
    })
    return groups
  }, [filteredReflections])

  const stats = {
    total: reflections.length,
    filtered: filteredReflections.length,
    today: reflections.filter(r => {
      const today = format(new Date(), 'yyyy-MM-dd')
      const reflectionDate = format(new Date(r.createdAt), 'yyyy-MM-dd')
      return reflectionDate === today
    }).length
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Historique</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center py-3">
            <div className="text-2xl font-bold text-primary-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="card text-center py-3">
            <div className="text-2xl font-bold text-secondary-600">{stats.today}</div>
            <div className="text-sm text-gray-600">Aujourd'hui</div>
          </div>
          <div className="card text-center py-3">
            <div className="text-2xl font-bold text-green-600">{stats.filtered}</div>
            <div className="text-sm text-gray-600">Affichées</div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="px-6 mb-4">
        <div className="card p-4">
          {/* Recherche */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher dans vos réflexions..."
              className="input-field pl-10"
            />
          </div>

          {/* Périodes */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Période
            </label>
            <div className="grid grid-cols-2 gap-2">
              {periods.map((period) => (
                <button
                  key={period.id}
                  onClick={() => setFilterPeriod(period.id)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    filterPeriod === period.id
                      ? 'bg-primary-100 border-primary-300 text-primary-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <period.icon className="w-4 h-4 inline mr-1" />
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tri */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trier par
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des réflexions */}
      <div className="px-6">
        {filteredReflections.length === 0 ? (
          <div className="card text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || filterPeriod !== 'all' ? 'Aucune réflexion trouvée' : 'Aucune réflexion'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterPeriod !== 'all' 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Créez votre première réflexion pour commencer'
              }
            </p>
            <Link to="/new" className="btn-primary">
              Créer une réflexion
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedReflections).map(([date, reflections]) => (
              <div key={date}>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  {format(new Date(date), 'EEEE dd MMMM yyyy', { locale: fr })}
                </h3>
                <div className="space-y-3">
                  {reflections.map((reflection) => (
                    <Link
                      key={reflection.id}
                      to={`/reflection/${reflection.id}`}
                      className="card hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 line-clamp-2 flex-1">
                          {reflection.contentTitle || 'Réflexion sans titre'}
                        </h4>
                        <span className="text-xs text-gray-500 ml-2">
                          {format(new Date(reflection.createdAt), 'HH:mm', { locale: fr })}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {reflection.learned && (
                          <p className="text-sm text-gray-600 line-clamp-1">
                            <span className="font-medium">Appris:</span> {reflection.learned}
                          </p>
                        )}
                        {reflection.importance && (
                          <p className="text-sm text-gray-600 line-clamp-1">
                            <span className="font-medium">Important:</span> {reflection.importance}
                          </p>
                        )}
                        {reflection.actions && (
                          <p className="text-sm text-gray-600 line-clamp-1">
                            <span className="font-medium">Actions:</span> {reflection.actions}
                          </p>
                        )}
                      </div>

                      {reflection.contentLink && (
                        <div className="mt-2">
                          <span className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded">
                            Lien disponible
                          </span>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage
