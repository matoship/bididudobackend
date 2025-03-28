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
interface AnalyzeRequest {
  text: string;
}
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

router.post("/deepseek/analyze", async (req, res) => {
  try {
    const { text } = req.body as AnalyzeRequest;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        error: "Invalid request: 'text' must be a non-empty string",
      });
    }

    const result = await analyzeText(text);
    return res.status(200).json({ result });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("DeepSeek API Error:", error);

    // Handle different error types
    const statusCode = error.response?.status || 500;
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      "Failed to process request";

    return res.status(statusCode).json({ error: message });
  }
});

export default router;
