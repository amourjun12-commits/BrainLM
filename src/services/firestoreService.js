import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'

const COLLECTION_NAME = 'reflections'

export const firestoreService = {
  // Ajouter une nouvelle réflexion
  async addReflection(userId, reflectionData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...reflectionData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return { id: docRef.id, ...reflectionData }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réflexion:', error)
      throw error
    }
  },

  // Mettre à jour une réflexion
  async updateReflection(reflectionId, updates) {
    try {
      const docRef = doc(db, COLLECTION_NAME, reflectionId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
      return { id: reflectionId, ...updates }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réflexion:', error)
      throw error
    }
  },

  // Supprimer une réflexion
  async deleteReflection(reflectionId) {
    try {
      const docRef = doc(db, COLLECTION_NAME, reflectionId)
      await deleteDoc(docRef)
      return reflectionId
    } catch (error) {
      console.error('Erreur lors de la suppression de la réflexion:', error)
      throw error
    }
  },

  // Récupérer toutes les réflexions d'un utilisateur
  async getReflectionsByUser(userId) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const reflections = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        reflections.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date()
        })
      })
      
      return reflections
    } catch (error) {
      console.error('Erreur lors de la récupération des réflexions:', error)
      throw error
    }
  },

  // Récupérer une réflexion par ID
  async getReflectionById(reflectionId) {
    try {
      const docRef = doc(db, COLLECTION_NAME, reflectionId)
      const docSnap = await getDocs(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date()
        }
      } else {
        return null
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la réflexion:', error)
      throw error
    }
  },

  // Rechercher des réflexions
  async searchReflections(userId, searchTerm) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const reflections = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        const searchableText = [
          data.contentTitle || '',
          data.learned || '',
          data.importance || '',
          data.actions || ''
        ].join(' ').toLowerCase()
        
        if (searchableText.includes(searchTerm.toLowerCase())) {
          reflections.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date()
          })
        }
      })
      
      return reflections
    } catch (error) {
      console.error('Erreur lors de la recherche des réflexions:', error)
      throw error
    }
  }
}
