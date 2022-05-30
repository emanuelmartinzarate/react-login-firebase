import app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyADglE2Iv-AAl3Ltq9ZCoitvu9a5OZD-qQ",
    authDomain: "crud-udemy-react-9cc27.firebaseapp.com",
    projectId: "crud-udemy-react-9cc27",
    storageBucket: "crud-udemy-react-9cc27.appspot.com",
    messagingSenderId: "933756039584",
    appId: "1:933756039584:web:03f83e44676b772994b4c5"
  };

app.initializeApp(firebaseConfig);

const db = app.firestore()

const auth = app.auth()

export {db,auth}