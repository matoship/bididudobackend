import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import eventRouter from "./routes";
// import { getAuth } from "firebase-admin/auth";
import { createUserProfileOnAuthSignUp } from "./Triggers/userTrigger";
import { config } from "dotenv";
config({ path: ".env" });

const app = express();
// const authenticate = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> => {
//   const headerToken = req.headers.authorization;
//   if (!headerToken) {
//     res.status(401).send("No token provided");
//     return;
//   }

//   if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
//     res.status(401).send("Invalid token");
//     return;
//   }

//   const token = headerToken.split(" ")[1];
//   try {
//     await getAuth()
//       .verifyIdToken(token)
//       .then((decodedToken) => {
//         const uid = decodedToken.uid;
//         if (typeof uid === "string") {
//           req.user = uid;
//           next();
//         } else {
//           res.status(401).send("Invalid token");
//         }
//       });
//   } catch (err) {
//     console.error(err);
//     res.status(403).send("Unauthorized");
//   }
// };

app.use(cors({ origin: true }));
app.use(express.json());
// app.use(authenticate);

// Existing API routes
app.use(eventRouter);

exports.webhook = functions.https.onRequest((req, res) => {
  res.send("helloWorld");
});
exports.api = functions.https.onRequest(app);
exports.onUserCreation = createUserProfileOnAuthSignUp;
