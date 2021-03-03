
//Abrir otras paginas  0901478034
const btnterapeuta = document.getElementById('abrirterapeuta');
btnterapeuta.addEventListener('click', function () {
    location.replace('Pages/Admin-terapeuta.html');
});

const btnmiinfo = document.getElementById('abririformacion');
btnmiinfo.addEventListener('click', function () {
    location.replace('Pages/Admin-miinfo.html');
});

const btnreporte = document.getElementById('abrirreporte');
btnreporte.addEventListener('click', function () {
    location.replace('Pages/Admin-reporte.html');
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

//comprobar estado de la autenticacion
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Estado de Autenticacion: True");
    } else {
        console.log("Estado de Autenticacion: False");
    }
});

//registrar datos con firestore
/*const saveDevice = (device, mac, observation) => 
    db.collection('dispositivos').doc().set({
        device: device,
        mac: mac,
        observation: observation,
        estado: 'Libre',
        image: ''
});*/

//Agregar datos realtime database
let lastIdDevice = 0;
const saveDevice = (lastIdDevice, device, mac, observation) =>
bd.ref('device/' + lastIdDevice).set({
    currentprescription: 'NULL',
    device: device,
    mac: mac,
    observation: observation,
    status: 'Libre',
    image: ''
}, (error) => {
    if(error) {
        alert('Error al guardar los datos');
    }
});
const deviceForm = document.getElementById('device-form');
deviceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const device = document.getElementById('device');
    const mac = document.getElementById('mac');
    const observation = document.getElementById('observation');
    lastIdDevice = lastIdDevice + 1;
    await saveDevice(lastIdDevice.toString(), device.value, mac.value, observation.value);
    deviceForm.reset();
    device.focus();
    overlay.classList.remove('active');
    popup.classList.remove('active');
});

let key = '';

//modificar datos con firestore
/*const getDevice = (id) => db.collection('dispositivos').doc(id).get();
const updateDevice = (id, updatedDevice) => 
    db.collection('dispositivos').doc(id).update(updatedDevice);*/

//modificar datos con realtime database
const updateDevice = (key, device, mac, observation) =>
bd.ref('device/' + key).update({
    device: device,
    mac: mac,
    observation: observation
}, (error) => {
  if (error) {
    alert('Error al actualizar los datos');
}});
var overlayEdit = document.getElementById('overlayedit'),
        popupEdit = document.getElementById('popupedit'),
        btnCerrarPopupEdit = document.getElementById('btn-cerrar-popupedit');
const deviceFormUpdate = document.getElementById('device-form-update');
const btnupdate = document.getElementById('updatedevice');
btnupdate.addEventListener('click', async (e) => {
    e.preventDefault();
    const device = document.getElementById('updevice');
    const mac = document.getElementById('upmac');
    const observation = document.getElementById('upobservation');
    console.log(key);
    await updateDevice(key, device.value, mac.value, observation.value);
    overlayEdit.classList.remove('active');
    popupEdit.classList.remove('active');
}); 

//Borrar datos con firestore
//const deleteDevice = id => db.collection('dispositivos').doc(id).delete(); 

//Borrar atos con realtime database
const deleteDevice = (key) => bd.ref('device/' + key).remove();
var overlayDelete = document.getElementById('overlaydelete'),
        popupDelete = document.getElementById('popupdelete'),
        btnCerrarPopupDelete = document.getElementById('btn-cerrar-popupdelete');
const btnDeleteDevice = document.getElementById('deletedevice');
btnDeleteDevice.addEventListener('click', async (e) => {
    await deleteDevice(key);
    overlayDelete.classList.remove('active');
    popupDelete.classList.remove('active');
});


//cargar datos con firestore
//const onGetDevices = (callback) => db.collection('dispositivos').onSnapshot(callback);
/*window.addEventListener('DOMContentLoaded', async (e) => {
    onGetDevices((querySnapshot) => {
        databody.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const device = doc.data();
            device.id = doc.id;
            databody.innerHTML += `<tr>
                <th>${device.device}</th><th>${device.mac}</th><th>${device.observation}</th><th>${device.estado}</th>
                <th><button data-id="${device.id}" class="box-buton buton-edit"><i class="fas fa-pen-square"></i> Editar</button>
                <button data-id="${device.id}" class="box-buton buton-delete"><i class="fas fa-trash"></i> Eliminar</button></th></tr>`;
            const btnsUpdate = document.querySelectorAll('.buton-edit');
            btnsUpdate.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    iddevice = e.target.dataset.id;
                    const doc = await getDevice(iddevice);
                    const dev = doc.data();
                    deviceFormUpdate['updevice'].value = doc.data().device;
                    deviceFormUpdate['upmac'].value = doc.data().mac;
                    deviceFormUpdate['upobservation'].value = doc.data().observation;
                    overlayEdit.classList.add('active');
                    popupEdit.classList.add('active');
                    console.log(dev);
                    console.log(iddevice);
                });
            });
            const btnsDelete = document.querySelectorAll('.buton-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    iddevice = e.target.dataset.id;
                    overlayDelete.classList.add('active');
                    popupDelete.classList.add('active');
                });
            });
        });
    });
});*/

//cargar datos con realtime database

const databody = document.getElementById('loaddatos');
window.addEventListener('DOMContentLoaded', async (e) => {
    bd.ref('device/').on('value', function (snapshot) {
        databody.innerHTML = '';
        snapshot.forEach(function (childSnapshot) {
            var data = childSnapshot.val();
            data.key = childSnapshot.key;
            databody.innerHTML += `<tr>
                <th>${data.device}</th><th>${data.mac}</th><th>${data.observation}</th><th>${data.status}</th>
                <th><button data-key="${data.key}" class="box-buton buton-edit"><i class="fas fa-pen-square"></i> Editar</button>
                <button data-key="${data.key}" class="box-buton buton-delete"><i class="fas fa-trash"></i> Eliminar</button></th></tr>`;
            lastIdDevice = parseInt(data.key, 10);
            console.log(lastIdDevice);
            const btnsUpdate = document.querySelectorAll('.buton-edit');
            btnsUpdate.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    key = e.target.dataset.key;
                    bd.ref('device/' + key).once('value').then((snapshot) => { 
                        deviceFormUpdate['updevice'].value = snapshot.val().device;
                        deviceFormUpdate['upmac'].value = snapshot.val().mac;
                        deviceFormUpdate['upobservation'].value = snapshot.val().observation;
                    });
                    console.log(key);
                    overlayEdit.classList.add('active');
                    popupEdit.classList.add('active');
                });
            });
            const btnsDelete = document.querySelectorAll('.buton-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    key = e.target.dataset.key;
                    overlayDelete.classList.add('active');
                    popupDelete.classList.add('active');
                });
            });
        });
    });
});

//Gestion de modales
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

btnCerrarPopupDelete.addEventListener('click', function () {
    overlayDelete.classList.remove('active');
    popupDelete.classList.remove('active');
});




