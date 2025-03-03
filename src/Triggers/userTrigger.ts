import { onUserCreated } from "firebase-functions/v2/auth"; // Use v2 auth trigger
import { logger } from "firebase-functions"; // Use logger from functions
import { UserRecord } from "firebase-admin/auth"; // Import UserRecord from firebase-admin
import { createUserProfile } from "../APIs/Users/user";

export const createUserProfileOnAuthSignUp = onUserCreated(async (event) => {
  const user: UserRecord = event.data; // Get user record
  const userId = user.uid;
  const userName = user.displayName || `user_${userId.slice(0, 8)}`;
  const icon = user.photoURL || "";

  if (!userId) {
    logger.error("User ID is missing");
    return;
  }

  try {
    await createUserProfile(userId, userName, icon);
    logger.info(`User profile created successfully for: ${userId}`);
  } catch (error) {
    logger.error("Error creating user profile for:", userId, error);
  }
});
