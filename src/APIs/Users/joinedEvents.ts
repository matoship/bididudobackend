import { db } from "../../config/firebase";
import { Request, Response } from "express";

export const getJoinedEvents = async (request: Request, response: Response) => {
  const userId = request.user as string;
  const statusFilter = request.query.status;

  // Check if statusFilter is a string or an array of strings
  let status: number[];
  if (typeof statusFilter === "string") {
    status = [parseInt(statusFilter)];
  } else if (Array.isArray(statusFilter)) {
    status = statusFilter.map((state) => parseInt(state as string));
  } else {
    return response.status(400).send("Invalid status parameter format.");
  }

  try {
    // Query joined events with status in the specified array
    const querySnapshot = await db
      .collection("Users")
      .doc(userId)
      .collection("joinedEvents")
      .where("status", "in", status)
      .get();

    const joinedEvents = querySnapshot.docs.map((doc) => doc.data());
    response.status(200).send(joinedEvents);
    return;
  } catch (error) {
    response.status(500).send(error);
    return;
  }
};
