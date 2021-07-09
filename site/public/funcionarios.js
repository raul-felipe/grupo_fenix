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

    //inicia instâncias do firebase a partir do cliente selecionado
    var usuarioFirebase = firebase.firestore().collection("usuario");
    var filaFirebase = firebase.firestore().collection("clientes").doc(cliente).collection("fila");
    var ambientesFirebase = firebase.firestore().collection("clientes").doc(cliente).collection("salas");

    var listaFila = [];

    //enviar os dados do gerente para o firebase
    $("#enviarGerente").click(async function () {

      $("#enviarGerente").empty();
      $("#enviarGerente").append('<div class="spinner-border"></div>');

      var nome = $("#nomeGestor").val();
      var cpf = $("#CPFGestor").val();
      var rg = $("#RGGestor").val();

      //insere lista vazia por padrão no firebase
      await filaFirebase.doc(cpf).set({
        salas: []
      });

      //insere a informação do novo gerente no firebase
      await usuarioFirebase.doc(cpf).set({
        nome: nome,
        cpf: cpf,
        rg: rg,
        ativo: true,
        tipo: 'gerencia',
        cliente: cliente
      });

      $("#enviarGerente").empty();
      $("#enviarGerente").append('Enviar');

      //recarrega a página
      alert("Dados salvos.");
      window.location.reload();

    });

    //enviar os dados dos funcionários para o firebase
    $("#enviarFuncionario").click(async function () {

      $("#enviarFuncionario").empty();
      $("#enviarFuncionario").append('<div class="spinner-border"></div>');

      //recebe valores dos campos de entrada para funcionarios em variaveis
      var nome = $("#nomeFuncionario").val();
      var cpfGestor = $("#CPFgerencia option:selected").attr('id');
      var cpf = $("#CPFFuncionario").val();
      var rg = $("#RGFuncionario").val();
      var fila = $("#fila").val();

      //recebe os dados da fila em array
      $('#listaFila').find('li').map(function () {
        var item = {};

        item.codigo = this.id;
        item.nome = $(this).text();
        item.limpo = false;
        item.relimpar = false;

        listaFila.push(item);
      });

      //insere a lista de fila no firebase
      await filaFirebase.doc(fila).set({
        salas: listaFila
      });

      //insere a informação do novo funcionario no firebase
      await usuarioFirebase.doc(cpf).set({
        nome: nome,
        cpf: cpf,
        cpf_gerente: cpfGestor,
        rg: rg,
        fila: fila,
        ativo: true,
        tipo: 'limpeza',
        cliente: cliente
      });

      $("#enviarFuncionario").empty();
      $("#enviarFuncionario").append('Enviar');

      //recarrega a página
      alert("Dados salvos.");
      window.location.reload();

    });

    //carrega relação usuário do firebase e apresenta na página
    $(document).ready(function () {
      usuarioFirebase.where("cliente", "==", cliente).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          $("#listaFuncionarios").append("<li class='list-group-item d-flex justify-content-between align-items-center'>" +
            "Nome: " + doc.data().nome +
            "<br>RG: " + doc.data().rg +
            "<br>CPF: " + doc.data().cpf +
            "<br>Cargo: " + doc.data().tipo +
            `<button class='btn' id="${doc.id}" fila="${doc.data().tipo == 'gerencia' ? doc.data().cpf : doc.data().fila}"><i class='fa fa-trash'></i></button></li>`)
        })
      })

      $("ul").on("click", "button", async function (e) {
        e.preventDefault();
        var id = $(this).attr('id');
        var fila = $(this).attr('fila');
        //deleta usuário e fila
        await usuarioFirebase.doc(id).delete();
        await filaFirebase.doc(fila).delete();
        alert("Dado deletado.")
        window.location.reload();

      });

    });

    //carrega a relação de ambientes do firebase e apresenta na parte de inclusão de funcionário
    $(document).ready(function () {
      ambientesFirebase.orderBy('class_name').get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          $("#listaSala").append(`<li class="list-group-item" id="${doc.id}">${doc.data().class_name}</li>`)
        })
      })
    });

    //carrega relação de gerentes do firebase e insere do droplist de gerentes para criação de usuário
    $(document).ready(function () {
      usuarioFirebase.where('tipo', '==', 'gerencia').get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          $("#CPFgerencia").append(`<option id="${doc.data().cpf}">${doc.data().nome}</option>`)
        })
      })
    });

    //realiza mudança de itens entre ambientes e fila
    $(function () {
      $("#listaFila, #listaSala").sortable({
        connectWith: "ul",
        placeholder: "placeholder",
        delay: 150,
        receive: function (event, ui) {
          if (event.target.id == 'listaSala') {
            console.log(event.target.lastChild.innerText);
            console.log(event.target.lastChild.id);
          } else {
            console.log(event.target.lastChild.innerText);
            console.log(event.target.lastChild.id);
          }
        }
      })
        .disableSelection()
        .dblclick(function (e) {
          var item = e.target;
          if (e.currentTarget.id === 'listaSala') {
            //move from all to user
            $(item).fadeOut('fast', function () {
              $(item).appendTo($('#listaFila')).fadeIn('slow');
            });
          } else {
            //move from user to all
            $(item).fadeOut('fast', function () {
              $(item).appendTo($('#listaSala')).fadeIn('slow');
            });
          }
        });
    });




  });