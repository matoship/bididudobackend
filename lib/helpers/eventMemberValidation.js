"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEventMemberStatus = void 0;
const eventsModels_1 = require("../models/eventsModels");
const validateEventMemberStatus = (status) => {
    const errors = [];
    if (status === undefined || status === null) {
        errors.push("Status field is required.");
    }
    else if (typeof status !== "number") {
        errors.push("Status must be a number.");
    }
    else if (!eventsModels_1.eventMemberStatus.includes(status)) {
        errors.push("wrong status");
    }
    // Additional validation logic can be added here
    return errors;
};
exports.validateEventMemberStatus = validateEventMemberStatus;
//# sourceMappingURL=eventMemberValidation.js.map