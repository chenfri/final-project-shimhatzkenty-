const event = require('ionic-angular')
const matchingFunct = require('../src/pages/Admin/adminPage.ts');
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY = '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'
sgMail.setApiKey(SENDGRID_API_KEY);
const Nexmo = require('nexmo');
const twilio = require('twilio');
const accountSid = "ACb4e106132670f6e4725890c1ba32dfff"
const authToken = "f6170502a3d62f931877ca00df67bccd"
const twilioNumber = '+12057518750' // your twilio phone number
const client = new twilio(accountSid, authToken);

admin.initializeApp();


// Sends sms via HTTP - twilio
exports.sendSms = functions.https.onCall(async(data, context) => {
    const textMessage = {
        body: "שלום " + data.name + ",\nנמצאה לך התאמה באתר שמחקת זקנתי!\nלפרטים נוספים יש להיכנס לאתר ולבצע התחברות עם כתובת מייל וסיסמה\nhttps://simhat-zkenty.firebaseapp.com\n\nצוות שמחת זקנתי",
        to: data.number,
        messagingServiceSid: 'MG605bbded57aace4b0b015499f114831a'
            //from: twilioNumber // From a valid Twilio number
    }
    return client.messages.create(textMessage).then(message => console.log(message.sid, 'success'))
        .catch(err => console.log(err))
})



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


// Sends email via HTTP - sendgrid
exports.sendEmail = functions.https.onCall(async(data, context) => {
    const msg = {
        to: data.email,
        from: 'simhatzkenty@gmail.com',
        subject: data.subject,
        text: data.text
    };
    await sgMail.send(msg);
    // Handle errors here
    return { success: true };
});




exports.RunMatching = functions.https.onCall(async(data, context) => {
    return event.publish('operateFunc', "1")
});



// ---------------------------  not in used -------------------------------

//exports.sendSms1 = functions.https.onCall(async(data, context) => {
//     const nexmo = new Nexmo({
//         apiKey: '9dc6bd99',
//         apiSecret: 'LhxXPSk3X75Ea6Z7',
//     });

//     const from = 'simhat zkenty';
//     const to = '972508591865';
//     const text = 'Hello test';

//     nexmo.message.sendSms(from, to, text);
// })



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