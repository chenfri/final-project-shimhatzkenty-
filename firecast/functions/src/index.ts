import * as functions from 'firebase-functions';


const admin = require("firebase-admin");
admin.initializeApp();

export const DeleteVolunteerUsers = functions.firestore
    .document("volunteerUsers/{userUID}")
    .onDelete((snap, context) => {
    console.log("context", context, "params", context.params)
    const { userUID } = context.params;
    admin
        .auth()
        .deleteUser(userUID)
        .then(() => console.log("deleted userID", userUID))
        //.catch(error => console.error("failed to delete userID ", userUID, "err", error));
});

export const DeleteElderlyUsers = functions.firestore
    .document("ElderlyUsers/{userUID}")
    .onDelete((snap, context) => {
    console.log("context", context, "params", context.params)
    const { userUID } = context.params;
    admin
        .auth()
        .deleteUser(userUID)
        .then(() => console.log("deleted userID", userUID))
        //.catch(error => console.error("failed to delete userID ", userUID, "err", error));
});