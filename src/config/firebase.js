import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDeZBsDDtJqw20vnquAMEktH0VM8nTHq40",
  authDomain: "brainlm-946ff.firebaseapp.com",
  projectId: "brainlm-946ff",
  storageBucket: "brainlm-946ff.firebasestorage.app",
  messagingSenderId: "1052421972145",
  appId: "1:1052421972145:web:832211c22f593c9a3e8290",
  measurementId: "G-4KSLQG4H3Z"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

export default app
