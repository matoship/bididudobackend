import { Router } from "express";
import {
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
} from "./APIs/Events/event";
import {
  addEventMember,
  getEventMembers,
  updateEventMember,
  removeEventMember,
} from "./APIs/Events/eventMember";
import { createUser, getUser, updateUser, deleteUser } from "./APIs/Users/user";
import { getJoinedEvents } from "./APIs/Users/joinedEvents";
import { analyzeText } from "./Deepseek/init"; // 引入 DeepSeek 服务

// eslint-disable-next-line new-cap
const router = Router();

// 测试路由
router.get("/test", (req, res) => {
  res.status(200).send("Test route is working!");
});

// Event routes
router.post("/event", createEvent);
router.get("/event/:id", getEvent);
router.put("/event/:id", updateEvent);
router.delete("/event/:id", deleteEvent);
router.get("/allevents", getAllEvents);

// Event member routes
router.post("/event/:eventId/member", addEventMember);
router.get("/event/:eventId/member", getEventMembers);
router.post("/event/:eventId/updateMember", updateEventMember);
router.delete("/event/:eventId/member/", removeEventMember);

// User routes
router.post("/users", createUser);
router.get("/users/", getUser);
router.post("/users/update", updateUser);
router.delete("/users/", deleteUser);
router.get("/users/joinedEvents", getJoinedEvents);

// DeepSeek 路由
router.post("/deepseek/analyze", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const result = await analyzeText(text); // 调用 DeepSeek 服务
    res.status(200).json(result);
  } catch (error) {
    console.error("DeepSeek API 调用失败:", error);
    res.status(500).json({ error: "Failed to call DeepSeek API" });
  }
});

export default router;
