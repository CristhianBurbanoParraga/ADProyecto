
var btnAbrirPopup = document.getElementById("btn-abrir-popup"),
        infofilter = document.getElementById('infofilter'),
        btnCerrarPopup = document.getElementById('btn-cerrar-popup'),
        btnabririnfocontact = document.getElementById('btn-abrir-popup-contact'),
        infocontact = document.getElementById('infoContac'),
        btncerrarinfocontact = document.getElementById('btn-cerrar-popup-contact'),
        btnabririnfologin = document.getElementById('btn-abrir-popup-login'),
        infologin = document.getElementById('infologin'),
        btncerrarlogin = document.getElementById('btn-cerrar-popup-login');

btnAbrirPopup.addEventListener('click', function() {
    infofilter.classList.add('active');
});

btnCerrarPopup.addEventListener('click', function() {
    infofilter.classList.remove('active');
});

btnabririnfocontact.addEventListener('click', function () {
    infocontact.classList.add('active');
});

btncerrarinfocontact.addEventListener('click', function () {
    infocontact.classList.remove('active');
});

btnabririnfologin.addEventListener('click', function () {
    infologin.classList.add('active');
});

btncerrarlogin.addEventListener('click', function () {
    infologin.classList.remove('active');
});

