var admin = require("firebase-admin");

var serviceAccount = require("./service-account-file.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://magnetic-be10a-default-rtdb.firebaseio.com"
});


const auth = admin.auth();

export default auth;
