import { Request, Response } from "express";
import { db } from "../../config/firebase";
import { EventMember } from "../../models/eventsModels";
import { validateEventMemberStatus } from "../../helpers/eventMemberValidation";

export const addEventMember = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const eventId = request.params.eventId;
  const userId = request.user as string;

  try {
    const eventRef = db.collection("Events").doc(eventId);
    const eventDoc = await eventRef.get();
    // Check if the event exists
    if (!eventDoc.exists) {
      response.status(404).send("Event not found");
    }
    await addMember(userId, eventId);
    response
      .status(200)
      .send("Member added to event and user's joined events successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      response.status(500).send(error.message);
    } else {
      console.log("An unknown error occurred");
      response.status(500).send("An unknown error occurred");
    }
  }
};

export const addMember = async (userId: string, eventId: string) => {
  const memberData: EventMember = { userId: userId, status: 0 };
  await db.runTransaction(async (transaction) => {
    const userRef = db.collection("Users").doc(userId);
    const eventMemberRef = db
      .collection("Events")
      .doc(eventId)
      .collection("eventMembers")
      .doc(userId);
    const userJoinedEventRef = db
      .collection("Users")
      .doc(userId)
      .collection("joinedEvents")
      .doc(eventId);

    // Check for existing user
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists) {
      throw new Error("User does not exist.");
    }

    // Check for existing event member to avoid repetition
    const eventMemberDoc = await transaction.get(eventMemberRef);
    if (eventMemberDoc.exists) {
      throw new Error("Member already exists in this event.");
    }

    // Add member to eventMembers sub-collection
    transaction.set(eventMemberRef, memberData);

    // Update user's joinedEvents sub-collection
    const joinedEventData = {
      eventid: eventId,
      status: memberData.status,
      joinedTime: new Date(),
    };
    transaction.set(userJoinedEventRef, joinedEventData);
  });
};

export const getEventMembers = async (request: Request, response: Response) => {
  const eventId = request.params.eventId;

  try {
    const querySnapshot = await db
      .collection("Events")
      .doc(eventId)
      .collection("eventMembers")
      .where("status", "!=", -1)
      .get();

    const members = querySnapshot.docs.map((doc) => doc.data());
    response.status(200).send(members);
  } catch (error) {
    response.status(500).send(error);
  }
};

export const updateEventMember = async (
  request: Request,
  response: Response,
) => {
  const eventId = request.params.eventId;
  const userId = request.user as string;
  const { status } = request.body; // Extract only the 'status' field

  const validationErrors = validateEventMemberStatus(status);
  if (validationErrors.length > 0) {
    return response.status(400).send({ errors: validationErrors });
  }

  try {
    const eventRef = db.collection("Events").doc(eventId);
    const eventDoc = await eventRef.get();

    // Check if the event exists
    if (!eventDoc.exists) {
      return response.status(404).send("Event not found");
    }

    await db.runTransaction(async (transaction) => {
      const eventMemberRef = eventRef.collection("eventMembers").doc(userId);
      const userJoinedEventRef = db
        .collection("Users")
        .doc(userId)
        .collection("joinedEvents")
        .doc(eventId);

      // Update status in eventMembers sub-collection
      transaction.update(eventMemberRef, { status });

      // Update status in user's joinedEvents sub-collection
      transaction.update(userJoinedEventRef, { status: status });
    });

    response
      .status(200)
      .send(
        "Member status updated successfully in both event and user collections.",
      );
    return;
  } catch (error) {
    // Assuming error is an instance of Error
    response.status(500).send(error);
    return;
  }
};

export const removeEventMember = async (
  request: Request,
  response: Response,
) => {
  const eventId = request.params.eventId;
  const userId = request.user as string;

  try {
    const memberRef = db
      .collection("Events")
      .doc(eventId)
      .collection("eventMembers")
      .doc(userId);
    await memberRef.delete();
    response.status(200).send("Member removed from event successfully");
  } catch (error) {
    response.status(500).send(error);
  }
};
