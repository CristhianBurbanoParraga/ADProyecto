
const btndispositivo = document.getElementById('abrirdispositivo');
btndispositivo.addEventListener('click', function () {
    location.replace('../Admin.html');
});

const btnmiinfo = document.getElementById('abririformacion');
btnmiinfo.addEventListener('click', function () {
    location.replace('../Pages/Admin-miinfo.html');
});

const btnterapeuta = document.getElementById('abrirterapeuta');
btnterapeuta.addEventListener('click', function () {
    location.replace('../Pages/Admin-terapeuta.html');
});

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

var t = 0;
var p =0;
let arrayHF = [];
var oilCanvas = document.getElementById("oilChart");

Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 18;

var oilData = '';
    


function getUser(){ 
    var data;
    bd.ref('usuario/').on('value', function (snapshot) {
        console.log(snapshot.val());
        snapshot.forEach(function (childSnapshot) {
            console.log(childSnapshot.val());
            data = childSnapshot.val();
            data.key = childSnapshot.key;
            if (data.role === "P") {
                p=p+1;
            }
            if (data.role === "T") {
                t=t+1;
            }
            });
            oilData = {
    labels: [
        "Terapeutas",
        "Pacientes",
    ],
    datasets: [
        {
            data: [t, p],
            backgroundColor: [
                "#FF6384",
                "#6384FF"
            ]
        }]
};  
            Grafica();
});
};
window.onload=getUser;


function Grafica(){
var pieChart = new Chart(oilCanvas, {
  type: 'pie',
  data: oilData
});
};