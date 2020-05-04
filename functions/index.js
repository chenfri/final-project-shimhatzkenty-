const functions = require('firebase-functions');
const admin = require("firebase-admin");
const sgMail = require('@sendgrid/mail');
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const SENDGRID_API_KEY = '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'
sgMail.setApiKey(SENDGRID_API_KEY);

admin.initializeApp();

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


// Sends email via HTTP. Can be called from frontend code. 
exports.sendEmail = functions.https.onCall(async(data, context) => {
    const msg = {
        to: 'chenfriedman93@gmail.com',
        from: 'simhatzkenty@gmail.com',
        subject: "Hello from",
        text: "Hi,\n Test email from simhatZkenty"
    };

    await sgMail.send(msg);

    // Handle errors here
    return { success: true };
});



exports.sendemailByGmail = functions.https.onCall(async(data, context) => {
    const OAuth2 = google.auth.OAuth2;
    const APP_NAME = "simhatzkenty";
    const clientID = "534888552279-829o84v2d5pe05m7gvo6odavc78q10o1.apps.googleusercontent.com"
    const clientSecret = "qwSLbhjHbt9f-paXrg4_IXYq"
    const refreshToken = "1//04uzt9y6T3R8zCgYIARAAGAQSNwF-L9IrjK6Sn6dZw_VJkIZSUd3vWvDNUWbWgStx9W8mSX7Uqgo81Ppn8dJnppHJTNrLSRCL91U"

    // Checking attribute.`
    if (!(typeof data.text === "string") || data.text.length === 0) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError(
            "invalid-argument",
            "The function must be called with one arguments containing the message text to add."
        );
    }
    // // Checking that the user is authenticated.
    // if (!context.auth) {
    //   // Throwing an HttpsError so that the client gets the error details.
    //   throw new functions.https.HttpsError(
    //     "failed-precondition",
    //     "The function must be called while authenticated."
    //   );
    // }
    const oauth2Client = new OAuth2(
        clientID, //client Id
        clientSecret, // Client Secret
        "https://developers.google.com/oauthplayground" // Redirect URL
    );

    oauth2Client.setCredentials({
        refresh_token: refreshToken
    });
    const tokens = await oauth2Client.refreshAccessToken();
    const accessToken = tokens.credentials.access_token;

    const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "chenfriedman93@gmail.com",
            clientId: clientID,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            accessToken: accessToken
        }
    });
    const mailOptions = {
        from: "chenfriedman93@gmail.com",
        to: "chenfriedman93@gmail.com", //sending to email IDs in app request, please check README.md
        subject: "Hello from",
        text: "Hi,\n Test email from "
    };

    return smtpTransport.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error.message);
                smtpTransport.close();
            }

        }).then(() => {
            return res.status(200).send({
                data: {
                    code: 200,
                    message: "Mail sent"
                }
            });
        })
        .catch(e => {
            res.status(500).send({
                error: {
                    code: 500,
                    message: e.toString()
                }
            });
        });

})


// ---------------------------  not in used -------------------------------
// exports.DeleteElderlyUsers = functions.firestore
//     .document("ElderlyUsers/{userUID}")
//     .onDelete((snap, context) => {
//         console.log("context", context, "params", context.params);
//         const { userUID } = context.params;
//         admin
//             .auth()
//             .deleteUser(userUID)
//             .then(() => console.log("deleted userID", userUID))
//             .catch(error => console.error("failed to delete userID ", userUID, "err", error));
//     });




// exports.firestoreEmail = functions.firestore.document('volunteerUsers/{userUID}')
//     .onCreate(event => {
//         const userUID = event.params
//         const db = admin.firestore()
//         return db.collection("volunteerUsers").doc("" + userUID).get()
//             .then(doc => {
//                 console.log(doc.data());
//                 const msg = {
//                     to: 'chenfriedman93@gmail.com',
//                     from: 'simhatzkenty@gmail.com',
//                     subject: 'test',
//                     text: 'test',
//                     html: '<strong>שלום, נמצאה לך התאמה!</strong>'
//                 };
//                 return sgMail.send(msg).then(
//                     console.log('Message sent')
//                 ).catch((error) => {
//                     console.log(error.response.body)
//                         // console.log(error.response.body.errors[0].message)
//                 })
//             })
//             .then(console.log("the msg is send")).catch(err => { console.log(err) })
//     })