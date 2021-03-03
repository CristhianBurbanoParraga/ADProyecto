//variables
var role = 'Sin rol';
var users = {};

//Autenticacion por email y password
const siginform = document.querySelector('#sigin-form');
siginform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    //const querySnapshot = await getusers();
    var pass = sha1(password);
    auth.signInWithEmailAndPassword(email, pass).then(userCredential => {
        siginform.reset();
        bd.ref('usuario/').once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                if (childSnapshot.val().email === email) {
                    role = childSnapshot.val().role;
                }
            });
            //console.log(role);
            if (role === 'A') {
                location.replace('Admin.html');
            } else if (role === 'T') {
                location.replace('terapeuta.html');
            } else {
                location.replace('index.html');
            }
        });
    }).catch(function (e) {
        alert('Error de Autenticación: \n\nEnglish: ' + e.message +
                '\n\nEspañol: No hay ningún registro de usuario que corresponda a este identificador. El usuario puede haber sido eliminado');
    });
    
});

//PARA FIRESTORE
/*var users = {};
querySnapshot.forEach(doc => {
    users = doc.data();
    if (users.email === email) {
        role = users.role;
    }
});
 
//Cbtener los usuarios registrados
const getusers = () => db.collection('users').get(); 

//Crear autenticacion de usuarios
/*const signupForm = document.querySelector('#task-form');
 
 signupForm.addEventListener('submit', (e) => {
 e.preventDefault();
 
 const email = document.querySelector('#email').value;
 const password = document.querySelector('#password').value;
 
 auth.createUserWithEmailAndPassword(email, password).then(userCredential => {
 signupForm.reset();
 console.log('SignUp'); 
 });
 });*/


