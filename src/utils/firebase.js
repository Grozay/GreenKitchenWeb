// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'green-kitchen-fb3b3.firebaseapp.com',
  projectId: 'green-kitchen-fb3b3',
  storageBucket: 'green-kitchen-fb3b3.firebasestorage.app',
  messagingSenderId: '708283778062',
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: 'G-612PWZZQR6'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

// Initialize Firebase Authentication
export const auth = getAuth(app)
export { analytics }

export default app