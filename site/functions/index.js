// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

exports.filaAlterada = functions.firestore
    .document('/clientes/{313025750001492}/fila/{fila}')
    .onUpdate(async function(change, context) {
      var cpf = change.after.id;
      var salas = change.after.data().salas;
      
      if(salas.length==0 || salas[0]['fila']!=null){

        var usuario = await admin.firestore().collection("usuario").doc(cpf).get();
        functions.logger.log(cpf);
        functions.logger.log(salas);
        functions.logger.log(usuario.data()['tokens']);
      
        await admin.messaging().sendToDevice(
          usuario.data()['tokens'], // ['token_1', 'token_2', ...]
          {
            data: {
              message: "Sua fila sofreu alteração recentemente."
            },
          },
          {
            // Required for background/quit data-only messages on iOS
            // contentAvailable: true,
            // Required for background/quit data-only messages on Android
            priority: "high",
          }
        ).then(function(res){
          functions.logger.log(res);
        });
      }

    });
