// userValidation.ts
import { UserEntry, UserSchema } from "../models/usersModels";

export const validateUserCreation = (user: UserEntry): string[] => {
  const errors: string[] = [];

  if (!user.userName) {
    errors.push("Username is required.");
  }
  // Add more validations as needed, e.g., format of userName, icon URL validity, etc.
  return errors;
};

export const validateUserUpdate = (user: Partial<UserSchema>): string[] => {
  const errors: string[] = [];

  // Validate fields only if they are present in the update object
  if (user.userName && user.userName.trim() === "") {
    errors.push("Username cannot be empty.");
  }
  if (user.icon && !isValidIconUrl(user.icon)) {
    errors.push("Invalid icon URL.");
  }
  // Add more update-specific validations as needed

  return errors;
};

// Helper function to validate icon URL
const isValidIconUrl = (url: string): boolean => {
  const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|svg|gif))$/i;
  return urlRegex.test(url);
};
