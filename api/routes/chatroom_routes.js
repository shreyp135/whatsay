import express from "express";
import authMiddleware from "../middlewares/auth_middleware.js";
import { getChatrooms, getMessages, createChatroom, deleteChatroom, muteChatroom } from "../controllers/chatroom_controllers.js";

const router = express.Router();

router.get("/", authMiddleware, getChatrooms);
router.get("/:chatroomId", authMiddleware, getMessages);
router.post("/", authMiddleware, createChatroom);
router.delete("/:chatroomId", authMiddleware, deleteChatroom);
router.patch("/:chatroomId/mute", authMiddleware, muteChatroom);

export default router;

