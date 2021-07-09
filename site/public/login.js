//import * as firebase from "firebase/app";

firebase.initializeApp({
    apiKey: "AIzaSyASUtfJNgxsPYzDSz1xz0KtKEhlUs-zinY",
    authDomain: "cleanmanager-11e08.firebaseapp.com",
    databaseURL: "https://cleanmanager-11e08.firebaseio.com",
    projectId: "cleanmanager-11e08",
    storageBucket: "cleanmanager-11e08.appspot.com",
    messagingSenderId: "501601425155"
});

var admin = firebase.firestore().collection("admin");

$( document ).ready(function() {
    if(sessionStorage.getItem('cpf')!=null)
        window.open("index.html", "_self")
});

$("#entrarbtn").click(function () {
    var cpf = $("#cpf").val();
    var senha = $("#senha").val();
    admin.doc(cpf).get().then(function(doc){
        if(doc.exists && doc.data()['password']==senha){
            sessionStorage.setItem('cpf',cpf);
            sessionStorage.setItem('senha',senha);
            window.open("index.html", "_self")
        }
        else{
            alert("Verifique suas credenciais e tente novamente");
        }
    })
});
