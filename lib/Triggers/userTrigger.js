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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserProfileOnAuthSignUp = void 0;
const functions = __importStar(require("firebase-functions/v1")); // Use Firebase Functions v1
const admin = __importStar(require("firebase-admin")); // Firebase Admin SDK
const user_1 = require("../APIs/Users/user"); // Your custom function
// Initialize Firebase Admin if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}
exports.createUserProfileOnAuthSignUp = functions.auth
    .user()
    .onCreate(async (user) => {
    const userId = user.uid;
    const userName = user.displayName || `user_${userId.slice(0, 8)}`;
    const icon = user.photoURL || "";
    if (!userId) {
        functions.logger.error("User ID is missing");
        return;
    }
    try {
        await (0, user_1.createUserProfile)(userId, userName, icon);
        functions.logger.info(`User profile created successfully for: ${userId}`);
    }
    catch (error) {
        functions.logger.error(`Error creating user profile for ${userId}:`, error);
    }
});
//# sourceMappingURL=userTrigger.js.map