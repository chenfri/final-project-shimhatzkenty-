const functions = require('firebase-functions');
const admin = require("firebase-admin");
const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY = ""
sgMail.setApiKey(SENDGRID_API_KEY);

const twilio = require('twilio');
const accountSid = ""
const authToken = ""
const twilioNumber = '' // your twilio phone number
const client = new twilio(accountSid, authToken);

admin.initializeApp();


// Sends sms via HTTP - twilio
exports.sendSms = functions.https.onCall(async(data, context) => {
    const textMessage = {
        body: data.msg,
        to: data.number,
        messagingServiceSid: ''
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