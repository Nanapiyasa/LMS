const admin = require("firebase-admin");
const serviceAccount = require("./firebaseServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nanapiyasa-dfe8b-default-rtdb.asia-southeast1.firebasedatabase.app/"
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
