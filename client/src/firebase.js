import firebase from 'firebase/app';
import 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCXhjI0znGMmJjNl7iPhpzXvgZGuMoaHyU',
  authDomain: 'ecommerce-5e278.firebaseapp.com',
  databaseURL: 'https://ecommerce-5e278.firebaseio.com',
  projectId: 'ecommerce-5e278',
  storageBucket: 'ecommerce-5e278.appspot.com',
  messagingSenderId: '694217887831',
  appId: '1:694217887831:web:8be62a186b5047f44c9312'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
