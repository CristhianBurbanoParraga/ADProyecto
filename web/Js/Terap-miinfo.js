//Abrir otras paginas
const btnpaciente = document.getElementById('abrirpaciente');
btnpaciente.addEventListener('click', function () {
    location.replace('../Pages/Terap-paciente.html');
});

const btnprescrip = document.getElementById('abrirpreescripciones');
btnprescrip.addEventListener('click', function () {
    location.replace('../terapeuta.html');
});

const btnreporte = document.getElementById('abrirreporte');
btnreporte.addEventListener('click', function () {
    location.replace('../Pages/Terap-reporte.html');
});

//Cerrar sesion
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log('Sign Out');
    }).then(function () {
        location.replace("../index.html");
    }).catch(function (e) {
        alert('Error al realizar el LogOut: \n\n' + e);
    });
});

var key = 'Sin key';
var userlog = '';

const formData = document.getElementById('form-midata');
const formCred = document.getElementById('form-credential');

const updateCred = document.getElementById('updatecred');
//comprobar estado de la autenticacion y cargar datos del usuario logeado
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Estado de Autenticacion: True");
        userlog = auth.currentUser;
        var email = userlog.email;
        bd.ref('usuario/').on('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                if (childSnapshot.val().email === email) {
                    formData['identificacion'].value = childSnapshot.val().cid;
                    formData['nombre'].value = childSnapshot.val().names;
                    formData['apellido'].value = childSnapshot.val().lastnames;
                    formData['fecha'].value = childSnapshot.val().birthdate;
                    formData['direccion'].value = childSnapshot.val().address;
                    formData['telefono'].value = childSnapshot.val().phone;
                    formCred['email'].value = childSnapshot.val().email;
                    key = childSnapshot.key;
                }
            });
        });
    } else {
        console.log("Estado de Autenticacion: False");
    }
});

//modificar datos del usuario logeado
const updateData = document.getElementById('updatedata');

const updateUserLog = (key, cid, address, birthdate, lastnames, names, phone) =>
    bd.ref('usuario/' + key).update({
        cid: cid,
        address: address,
        birthdate: birthdate,
        lastnames: lastnames,
        names: names,
        phone: phone
    }, (error) => {
        if (error) {
            alert('Error al actualizar los datos');
        }
    });

updateData.addEventListener('click', (e) => {
    const cid = document.getElementById('identificacion');
    const address = document.getElementById('direccion');
    const birthdate = document.getElementById('fecha');
    const lastnames = document.getElementById('apellido');
    const names = document.getElementById('nombre');
    const phone = document.getElementById('telefono');
    updateUserLog(key, cid.value, address.value, birthdate.value.toString(), lastnames.value, names.value, phone.value);
});
