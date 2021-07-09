//import * as firebase from "firebase/app";

firebase.initializeApp({
    apiKey: "AIzaSyASUtfJNgxsPYzDSz1xz0KtKEhlUs-zinY",
    authDomain: "cleanmanager-11e08.firebaseapp.com",
    databaseURL: "https://cleanmanager-11e08.firebaseio.com",
    projectId: "cleanmanager-11e08",
    storageBucket: "cleanmanager-11e08.appspot.com",
    messagingSenderId: "501601425155"
});

var clienteFirebase = firebase.firestore().collection("clientes");

$(document).ready(function () {
    if (sessionStorage.getItem('cpf') == null)
        window.open("login.html", "_self")
    else {
        $(document).ready(function () {
            clienteFirebase.get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    $("#cliente").append(`<option id="${doc.id}">${doc.data().nome}</option>`)
                })
            })
        });
    }
});

$('#cliente').change(function () {
    var cliente = $("#cliente option:selected").attr('id');

    $('#enviar').click(function () {
        var filaFirebase = firebase.firestore().collection("clientes").doc(cliente).collection("fila");
        var ambientesFirebase = firebase.firestore().collection("clientes").doc(cliente).collection("salas");
        var batchAmbientesRef = firebase.firestore().batch();
        var batchFilaRef = firebase.firestore().batch();

        //Reseta todos ambientes do firebase como sujos
        ambientesFirebase.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                var ambiente = doc.data();
                Object.keys(doc.data()["definitions"]).forEach(function (k) {
                    ambiente["definitions"][k] = { appropriate: false }
                });
                batchAmbientesRef.set(ambientesFirebase.doc(doc.id), ambiente);
            });
        }).then(function () {
            batchAmbientesRef.commit().then(() => alert("Dados salvos!"));
        });

        filaFirebase.get().then(function(querySnapshot){
            querySnapshot.forEach(function (doc) {
                var salas = doc.data()["salas"];
                if(salas[0]!=null && salas[0]["fila"]!=null){//se possui o campo fila é pq se refere a uma fila de gerencia
                    batchFilaRef.set(filaFirebase.doc(doc.id), {salas:[]})
                }
                else{
                    for(i = 0;i<salas.length;i++){//se não, se refere a funcionario da limpeza
                        salas[i]["limpo"]=false;
                        salas[i]["relimpar"]=false;
                    }
                    batchFilaRef.set(filaFirebase.doc(doc.id), {salas:salas})
                }
            });
        }).then(function(){
            batchFilaRef.commit().then(() => alert("Dados salvos!"));
        });
    });

});