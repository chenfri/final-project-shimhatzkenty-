"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
exports.DeleteVolunteerUsers = functions.firestore
    .document("volunteerUsers/{userUID}")
    .onDelete((snap, context) => {
    console.log("context", context, "params", context.params);
    const { userUID } = context.params;
    admin
        .auth()
        .deleteUser(userUID)
        .then(() => console.log("deleted userID", userUID));
    //.catch(error => console.error("failed to delete userID ", userUID, "err", error));
});
exports.DeleteElderlyUsers = functions.firestore
    .document("ElderlyUsers/{userUID}")
    .onDelete((snap, context) => {
    console.log("context", context, "params", context.params);
    const { userUID } = context.params;
    admin
        .auth()
        .deleteUser(userUID)
        .then(() => console.log("deleted userID", userUID));
    //.catch(error => console.error("failed to delete userID ", userUID, "err", error));
});
//# sourceMappingURL=index.js.map