import { db } from "../../config/firebase";
import { EventEntry } from "../../models/eventsModels";
import {
  validateEventEntry,
  validateEventUpdate,
} from "../../helpers/eventValidation";
import { Request, Response } from "express";
import {
  Query,
  DocumentData,
  CollectionReference,
} from "firebase-admin/firestore";
import { addMember } from "./eventMember";

export const createEvent = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const { entryData }: { entryData: EventEntry } = request.body;

  // Validate event entry
  const entryErrors = validateEventEntry(entryData);
  // const { ownerId } = entryData;
  const userId = request.user as string;
  if (entryErrors.length > 0) {
    response.status(400).send({ errors: entryErrors });
  }

  // Proceed with Firestore operations
  const eventRef = db.collection("Events").doc(); // Generate a new document ID
  const eventId = eventRef.id; // Store the auto-generated ID

  const batch = db.batch();
  batch.set(eventRef, { ...entryData, id: eventId }); // Include the ID in the document

  try {
    await batch.commit();
    await addMember(userId, eventId);
    response
      .status(200)
      .send({ message: "Event created successfully", eventId: eventId });
  } catch (error) {
    response.status(500).send(error);
  }
};

export const getEvent = async (request: Request, response: Response) => {
  const eventId = request.params.id;

  try {
    const eventDoc = await db.collection("Events").doc(eventId).get();
    if (!eventDoc.exists) {
      response.status(404).send("Event not found");
    } else {
      response.status(200).send(eventDoc.data());
    }
  } catch (error) {
    response.status(500).send(error);
  }
};

export const getAllEvents = async (request: Request, response: Response) => {
  try {
    let query: Query<DocumentData> | CollectionReference<DocumentData> =
      db.collection("Events");

    // List of valid query parameters based on EventQuery type
    const validQueryParams = [
      "requireApplication",
      "isVirtual",
      "allowJoinMidGame",
      "checkInType",
      "headCount",
      "allowMinimumStart",
      "minStartHeadCount",
      "currentParticipant",
      "startTime",
      "endTime",
      "status",
    ];

    // Dynamically add query conditions based on request query parameters
    Object.entries(request.query).forEach(([key, value]) => {
      if (validQueryParams.includes(key) && value !== undefined) {
        // Convert value to appropriate type if necessary
        const queryValue = value;
        query = query.where(key, "==", queryValue);
      }
    });

    // Execute the query and return only event IDs
    const querySnapshot = await query.get();
    const eventIds = querySnapshot.docs.map((doc) => doc.id);

    response.status(200).send(eventIds);
  } catch (error) {
    response.status(500).send("Error fetching event IDs");
  }
};

export const updateEvent = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const eventId = request.params.id;
  const updatedData: Partial<EventEntry> = request.body;

  const validationErrors = validateEventUpdate(updatedData);
  if (validationErrors.length > 0) {
    response.status(400).send({ errors: validationErrors });
  }

  try {
    const eventRef = db.collection("Events").doc(eventId);
    const doc = await eventRef.get();
    if (!doc.exists) {
      response.status(404).send("Event not found");
    } else {
      await eventRef.update(updatedData);
      response.status(200).send("Event updated successfully");
    }
  } catch (error) {
    response.status(500).send(error);
    return;
  }
};

export const deleteEvent = async (request: Request, response: Response) => {
  const eventId = request.params.id;

  try {
    // Step 1: Delete the event from all users' joinedEvents
    const usersSnapshot = await db
      .collectionGroup("joinedEvents")
      .where("eventid", "==", eventId)
      .get();
    const batch = db.batch();

    usersSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Commit the batch operation
    await batch.commit();

    // Step 2: Delete the event and its subcollections
    // You might need to handle the deletion of other subcollections of the event here
    const eventRef = db.collection("Events").doc(eventId);
    await deleteSubcollections(eventRef); // Assuming you have a function to delete subcollections
    await eventRef.delete();

    response.status(200).send("Event and associated data deleted successfully");
  } catch (error) {
    response.status(500).send(error);
  }
};

const deleteSubcollections = async (
  eventRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
) => {
  // Define an array of subcollection names to delete
  const subcollections = ["eventMembers"]; // Add other subcollection names as needed

  for (const subcollection of subcollections) {
    const snapshot = await eventRef.collection(subcollection).get();
    snapshot.docs.forEach((doc) => {
      eventRef.collection(subcollection).doc(doc.id).delete();
    });
  }
};
