
const btnmiinfo = document.getElementById('abririformacion');
btnmiinfo.addEventListener('click', function () {
    location.replace('../Pages/Terap-miinfo.html');
});

const btnprescrip = document.getElementById('abrirpreescripciones');
btnprescrip.addEventListener('click', function () {
    location.replace('../terapeuta.html');
});

const btnpaciente = document.getElementById('abrirpaciente');
btnpaciente.addEventListener('click', function () {
    location.replace('../Pages/Terap-paciente.html');
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


function getUser() {
    eliminarFila();
    let arrayKeysUser = [];
    let objStructura;
    var user = firebase.auth().currentUser;
    var f = user.uid;
    let mac = document.getElementById("txtMac").value;
    bd.ref('datos/recordatorios/' + mac).once('value').then((snapshot) => {
        objStructura = (snapshot.val());
        arrayKeysUser = Object.keys(objStructura);
        console.log(arrayKeysUser.length);
        console.log(snapshot.val());
        for (let i = 0; i < arrayKeysUser.length; i++) {
            getRecordatorios(mac, arrayKeysUser[i], i);
        }
        
    });
}
;

function getPrescription() {
    var data;
    var fecha;
    var dataF;
    eliminarFila();
    let arrayH = [];
    let objStructura;
    let arrayHF = [];
    let objStructuraF;
    bd.ref('prescription/').on('value', function (snapshot) {
        console.log(snapshot.val());
        snapshot.forEach(function (childSnapshot) {
            console.log(childSnapshot.val());
            data = childSnapshot.val();
            objStructura = (data.Header);
            console.log(objStructura);
            arrayH = Object.keys(objStructura);
            data.key = childSnapshot.key;
            a = objStructura;
            if (data.therapistemail === u.email) {
                for (var clave in a){
                  if (a.hasOwnProperty(clave)) {
                    console.log("La clave es " + clave);
                    for(var clave1 in a[clave]){
                      if (a.hasOwnProperty(clave)) {
                        console.log("La clave es " + clave1+ " y el valor es " + a[clave][clave1]); 
                        $("#contentTable > tbody").append('<tr><th scope="row">' + clave + '</th><td>'+data.iduser + '</td><td>' + data.iddevice + '</td><td>' + data.status + '</td><td>' + a[clave][clave1] + '</td></tr>');
                      }
                    }
                  }
                }
        }
    });
});
};


function getQueryVariable(variable) {
        // Estoy asumiendo que query es window.location.search.substring(1);
        //var query = "product_id=32&cat_id=1&sessionid=123";
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0; i < vars.length; i++) {
            var pair = vars[i].split("="); 
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return false;
    }

function getPrescriptionFiltrado() {
    var filtro = getQueryVariable('filtrar');
        
    if(filtro){
        console.log(filtro);
        var data;
        var fecha;
        var dataF;
        eliminarFila();
        let arrayH = [];
        let objStructura;
        let arrayHF = [];
        let objStructuraF;
        bd.ref('prescription/').on('value', function (snapshot) {
            console.log(snapshot.val());
            snapshot.forEach(function (childSnapshot) {
                console.log(childSnapshot.val());
                data = childSnapshot.val();
                objStructura = (data.Header);
                console.log(objStructura);
                arrayH = Object.keys(objStructura);
                data.key = childSnapshot.key;
                a = objStructura;
                if (data.therapistemail === u.email) {
                    for (var clave in a){
                      if (a.hasOwnProperty(clave)) {
                        console.log("La clave es " + clave);
                        var cl= ''+clave;
                        console.log(cl+'resCL');
                        console.log(filtro+'resFiltro');
                        if(cl === filtro){
                            for(var clave1 in a[clave]){
                            if (a.hasOwnProperty(clave)) {
                              console.log("La clave es " + clave1+ " y el valor es " + a[clave][clave1]); 
                              $("#contentTable > tbody").append('<tr><th scope="row">' + clave + '</th><td>'+data.iduser + '</td><td>' + data.iddevice + '</td><td>' + data.status + '</td><td>' + a[clave][clave1] + '</td></tr>');
                            }
                          }
                        }
                        
                      }
                    }

    //                for (var i = 0; i < arrayH.length; i++) {
    //                    fecha=arrayH[i];
    //                    console.log(objStructura);
    //                    
    //                    
    //                    bd.ref('prescription/' + data.key + '/' + "Header/"+fecha).once('value').then((snapshot) => {
    //                        snapshot.forEach(function (childSnapshot) {
    //                        var dataF = childSnapshot.val();
    //                        objStructuraF = (dataF);
    //                        arrayHF = Object.keys(objStructuraF);
    //                        dataF.key = childSnapshot.key;
    //                        $("#contentTable > tbody").append('<tr><th scope="row">' + fecha + '</th><td>'+data.iduser + '</td><td>' + data.iddevice + '</td><td>' + data.status + '</td><td>' + dataF + '</td></tr>');
    //                        });
    //                });
    //                //(data.Header).forEach(getHeader());
    //            };
            }
        });
    });
    }else{
        console.log('No hay Parametros');
        getPrescription();
    }
    
};



function getHeader(item){
    console.log(item);
};


function eliminarFila() {
    $('#contentTable tbody tr').remove();
}
;

function getPDF() {
    const invoice = this.document.getElementById("invoice");
    console.log(invoice);
    console.log(window);
    html2pdf().from(invoice).save();
}
;
