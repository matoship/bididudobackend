"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.createUserProfile = exports.createUser = void 0;
const firebase_1 = require("../../config/firebase");
const logger_1 = require("firebase-functions/logger");
const createUser = async (request, response) => {
    const { userName, icon } = request.body;
    const userId = request.user; // Assuming userId is a string and directly accessible
    try {
        await (0, exports.createUserProfile)(userId, userName, icon);
        response.status(200).send({ message: "User created successfully" });
    }
    catch (error) {
        response.status(500).send(error);
    }
};
exports.createUser = createUser;
// UserSchema should be defined as per your existing schema
const createUserProfile = async (userId, userName, icon) => {
    try {
        const userRef = firebase_1.db.collection("Users").doc(userId);
        const doc = await userRef.get();
        if (doc.exists) {
            throw (0, logger_1.error)("User profile already exists:", userId);
        }
        else {
            const newUser = {
                userName,
                icon,
                Exp: 0,
                status: 0,
            };
            await userRef.set(newUser);
            console.log("User profile created successfully:", userId);
        }
    }
    catch (error) {
        console.error("Error accessing the database:", error);
        throw error; // Rethrow the error for the caller to handle
    }
};
exports.createUserProfile = createUserProfile;
const getUser = async (request, response) => {
    const userId = request.user; // Use userId from request.user
    try {
        const userDoc = await firebase_1.db.collection("Users").doc(userId).get();
        if (!userDoc.exists) {
            response.status(404).send("User not found");
        }
        else {
            response.status(200).send(userDoc.data());
        }
    }
    catch (error) {
        response.status(500).send(error);
    }
};
exports.getUser = getUser;
const updateUser = async (request, response) => {
    const userId = request.user; // Use userId from request.user
    const updatedData = request.body;
    try {
        await firebase_1.db.collection("Users").doc(userId).update(updatedData);
        response.status(200).send("User updated successfully");
    }
    catch (error) {
        response.status(500).send(error);
    }
};
exports.updateUser = updateUser;
//  need to delete user info on firebase as well
const deleteUser = async (request, response) => {
    const userId = request.user; // Use userId from request.user
    try {
        await firebase_1.db.collection("Users").doc(userId).delete();
        response.status(200).send("User deleted successfully");
    }
    catch (error) {
        response.status(500).send(error);
    }
};
exports.deleteUser = deleteUser;
// get other user info.
//# sourceMappingURL=user.js.map