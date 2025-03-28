"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_1 = require("./APIs/Events/event");
const eventMember_1 = require("./APIs/Events/eventMember");
const user_1 = require("./APIs/Users/user");
const joinedEvents_1 = require("./APIs/Users/joinedEvents");
const init_1 = require("./Deepseek/init"); // 引入 DeepSeek 服务
// eslint-disable-next-line new-cap
const router = (0, express_1.Router)();
// 测试路由
router.get("/test", (req, res) => {
    res.status(200).send("Test route is working!");
});
// Event routes
router.post("/event", event_1.createEvent);
router.get("/event/:id", event_1.getEvent);
router.put("/event/:id", event_1.updateEvent);
router.delete("/event/:id", event_1.deleteEvent);
router.get("/allevents", event_1.getAllEvents);
// Event member routes
router.post("/event/:eventId/member", eventMember_1.addEventMember);
router.get("/event/:eventId/member", eventMember_1.getEventMembers);
router.post("/event/:eventId/updateMember", eventMember_1.updateEventMember);
router.delete("/event/:eventId/member/", eventMember_1.removeEventMember);
// User routes
router.post("/users", user_1.createUser);
router.get("/users/", user_1.getUser);
router.post("/users/update", user_1.updateUser);
router.delete("/users/", user_1.deleteUser);
router.get("/users/joinedEvents", joinedEvents_1.getJoinedEvents);
router.post("/deepseek/analyze", async (req, res) => {
    var _a, _b, _c, _d;
    try {
        const { text } = req.body;
        if (!text || typeof text !== "string") {
            return res.status(400).json({
                error: "Invalid request: 'text' must be a non-empty string",
            });
        }
        const result = await (0, init_1.analyzeText)(text);
        return res.status(200).json({ result });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        console.error("DeepSeek API Error:", error);
        // Handle different error types
        const statusCode = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 500;
        const message = ((_d = (_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.error) === null || _d === void 0 ? void 0 : _d.message) ||
            error.message ||
            "Failed to process request";
        return res.status(statusCode).json({ error: message });
    }
});
exports.default = router;
//# sourceMappingURL=routes.js.map