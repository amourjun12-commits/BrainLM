import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { firestoreService } from '../services/firestoreService'
import { useAuth } from '../hooks/useAuth'

const ReflectionContext = createContext()

const initialState = {
  reflections: [],
  loading: false,
  error: null
}

const reflectionReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_REFLECTION':
      return {
        ...state,
        reflections: [action.payload, ...state.reflections]
      }
    
    case 'UPDATE_REFLECTION':
      return {
        ...state,
        reflections: state.reflections.map(reflection =>
          reflection.id === action.payload.id ? action.payload : reflection
        )
      }
    
    case 'DELETE_REFLECTION':
      return {
        ...state,
        reflections: state.reflections.filter(reflection =>
          reflection.id !== action.payload
        )
      }
    
    case 'LOAD_REFLECTIONS':
      return {
        ...state,
        reflections: action.payload,
        loading: false
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    
    case 'CLEAR_REFLECTIONS':
      return {
        ...state,
        reflections: [],
        loading: false,
        error: null
      }
    
    default:
      return state
  }
}

export const ReflectionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reflectionReducer, initialState)
  const { user } = useAuth()

  // Charger les réflexions depuis Firestore quand l'utilisateur se connecte
  useEffect(() => {
    if (user) {
      loadReflections()
    } else {
      // Vider les réflexions quand l'utilisateur se déconnecte
      dispatch({ type: 'CLEAR_REFLECTIONS' })
    }
  }, [user])

  const loadReflections = async () => {
    if (!user) return

    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const reflections = await firestoreService.getReflectionsByUser(user.uid)
      dispatch({ type: 'LOAD_REFLECTIONS', payload: reflections })
    } catch (error) {
      console.error('Erreur lors du chargement des réflexions:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement des données' })
    }
  }

  const addReflection = async (reflectionData) => {
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const newReflection = await firestoreService.addReflection(user.uid, reflectionData)
      dispatch({ type: 'ADD_REFLECTION', payload: newReflection })
      return newReflection
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réflexion:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la sauvegarde' })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updateReflection = async (id, updates) => {
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const updatedReflection = await firestoreService.updateReflection(id, updates)
      dispatch({ type: 'UPDATE_REFLECTION', payload: updatedReflection })
      return updatedReflection
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réflexion:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la mise à jour' })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const deleteReflection = async (id) => {
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      await firestoreService.deleteReflection(id)
      dispatch({ type: 'DELETE_REFLECTION', payload: id })
    } catch (error) {
      console.error('Erreur lors de la suppression de la réflexion:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la suppression' })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const getReflectionById = (id) => {
    return state.reflections.find(reflection => reflection.id === id)
  }

  const getReflectionsByDate = (date) => {
    return state.reflections.filter(reflection => {
      const reflectionDate = format(new Date(reflection.createdAt), 'yyyy-MM-dd')
      return reflectionDate === date
    })
  }

  const getRecentReflections = (limit = 10) => {
    return state.reflections
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
  }

  const searchReflections = async (searchTerm) => {
    if (!user) return []

    try {
      return await firestoreService.searchReflections(user.uid, searchTerm)
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
      return []
    }
  }

  const value = {
    ...state,
    addReflection,
    updateReflection,
    deleteReflection,
    getReflectionById,
    getReflectionsByDate,
    getRecentReflections,
    searchReflections,
    loadReflections
  }

  return (
    <ReflectionContext.Provider value={value}>
      {children}
    </ReflectionContext.Provider>
  )
}

export const useReflection = () => {
  const context = useContext(ReflectionContext)
  if (!context) {
    throw new Error('useReflection doit être utilisé dans un ReflectionProvider')
  }
  return context
}
