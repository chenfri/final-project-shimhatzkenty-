const functions = require('firebase-functions');
const admin = require("firebase-admin");
const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = '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'
sgMail.setApiKey(SENDGRID_API_KEY);

admin.initializeApp();


exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});



exports.DeleteVolunteerUsers = functions.firestore
    .document("volunteerUsers/{userUID}")
    .onDelete((snap, context) => {
        console.log("context", context, "params", context.params);
        const { userUID } = context.params;
        admin
            .auth()
            .deleteUser(userUID)
            .then(() => console.log("deleted userID", userUID))
            .catch(error => console.error("failed to delete userID ", userUID, "err", error));
    });


exports.DeleteElderlyUsers = functions.firestore
    .document("ElderlyUsers/{userUID}")
    .onDelete((snap, context) => {
        console.log("context", context, "params", context.params);
        const { userUID } = context.params;
        admin
            .auth()
            .deleteUser(userUID)
            .then(() => console.log("deleted userID", userUID))
            .catch(error => console.error("failed to delete userID ", userUID, "err", error));
    });




exports.firestoreEmail = functions.firestore.document('volunteerUsers/{userUID}')
    .onCreate(event => {
        const userUID = event.params
        const db = admin.firestore()
        return db.collection("volunteerUsers").doc("" + userUID).get()
            .then(doc => {
                console.log(doc.data());
                const msg = {
                    to: 'chenfriedman93@gmail.com',
                    from: 'simhatzkenty@gmail.com',
                    subject: 'test',
                    text: 'test',
                    html: '<strong>and easy to do anywhere, even with Node.js</strong>'
                };
                return sgMail.send(msg).then(
                    console.log('Message sent')
                ).catch((error) => {
                    console.log(error.response.body)
                        // console.log(error.response.body.errors[0].message)
                })
            })
            .then(console.log("the msg is send")).catch(err => { console.log(err) })
    })