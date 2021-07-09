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

    var historico = {data:[]};
    var a = [];

    $('#enviar').click(async function () {
        var historicoFirebase = firebase.firestore().collection("clientes").doc(cliente).collection("historico");
        var collection = await historicoFirebase.get();
        collection.forEach(function (doc) {
            a.push([
                doc.data()["checked_at"].toLocaleDateString("pt-BR"),
                doc.data()["cleaner_images"],
                doc.data()["date"].toLocaleDateString("pt-BR"),
                doc.data()["definitions"],
                doc.data()["finish_at"].toLocaleDateString("pt-BR"),
                doc.data()["id"],
                doc.data()["last_user"],
                doc.data()["manager_images"],
                doc.data()["manager_obs"],
                doc.data()["start_at"].toLocaleDateString("pt-BR")
            ])


            historico['data'].push(doc.data());
        });
        console.log(a);
        $("#table").DataTable({
            data: a,
            columns:[
                {title:"checked_at"},
                {title:"cleaner_images"},
                {title:"date"},
                {title:"definitions"},
                {title:"finish_at"},
                {title:"id"},
                {title:"last_user"},
                {title:"manager_images"},
                {title:"manager_obs"},
                {title:"start_at"}
            ]
            // data: historico,
            // "columns": [
            //     { "data": "checked_at" },
            //     { "data": "id" },
            //     { "data": "last_user" },
            //     { "data": "start_at" }
            // ]
        });
    });
});