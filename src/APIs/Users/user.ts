import { UserEntry, UserSchema } from "../../models/usersModels";
import { db } from "../../config/firebase";
import { Request, Response } from "express";
import { error } from "firebase-functions/logger";

export const createUser = async (request: Request, response: Response) => {
  const { userName, icon }: UserEntry = request.body;
  const userId = request.user as string; // Assuming userId is a string and directly accessible

  try {
    await createUserProfile(userId, userName, icon);
    response.status(200).send({ message: "User created successfully" });
  } catch (error) {
    response.status(500).send(error);
  }
};

// UserSchema should be defined as per your existing schema
export const createUserProfile = async (
  userId: string,
  userName: string,
  icon: string,
) => {
  try {
    const userRef = db.collection("Users").doc(userId);
    const doc = await userRef.get();

    if (doc.exists) {
      throw error("User profile already exists:", userId);
    } else {
      const newUser = {
        userName,
        icon,
        Exp: 0,
        status: 0,
      };

      await userRef.set(newUser);
      console.log("User profile created successfully:", userId);
    }
  } catch (error) {
    console.error("Error accessing the database:", error);
    throw error; // Rethrow the error for the caller to handle
  }
};

export const getUser = async (request: Request, response: Response) => {
  const userId = request.user as string; // Use userId from request.user
  try {
    const userDoc = await db.collection("Users").doc(userId).get();

    if (!userDoc.exists) {
      response.status(404).send("User not found");
    } else {
      response.status(200).send(userDoc.data());
    }
  } catch (error) {
    response.status(500).send(error);
  }
};

export const updateUser = async (request: Request, response: Response) => {
  const userId = request.user as string; // Use userId from request.user
  const updatedData: Partial<UserSchema> = request.body;

  try {
    await db.collection("Users").doc(userId).update(updatedData);
    response.status(200).send("User updated successfully");
  } catch (error) {
    response.status(500).send(error);
  }
};

//  need to delete user info on firebase as well
export const deleteUser = async (request: Request, response: Response) => {
  const userId = request.user as string; // Use userId from request.user

  try {
    await db.collection("Users").doc(userId).delete();
    response.status(200).send("User deleted successfully");
  } catch (error) {
    response.status(500).send(error);
  }
};

// get other user info.
