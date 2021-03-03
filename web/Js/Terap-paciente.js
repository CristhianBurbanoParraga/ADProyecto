
//Abrir otras paginas 1302501487
const btnmiinfo = document.getElementById('abririformacion');
btnmiinfo.addEventListener('click', function () {
    location.replace('../Pages/Terap-miinfo.html');
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

var u = '';

//comprobar estado de la autenticacion
auth.onAuthStateChanged(user => {
    if (user) {
        u = auth.currentUser;
        //console.log(u.email);
        console.log("Estado de Autenticacion: True");
    } else {
        console.log("Estado de Autenticacion: False");
    }
});

//agregar datos
const savePaciente = (address, birthdate, cid, email, lastnames, names, phone, therapistemail) =>
    bd.ref('usuario/' + cid).set({
        address: address,
        birthdate: birthdate,
        cid: cid,
        email: email,
        lastnames: lastnames,
        names: names,
        password: sha1(cid),
        phone: phone,
        role: "P",
        therapistemail: therapistemail
    }, (error) => {
        if (error) {
            alert('Error al guardar los datos');
        }
    });
const patientForm = document.getElementById('terap-form');
patientForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cid = document.getElementById('identificacion');
    const names = document.getElementById('nombres');
    const lastnames = document.getElementById('apellidos');
    const birhtdate = document.getElementById('fehanacimiento');
    const address = document.getElementById('direccion');
    const email = document.getElementById('email');
    const phone = document.getElementById('telefono');
    await savePaciente(address.value, birhtdate.value.toString(), cid.value, email.value, lastnames.value, names.value, phone.value, u.email);
    auth.createUserWithEmailAndPassword(email.value, sha1(cid.value)).then(userCredential => {
        patientForm.reset();
    });
    cid.focus();
});

var key = '';

//editar datos
const updatePaciente = (key, cid, address, birthdate, lastnames, names, phone) =>
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
var overlayEdit = document.getElementById('overlayedit'),
        popupEdit = document.getElementById('popupedit'),
        btnCerrarPopupEdit = document.getElementById('btn-cerrar-popupedit');
const patientFormEdit = document.getElementById('patient-form-edit');
const btnupdate = document.getElementById('updatepaciente');
btnupdate.addEventListener('click', async (e) => {
    e.preventDefault();
    const cid = document.getElementById('upidentificacion');
    const names = document.getElementById('upnombres');
    const lastnames = document.getElementById('upapellidos');
    const birthdate = document.getElementById('upfehanacimiento');
    const address = document.getElementById('updireccion');
    const phone = document.getElementById('uptelefono');
    await updatePaciente(key, cid.value, address.value, birthdate.value.toString(), lastnames.value, names.value, phone.value);
    overlayEdit.classList.remove('active');
    popupEdit.classList.remove('active');
});

//asignar terapias
var patient = '';
var device = '';
const savePrescripcion = (key, commentary, date, iddevice, device, idusuer, patient, therapistemail, typetheraphy) =>
    bd.ref('prescription/' + key).set({
        commentary: commentary,
        date: date,
        device: device,
        Header: 'No ha realizado los ejercicios',
        iddevice: iddevice,
        iduser: idusuer,
        patient: patient,
        status: 'Pendiente',
        therapistemail: therapistemail,
        typetheraphy: typetheraphy
    }, (error) => {
        if (error) {
            alert('Error al guardar los datos');
        }
    });
const updateDevice = (key, keyprescription) =>
    bd.ref('device/' + key).update({
        status: 'Ocupado',
        currentprescription: keyprescription
    }, (error) => {
        if (error) {
            alert('Error al actualizar los datos');
        }
    });
const databodydevice = document.getElementById('loaddevices');
var overlayPres = document.getElementById('overlaypres'),
        popupPres = document.getElementById('popuppres'),
        btnCerrarPopupPres = document.getElementById('btn-cerrar-popuppres');
const formAddpres = document.getElementById('formpres');
formAddpres.addEventListener('submit', async (e) => {
    e.preventDefault();
    var idp = bd.ref().child('prescription').push().key;
    const mac = document.getElementById('mac');
    const fecha = document.getElementById('fecha');
    const tipoterapia = document.getElementById('tipoterapia');
    const comentario = document.getElementById('comentario');
    updateDevice(mac.value, idp);
    await savePrescripcion(idp, comentario.value, fecha.value.toString(), mac.value, device, key, patient, u.email, tipoterapia.value);
    formAddpres.reset();
    overlayPres.classList.remove('active');
    popupPres.classList.remove('active');
    alert('Se ha registrado con exito una prescripcion\nVea el modulo "PRESCRIPCIONES" para mas detalles.');
});

//cargar datos
const databody = document.getElementById('loaddatos');
window.addEventListener('DOMContentLoaded', function () {
    bd.ref('usuario/').on('value', function (snapshot) {
        databody.innerHTML = '';
        snapshot.forEach(function (childSnapshot) {
            var data = childSnapshot.val();
            data.key = childSnapshot.key;
            if (data.role === "P") {
                if (data.therapistemail === u.email) {
                    databody.innerHTML += `<tr>
                    <th>${data.cid}</th><th>${data.names} ${data.lastnames}</th><th>${data.address}</th><th>${data.phone}</th><th>${data.birthdate}</th><th>${data.email}</th>
                    <th><button data-keyu="${data.key}" class="box-buton buton-edit"><i class="fas fa-pen-square"></i> Editar</button>
                    <button data-keyp="${data.key}" class="box-buton buton-add-pres"><i class="fas fa-notes-medical"></i> Prescripci&oacute;n</button>`;
                }
            }
            const btnsUpdate = document.querySelectorAll('.buton-edit');
            btnsUpdate.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    key = e.target.dataset.keyu;
                    bd.ref('usuario/' + key).once('value').then((snapshot) => {
                        patientFormEdit['updireccion'].value = snapshot.val().address;
                        patientFormEdit['upidentificacion'].value = snapshot.val().cid;
                        patientFormEdit['upfehanacimiento'].value = snapshot.val().birthdate;
                        patientFormEdit['upapellidos'].value = snapshot.val().lastnames;
                        patientFormEdit['upnombres'].value = snapshot.val().names;
                        patientFormEdit['uptelefono'].value = snapshot.val().phone;
                    });
                    overlayEdit.classList.add('active');
                    popupEdit.classList.add('active');
                });
            });
            const btnsAddPres = document.querySelectorAll('.buton-add-pres');
            btnsAddPres.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    key = e.target.dataset.keyp;
                    bd.ref('usuario/' + key).once('value').then((snapshot) => {
                        patient = snapshot.val().names + ' ' + snapshot.val().lastnames;
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
                                    formAddpres['mac'].value = e.target.dataset.device;
                                    bd.ref('device/' + e.target.dataset.device).once('value').then((snapshot) => {
                                        device = snapshot.val().device;
                                    });
                                });
                            });
                        });
                    });
                    overlayPres.classList.add('active');
                    popupPres.classList.add('active');
                });
            });
        });
    });
});

//gestion modales
var btnAbrirPopup = document.getElementById("btn-abrir-popup"),
        overlay = document.getElementById('overlay'),
        popup = document.getElementById('popup'),
        btnCerrarPopup = document.getElementById('btn-cerrar-popup');
btnAbrirPopup.addEventListener('click', function () {
    overlay.classList.add('active');
    popup.classList.add('active');
});
btnCerrarPopup.addEventListener('click', function () {
    overlay.classList.remove('active');
    popup.classList.remove('active');
});

btnCerrarPopupEdit.addEventListener('click', function () {
    overlayEdit.classList.remove('active');
    popupEdit.classList.remove('active');
});

btnCerrarPopupPres.addEventListener('click', function () {
    overlayPres.classList.remove('active');
    popupPres.classList.remove('active');
});