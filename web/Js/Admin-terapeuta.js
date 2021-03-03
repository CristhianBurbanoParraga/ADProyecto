
//Abrir otras paginas
const btndispositivo = document.getElementById('abrirdispositivo');
btndispositivo.addEventListener('click', function () {
    location.replace('../Admin.html');
});

const btnmiinfo = document.getElementById('abririformacion');
btnmiinfo.addEventListener('click', function () {
    location.replace('../Pages/Admin-miinfo.html');
});

const btnreporte = document.getElementById('abrirreporte');
btnreporte.addEventListener('click', function () {
    location.replace('../Pages/Admin-reporte.html');
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

//comprobar estado de la autenticacion
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Estado de Autenticacion: True");
    } else {
        console.log("Estado de Autenticacion: False");
    }
});

//Agregar datos realtime database
const saveTerapeuta = (address, birthdate, cid, email, lastnames, names, phone) => 
bd.ref('usuario/' + cid).set({
    address: address,
    birthdate: birthdate,
    cid: cid,
    email: email,
    lastnames: lastnames,
    names: names,
    password: sha1(cid),
    phone: phone,
    role: "T"
}, (error) => {
  if (error) {
        alert('Error al guardar los datos');
  }});
const terapForm = document.getElementById('terap-form');
terapForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cid = document.getElementById('identificacion');
    const names = document.getElementById('nombres');
    const lastnames = document.getElementById('apellidos');
    const birhtdate = document.getElementById('fehanacimiento');
    const address = document.getElementById('direccion');
    const email = document.getElementById('email');
    const phone = document.getElementById('telefono');
    await saveTerapeuta(address.value, birhtdate.value.toString(), cid.value, email.value, lastnames.value, names.value, phone.value);
    auth.createUserWithEmailAndPassword(email.value, sha1(cid.value)).then((user) => {
        terapForm.reset(); 
    });
    cid.focus();
    overlay.classList.remove('active');
    popup.classList.remove('active');
});

let key = '';

//Modificar datos
const updateTerapeuta = (key, cid, address, birthdate, lastnames, names, phone) => 
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
}});
var overlayEdit = document.getElementById('overlayedit'),
        popupEdit = document.getElementById('popupedit'),
        btnCerrarPopupEdit = document.getElementById('btn-cerrar-popupedit');
const terapFormEdit = document.getElementById('terap-form-edit');
const btnupdate = document.getElementById('updateterapeuta');
btnupdate.addEventListener('click', async (e) => {
    e.preventDefault();
    const cid = document.getElementById('upidentificacion');
    const names = document.getElementById('upnombres');
    const lastnames = document.getElementById('upapellidos');
    const birthdate = document.getElementById('upfehanacimiento');
    const address = document.getElementById('updireccion');
    const phone = document.getElementById('uptelefono');
    await updateTerapeuta(key ,cid.value, address.value, birthdate.value.toString(), lastnames.value, names.value, phone.value);
    key = '';
    overlayEdit.classList.remove('active');
    popupEdit.classList.remove('active');
});

//borrar datos
const deleteTerapeuta = (key) => bd.ref('usuario/' + key).remove();
var overlayDelete = document.getElementById('overlaydelete'),
        popupDelete = document.getElementById('popupdelete'),
        btnCerrarPopupDelete = document.getElementById('btn-cerrar-popupdelete');
const btndelete = document.getElementById('deleteterapeuta');
btndelete.addEventListener('click', async (e) => {
    await deleteTerapeuta(key);
    key = '';
    overlayDelete.classList.remove('active');
    popupDelete.classList.remove('active');
});

//cargar datos de terapeutas
const databody = document.getElementById('loaddatos');
window.addEventListener('DOMContentLoaded', function () {
    bd.ref('usuario/').on('value', function (snapshot) {
        databody.innerHTML = '';
        snapshot.forEach(function (childSnapshot) {
            var data = childSnapshot.val();
            data.key = childSnapshot.key;
            if(data.role === "T") {
            databody.innerHTML += `<tr>
                    <th>${data.cid}</th><th>${data.names} ${data.lastnames}</th><th>${data.address}</th><th>${data.phone}</th><th>${data.birthdate}</th><th>${data.email}</th>
                    <th><button data-key="${data.key}" class="box-buton buton-edit"><i class="fas fa-pen-square"></i> Editar</button>
                    <button data-key="${data.key}" class="box-buton buton-delete"><i class="fas fa-trash"></i> Eliminar</button></th></tr>`; }
            const btnsUpdate = document.querySelectorAll('.buton-edit');
            btnsUpdate.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    key = e.target.dataset.key;
                    bd.ref('usuario/' + key).once('value').then((snapshot) => {
                        terapFormEdit['updireccion'].value = snapshot.val().address;
                        terapFormEdit['upidentificacion'].value = snapshot.val().cid;
                        terapFormEdit['upfehanacimiento'].value = snapshot.val().birthdate;
                        terapFormEdit['upapellidos'].value = snapshot.val().lastnames;
                        terapFormEdit['upnombres'].value = snapshot.val().names;
                        terapFormEdit['uptelefono'].value = snapshot.val().phone;
                    });
                    console.log(key);
                    overlayEdit.classList.add('active');
                    popupEdit.classList.add('active');
                });
            });
            const btnsDelete = document.querySelectorAll('.buton-delete');
            btnsDelete.forEach(btn => {
               btn.addEventListener('click', async (e) => {
                   key = e.target.dataset.key;
                   overlayDelete.classList.add('active');
                   popupDelete.classList.add('active');
               }); 
            });
        });
    });
});

//gestion de modales
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
