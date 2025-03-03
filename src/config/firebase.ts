import * as admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";

admin.initializeApp({
  credential: applicationDefault(),
  storageBucket: "project-julius.appspot.com",
});

const db = admin.firestore();
const bucket = admin.storage();

export { admin, db, bucket };
