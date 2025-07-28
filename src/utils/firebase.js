// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyABPzVoosDNOA7IiB3wbJ81mr3Q3mZHAn4',
  authDomain: 'green-kitchen-fb3b3.firebaseapp.com',
  projectId: 'green-kitchen-fb3b3',
  storageBucket: 'green-kitchen-fb3b3.firebasestorage.app',
  messagingSenderId: '708283778062',
  appId: '1:708283778062:web:d861a9499cdf4e4fa5285f',
  measurementId: 'G-612PWZZQR6'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)