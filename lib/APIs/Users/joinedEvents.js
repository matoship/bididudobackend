"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJoinedEvents = void 0;
const firebase_1 = require("../../config/firebase");
const getJoinedEvents = async (request, response) => {
    const userId = request.user;
    const statusFilter = request.query.status;
    // Check if statusFilter is a string or an array of strings
    let status;
    if (typeof statusFilter === "string") {
        status = [parseInt(statusFilter)];
    }
    else if (Array.isArray(statusFilter)) {
        status = statusFilter.map((state) => parseInt(state));
    }
    else {
        return response.status(400).send("Invalid status parameter format.");
    }
    try {
        // Query joined events with status in the specified array
        const querySnapshot = await firebase_1.db
            .collection("Users")
            .doc(userId)
            .collection("joinedEvents")
            .where("status", "in", status)
            .get();
        const joinedEvents = querySnapshot.docs.map((doc) => doc.data());
        response.status(200).send(joinedEvents);
        return;
    }
    catch (error) {
        response.status(500).send(error);
        return;
    }
};
exports.getJoinedEvents = getJoinedEvents;
//# sourceMappingURL=joinedEvents.js.map