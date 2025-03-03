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
// DeepSeek 路由
router.post("/deepseek/analyze", async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }
    try {
        const result = await (0, init_1.analyzeText)(text); // 调用 DeepSeek 服务
        res.status(200).json(result);
    }
    catch (error) {
        console.error("DeepSeek API 调用失败:", error);
        res.status(500).json({ error: "Failed to call DeepSeek API" });
    }
});
exports.default = router;
//# sourceMappingURL=routes.js.map