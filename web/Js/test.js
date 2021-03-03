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
        arrayH = Object.keys(objStructura);
        data.key = childSnapshot.key;
        if (data.therapistemail === u.email) {
            for (var i = 0; i < arrayH.length; i++) {
                fecha = arrayH[i];
                bd.ref('prescription/' + data.key + '/' + "Header/" + fecha).once('value').then((snapshot) => {
                    snapshot.forEach(function (childSnapshot) {
                        var dataF = childSnapshot.val();
                        objStructuraF = (dataF);
                        arrayHF = Object.keys(objStructuraF);
                        dataF.key = childSnapshot.key;
                        $("#contentTable > tbody").append('<tr><th scope="row">' + fecha + '</th><td>' + data.iduser + '</td><td>' + data.iddevice + '</td><td>' + data.status + '</td><td>' + dataF + '</td></tr>');
                    });
                });
                //(data.Header).forEach(getHeader());
            }
        }
    });
});
