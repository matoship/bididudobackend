"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEventUpdate = exports.validateEventMember = void 0;
exports.validateEventEntry = validateEventEntry;
const eventsModels_1 = require("../models/eventsModels");
const MAX_DESCRIPTION_WORDS = 100;
/**
 * Validates the given EventEntry object for required fields, word count in the description,
 * correct date format, and checks if the start time is earlier than the end time.
 * Additional validation checks can be added as needed.
 *
 * @param {EventEntry} entry - The event entry object to validate. It should contain fields like
 *                             ownerId, title, description, startTime, endTime, and status.
 * @return {string[]} An array of error messages. If the array is empty, it means the entry passed all validations.
 */
function validateEventEntry(entry) {
    const errors = [];
    if (!entry.ownerId || !entry.title) {
        errors.push("Owner ID, and Title are required.");
    }
    const wordCount = entry.description.split(/\s+/).length;
    if (wordCount > MAX_DESCRIPTION_WORDS) {
        errors.push("Description exceeds word limit.");
    }
    const startTime = new Date(entry.startTime);
    const endTime = new Date(entry.endTime);
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        errors.push("Invalid date(s) provided.");
    }
    else if (entry.startTime >= entry.endTime) {
        errors.push("startTime must be earlier than endTime.");
    }
    if (!eventsModels_1.eventStatus.includes(entry.status)) {
        errors.push("Invalid stats provided");
    }
    // Add more field validations as needed and push errors
    return errors;
}
const validateEventMember = (member) => {
    const errors = [];
    // Validate event member fields (e.g., userId)
    if (!member.userId)
        errors.push("User ID is required.");
    // ... other validations
    return errors;
};
exports.validateEventMember = validateEventMember;
const validateEventUpdate = (updatedData) => {
    const errors = [];
    if (updatedData.title && updatedData.title.trim() === "") {
        errors.push("Event title cannot be empty.");
    }
    if (updatedData.description && updatedData.description.trim() === "") {
        errors.push("Event description cannot be empty.");
    }
    if (updatedData.startTime &&
        updatedData.endTime &&
        updatedData.startTime >= updatedData.endTime) {
        errors.push("Start time must be before end time.");
    }
    if (updatedData.status !== undefined &&
        !eventsModels_1.eventStatus.includes(updatedData.status)) {
        errors.push("Invalid event state.");
    }
    // Add any additional validations as per your requirements
    return errors;
};
exports.validateEventUpdate = validateEventUpdate;
//# sourceMappingURL=eventValidation.js.map