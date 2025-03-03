"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.getAllEvents = exports.getEvent = exports.createEvent = void 0;
const firebase_1 = require("../../config/firebase");
const eventValidation_1 = require("../../helpers/eventValidation");
const eventMember_1 = require("./eventMember");
const createEvent = async (request, response) => {
    const { entryData } = request.body;
    // Validate event entry
    const entryErrors = (0, eventValidation_1.validateEventEntry)(entryData);
    // const { ownerId } = entryData;
    const userId = request.user;
    if (entryErrors.length > 0) {
        response.status(400).send({ errors: entryErrors });
    }
    // Proceed with Firestore operations
    const eventRef = firebase_1.db.collection("Events").doc(); // Generate a new document ID
    const eventId = eventRef.id; // Store the auto-generated ID
    const batch = firebase_1.db.batch();
    batch.set(eventRef, Object.assign(Object.assign({}, entryData), { id: eventId })); // Include the ID in the document
    try {
        await batch.commit();
        await (0, eventMember_1.addMember)(userId, eventId);
        response
            .status(200)
            .send({ message: "Event created successfully", eventId: eventId });
    }
    catch (error) {
        response.status(500).send(error);
    }
};
exports.createEvent = createEvent;
const getEvent = async (request, response) => {
    const eventId = request.params.id;
    try {
        const eventDoc = await firebase_1.db.collection("Events").doc(eventId).get();
        if (!eventDoc.exists) {
            response.status(404).send("Event not found");
        }
        else {
            response.status(200).send(eventDoc.data());
        }
    }
    catch (error) {
        response.status(500).send(error);
    }
};
exports.getEvent = getEvent;
const getAllEvents = async (request, response) => {
    try {
        let query = firebase_1.db.collection("Events");
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
    }
    catch (error) {
        response.status(500).send("Error fetching event IDs");
    }
};
exports.getAllEvents = getAllEvents;
const updateEvent = async (request, response) => {
    const eventId = request.params.id;
    const updatedData = request.body;
    const validationErrors = (0, eventValidation_1.validateEventUpdate)(updatedData);
    if (validationErrors.length > 0) {
        response.status(400).send({ errors: validationErrors });
    }
    try {
        const eventRef = firebase_1.db.collection("Events").doc(eventId);
        const doc = await eventRef.get();
        if (!doc.exists) {
            response.status(404).send("Event not found");
        }
        else {
            await eventRef.update(updatedData);
            response.status(200).send("Event updated successfully");
        }
    }
    catch (error) {
        response.status(500).send(error);
        return;
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (request, response) => {
    const eventId = request.params.id;
    try {
        // Step 1: Delete the event from all users' joinedEvents
        const usersSnapshot = await firebase_1.db
            .collectionGroup("joinedEvents")
            .where("eventid", "==", eventId)
            .get();
        const batch = firebase_1.db.batch();
        usersSnapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });
        // Commit the batch operation
        await batch.commit();
        // Step 2: Delete the event and its subcollections
        // You might need to handle the deletion of other subcollections of the event here
        const eventRef = firebase_1.db.collection("Events").doc(eventId);
        await deleteSubcollections(eventRef); // Assuming you have a function to delete subcollections
        await eventRef.delete();
        response.status(200).send("Event and associated data deleted successfully");
    }
    catch (error) {
        response.status(500).send(error);
    }
};
exports.deleteEvent = deleteEvent;
const deleteSubcollections = async (eventRef) => {
    // Define an array of subcollection names to delete
    const subcollections = ["eventMembers"]; // Add other subcollection names as needed
    for (const subcollection of subcollections) {
        const snapshot = await eventRef.collection(subcollection).get();
        snapshot.docs.forEach((doc) => {
            eventRef.collection(subcollection).doc(doc.id).delete();
        });
    }
};
//# sourceMappingURL=event.js.map