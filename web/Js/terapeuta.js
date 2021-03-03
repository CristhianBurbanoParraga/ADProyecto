//Abrir otras paginas
const btnmiinfo = document.getElementById('abririformacion');
btnmiinfo.addEventListener('click', function () {
    location.replace('Pages/Terap-miinfo.html');
});

const btnpaciente = document.getElementById('abrirpaciente');
btnpaciente.addEventListener('click', function () {
    location.replace('Pages/Terap-paciente.html');
});

const btnreporte = document.getElementById('abrirreporte');
btnreporte.addEventListener('click', function () {
    location.replace('Pages/Terap-reporte.html');
});

//Cerrar sesion 
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log('Sign Out');
    }).then(function () {
        location.replace("index.html");
    }).catch(function (e) {
        alert('Error al realizar el LogOut: \n\n' + e);
    });
});

var u = '';

//Estado de la sesion
auth.onAuthStateChanged(user => {
    if (user) {
        u = auth.currentUser;
        //console.log(u.email);
        console.log("Estado de Autenticacion: True");
    } else {
        console.log("Estado de Autenticacion: False");
    }
});

var key = '';
var auxmac = '';


//editar datos
const updatePres = (key, commentary, date, iddevice, device, typetheraphy) =>
    bd.ref('prescription/' + key).update({
        commentary: commentary,
        date: date,
        iddevice: iddevice,
        device: device,
        typetheraphy: typetheraphy
    }, (error) => {
        if (error) {
            alert('Error al actualizar los datos');
        }
    });
const updateOcupado = (key, currentprescription) => bd.ref('device/' + key).update({
        status: 'Ocupado',
        currentprescription: currentprescription
    }, (error) => {
        if (error) {
            alert('Error al actualizar los datos');
        }
    });
const updateLibre = (key) => bd.ref('device/' + key).update({
        status: 'Libre',
        currentprescription: 'NULL'
    }, (error) => {
        if (error) {
            alert('Error al actualizar los datos');
        }
    });
const presFormEdit = document.getElementById('pres-form-edit');
const databodydevice = document.getElementById('loaddevices');
var overlay = document.getElementById('overlay'),
        popup = document.getElementById('popup'),
        btnCerrarPopup = document.getElementById('btn-cerrar-popup');
const btnUpdatePres = document.getElementById('btnupdatepres');
btnUpdatePres.addEventListener('click', async (e) => {
    e.preventDefault();
    var mac = document.getElementById('upmac');
    var date = document.getElementById('upfecha');
    var ttep = document.getElementById('uptipoterapia');
    var com = document.getElementById('upcomentario');
    var dev = 'Device';
    bd.ref('device/' + mac.value).once('value').then((snapshot) => {
        dev = snapshot.val().device;
    });
    updateLibre(auxmac);
    updateOcupado(mac.value, key);
    await updatePres(key, com.value, date.value.toString(), mac.value, dev, ttep.value);
    overlay.classList.remove('active');
    popup.classList.remove('active');
});

//cargar datos
const databody = document.getElementById('loaddatos');
window.addEventListener('DOMContentLoaded', function () {
    bd.ref('prescription/').on('value', function (snapshot) {
        databody.innerHTML = '';
        snapshot.forEach(function (childSnapshot) {
            var data = childSnapshot.val();
            data.key = childSnapshot.key;
            if (data.therapistemail === u.email) {
                if (data.status === "Finalizado") {
                    databody.innerHTML += `<tr>
                    <th>C.C: ${data.iduser}<br>Nombre: ${data.patient}</th><th>ID: ${data.iddevice}<br>Nombre: ${data.device}<th></th><th>${data.date}</th><th>${data.typetheraphy}</th><th>${data.commentary}</th><th>${data.status}</th>
                    <th><button data-key="${data.key}" class="box-buton buton-edit"><i class="fas fa-pen-square"></i> Editar</button>
                    <button data-key="${data.key}" class="box-buton buton-report"><i class="fas fa-file-invoice"></i> Ver Reporte</button>`;
                } else {
                    databody.innerHTML += `<tr>
                    <th>C.C: ${data.iduser}<br>${data.patient}</th><th>ID: ${data.iddevice}<br>${data.device}</th><th>${data.date}</th><th>${data.typetheraphy}</th><th>${data.commentary}</th><th>${data.status}</th>
                    <th><button data-key="${data.key}" class="box-buton buton-edit"><i class="fas fa-pen-square"></i> Editar</button>`;
                }
            }
            const btnsUpdate = document.querySelectorAll('.buton-edit');
            btnsUpdate.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    key = e.target.dataset.key;
                    bd.ref('prescription/' + key).once('value').then((snapshot) => {
                        auxmac = snapshot.val().iddevice;
                        presFormEdit['upmac'].value = snapshot.val().iddevice;
                        presFormEdit['upfecha'].value = snapshot.val().date;
                        presFormEdit['uptipoterapia'].value = snapshot.val().typetheraphy;
                        presFormEdit['upcomentario'].value = snapshot.val().commentary;
                    });
                    bd.ref('device/').on('value', function (snapshot) {
                        databodydevice.innerHTML = '';
                        snapshot.forEach(function (childSnapshot) {
                            if (childSnapshot.val().status === "Libre") {
                                databodydevice.innerHTML += `<tr><th>${childSnapshot.val().mac}</th><th>${childSnapshot.val().device}</th>
                                        <th><button data-device="${childSnapshot.key}" class="box-buton buton-select"><i class="fas fa-check"></i> Escoger</button></th></tr>`;
                            }
                            const btnsSelect = document.querySelectorAll('.buton-select');
                            btnsSelect.forEach(btn => {
                                btn.addEventListener('click', async (e) => {
                                    presFormEdit['upmac'].value = e.target.dataset.device;
                                });
                            });
                        });
                    });
                    overlay.classList.add('active');
                    popup.classList.add('active');
                });
            });
        });
    });
});

//gestion modales
btnCerrarPopup.addEventListener('click', function () {
    overlay.classList.remove('active');
    popup.classList.remove('active');
});