import * as functions from "firebase-functions";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import eventRouter from "./routes";
import { getAuth } from "firebase-admin/auth";
import { createUserProfileOnAuthSignUp } from "./Triggers/userTrigger";
import { config } from "dotenv";
import { analyzeText } from "./Deepseek/init";

config();

const app = express();
const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const headerToken = req.headers.authorization;
  if (!headerToken) {
    res.status(401).send("No token provided");
    return;
  }

  if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
    res.status(401).send("Invalid token");
    return;
  }

  const token = headerToken.split(" ")[1];
  try {
    await getAuth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        const uid = decodedToken.uid;
        if (typeof uid === "string") {
          req.user = uid;
          next();
        } else {
          res.status(401).send("Invalid token");
        }
      });
  } catch (err) {
    console.error(err);
    res.status(403).send("Unauthorized");
  }
};

app.use(cors({ origin: true }));
app.use(express.json());
app.use(authenticate);

// Existing API routes
app.use(eventRouter);

// DeepSeek 路由
app.post("/deepseek/analyze", async (req: Request, res: Response) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const result = await analyzeText(text); // 调用 DeepSeek 服务
    res.status(200).json(result);
  } catch (error) {
    console.error("DeepSeek API 调用失败:", error);
    res.status(500).json({ error: "Failed to call DeepSeek API" });
  }
});

exports.webhook = functions.https.onRequest((req, res) => {
  res.send("helloWorld");
});
exports.api = functions.https.onRequest(app);
exports.onUserCreation = createUserProfileOnAuthSignUp;
