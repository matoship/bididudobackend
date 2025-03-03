"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserUpdate = exports.validateUserCreation = void 0;
const validateUserCreation = (user) => {
    const errors = [];
    if (!user.userName) {
        errors.push("Username is required.");
    }
    // Add more validations as needed, e.g., format of userName, icon URL validity, etc.
    return errors;
};
exports.validateUserCreation = validateUserCreation;
const validateUserUpdate = (user) => {
    const errors = [];
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
exports.validateUserUpdate = validateUserUpdate;
// Helper function to validate icon URL
const isValidIconUrl = (url) => {
    const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|svg|gif))$/i;
    return urlRegex.test(url);
};
//# sourceMappingURL=userValidation.js.map