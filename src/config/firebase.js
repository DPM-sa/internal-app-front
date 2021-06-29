/* const firebase = require("firebase/app");
require("firebase/storage"); */
import firebase from 'firebase/app'
import 'firebase/storage'

const config = {
    apiKey: "AIzaSyDE-5LSHXbwYa_koNeVlJkQjUeC4pVpRvw",
    authDomain: "internal-app-dpm.firebaseapp.com",
    projectId: "internal-app-dpm",
    storageBucket: "internal-app-dpm.appspot.com",
    messagingSenderId: "295094989941",
    appId: "1:295094989941:web:d9f0e2a4353a0f50c5343c"
};
firebase.initializeApp(config);

const storage = firebase.storage();

export { firebase, storage }