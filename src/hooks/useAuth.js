import { useState, useEffect } from 'react'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth } from '../config/firebase'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signUp = async (email, password, displayName) => {
    try {
      setError(null)
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update profile with display name
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName
        })
      }
      
      return userCredential.user
    } catch (error) {
      setError(getErrorMessage(error.code))
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      setError(getErrorMessage(error.code))
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
    } catch (error) {
      setError(getErrorMessage(error.code))
      throw error
    }
  }

  const resetPassword = async (email) => {
    try {
      setError(null)
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      setError(getErrorMessage(error.code))
      throw error
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    logout,
    resetPassword,
    clearError
  }
}

// Helper function to get user-friendly error messages
const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Cette adresse email est déjà utilisée.'
    case 'auth/invalid-email':
      return 'Adresse email invalide.'
    case 'auth/operation-not-allowed':
      return 'L\'authentification par email/mot de passe n\'est pas activée.'
    case 'auth/weak-password':
      return 'Le mot de passe doit contenir au moins 6 caractères.'
    case 'auth/user-disabled':
      return 'Ce compte a été désactivé.'
    case 'auth/user-not-found':
      return 'Aucun compte trouvé avec cette adresse email.'
    case 'auth/wrong-password':
      return 'Mot de passe incorrect.'
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Veuillez réessayer plus tard.'
    case 'auth/network-request-failed':
      return 'Erreur de connexion. Vérifiez votre connexion internet.'
    default:
      return 'Une erreur est survenue. Veuillez réessayer.'
  }
}
