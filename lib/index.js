"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = __importStar(require("firebase-functions"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const auth_1 = require("firebase-admin/auth");
const userTrigger_1 = require("./Triggers/userTrigger");
const dotenv_1 = require("dotenv");
const init_1 = require("./DeepSeek/init");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const authenticate = async (req, res, next) => {
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
        await (0, auth_1.getAuth)()
            .verifyIdToken(token)
            .then((decodedToken) => {
            const uid = decodedToken.uid;
            if (typeof uid === "string") {
                req.user = uid;
                next();
            }
            else {
                res.status(401).send("Invalid token");
            }
        });
    }
    catch (err) {
        console.error(err);
        res.status(403).send("Unauthorized");
    }
};
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.json());
app.use(authenticate);
// Existing API routes
app.use(routes_1.default);
// DeepSeek 路由
app.post("/deepseek/analyze", async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }
    try {
        const result = await (0, init_1.analyzeText)(text); // 调用 DeepSeek 服务
        res.status(200).json(result);
    }
    catch (error) {
        console.error("DeepSeek API 调用失败:", error);
        res.status(500).json({ error: "Failed to call DeepSeek API" });
    }
});
exports.webhook = functions.https.onRequest((req, res) => {
    res.send("helloWorld");
});
exports.api = functions.https.onRequest(app);
exports.onUserCreation = userTrigger_1.createUserProfileOnAuthSignUp;
//# sourceMappingURL=index.js.map