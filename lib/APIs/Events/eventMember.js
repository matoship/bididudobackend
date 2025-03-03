"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeEventMember = exports.updateEventMember = exports.getEventMembers = exports.addMember = exports.addEventMember = void 0;
const firebase_1 = require("../../config/firebase");
const eventMemberValidation_1 = require("../../helpers/eventMemberValidation");
const addEventMember = async (request, response) => {
    const eventId = request.params.eventId;
    const userId = request.user;
    try {
        const eventRef = firebase_1.db.collection("Events").doc(eventId);
        const eventDoc = await eventRef.get();
        // Check if the event exists
        if (!eventDoc.exists) {
            response.status(404).send("Event not found");
        }
        await (0, exports.addMember)(userId, eventId);
        response
            .status(200)
            .send("Member added to event and user's joined events successfully");
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            response.status(500).send(error.message);
        }
        else {
            console.log("An unknown error occurred");
            response.status(500).send("An unknown error occurred");
        }
    }
};
exports.addEventMember = addEventMember;
const addMember = async (userId, eventId) => {
    const memberData = { userId: userId, status: 0 };
    await firebase_1.db.runTransaction(async (transaction) => {
        const userRef = firebase_1.db.collection("Users").doc(userId);
        const eventMemberRef = firebase_1.db
            .collection("Events")
            .doc(eventId)
            .collection("eventMembers")
            .doc(userId);
        const userJoinedEventRef = firebase_1.db
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
exports.addMember = addMember;
const getEventMembers = async (request, response) => {
    const eventId = request.params.eventId;
    try {
        const querySnapshot = await firebase_1.db
            .collection("Events")
            .doc(eventId)
            .collection("eventMembers")
            .where("status", "!=", -1)
            .get();
        const members = querySnapshot.docs.map((doc) => doc.data());
        response.status(200).send(members);
    }
    catch (error) {
        response.status(500).send(error);
    }
};
exports.getEventMembers = getEventMembers;
const updateEventMember = async (request, response) => {
    const eventId = request.params.eventId;
    const userId = request.user;
    const { status } = request.body; // Extract only the 'status' field
    const validationErrors = (0, eventMemberValidation_1.validateEventMemberStatus)(status);
    if (validationErrors.length > 0) {
        return response.status(400).send({ errors: validationErrors });
    }
    try {
        const eventRef = firebase_1.db.collection("Events").doc(eventId);
        const eventDoc = await eventRef.get();
        // Check if the event exists
        if (!eventDoc.exists) {
            return response.status(404).send("Event not found");
        }
        await firebase_1.db.runTransaction(async (transaction) => {
            const eventMemberRef = eventRef.collection("eventMembers").doc(userId);
            const userJoinedEventRef = firebase_1.db
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
            .send("Member status updated successfully in both event and user collections.");
        return;
    }
    catch (error) {
        // Assuming error is an instance of Error
        response.status(500).send(error);
        return;
    }
};
exports.updateEventMember = updateEventMember;
const removeEventMember = async (request, response) => {
    const eventId = request.params.eventId;
    const userId = request.user;
    try {
        const memberRef = firebase_1.db
            .collection("Events")
            .doc(eventId)
            .collection("eventMembers")
            .doc(userId);
        await memberRef.delete();
        response.status(200).send("Member removed from event successfully");
    }
    catch (error) {
        response.status(500).send(error);
    }
};
exports.removeEventMember = removeEventMember;
//# sourceMappingURL=eventMember.js.map