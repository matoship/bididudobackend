import * as functions from "firebase-functions/v1"; // Use Firebase Functions v1
import * as admin from "firebase-admin"; // Firebase Admin SDK
import { UserRecord } from "firebase-admin/auth"; // UserRecord type
import { createUserProfile } from "../APIs/Users/user"; // Your custom function

// Initialize Firebase Admin if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const createUserProfileOnAuthSignUp = functions.auth
  .user()
  .onCreate(async (user: UserRecord) => {
    const userId = user.uid;
    const userName = user.displayName || `user_${userId.slice(0, 8)}`;
    const icon = user.photoURL || "";

    if (!userId) {
      functions.logger.error("User ID is missing");
      return;
    }

    try {
      await createUserProfile(userId, userName, icon);
      functions.logger.info(`User profile created successfully for: ${userId}`);
    } catch (error) {
      functions.logger.error(
        `Error creating user profile for ${userId}:`,
        error,
      );
    }
  });
