// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyAwcLirv3uw276KspEdRrSS-VXoHhTW3pI",
    authDomain: "rehabilitacioniot-a9f5a.firebaseapp.com",
    databaseURL: "https://rehabilitacioniot-a9f5a-default-rtdb.firebaseio.com",
    projectId: "rehabilitacioniot-a9f5a",
    storageBucket: "rehabilitacioniot-a9f5a.appspot.com",
    messagingSenderId: "923046089308",
    appId: "1:923046089308:web:912343b4e2a3158733cc99",
    measurementId: "G-7JLFE2MTY6"
  };
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
//firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();//Authentication
//const db = firebase.firestore();//Cloud Firebase
const bd = firebase.database();//Realtime Database

/*const dbref=firebase.database().ref().child('usuario');
dbref.on('value',function(snapshot){
    snapshot.forEach(function(childSnapshot) {
        console.log(childSnapshot.key);
        console.log(childSnapshot.val());
    });
});*/