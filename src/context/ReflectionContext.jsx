import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

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
    
    default:
      return state
  }
}

export const ReflectionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reflectionReducer, initialState)

  // Charger les réflexions depuis le localStorage au démarrage
  useEffect(() => {
    const loadReflections = () => {
      try {
        const savedReflections = localStorage.getItem('brainlm-reflections')
        if (savedReflections) {
          const reflections = JSON.parse(savedReflections)
          dispatch({ type: 'LOAD_REFLECTIONS', payload: reflections })
        }
      } catch (error) {
        console.error('Erreur lors du chargement des réflexions:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement des données' })
      }
    }

    loadReflections()
  }, [])

  // Sauvegarder les réflexions dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('brainlm-reflections', JSON.stringify(state.reflections))
  }, [state.reflections])

  const addReflection = (reflectionData) => {
    const newReflection = {
      id: uuidv4(),
      ...reflectionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    dispatch({ type: 'ADD_REFLECTION', payload: newReflection })
    return newReflection
  }

  const updateReflection = (id, updates) => {
    const updatedReflection = {
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    }
    
    dispatch({ type: 'UPDATE_REFLECTION', payload: updatedReflection })
  }

  const deleteReflection = (id) => {
    dispatch({ type: 'DELETE_REFLECTION', payload: id })
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

  const value = {
    ...state,
    addReflection,
    updateReflection,
    deleteReflection,
    getReflectionById,
    getReflectionsByDate,
    getRecentReflections
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
