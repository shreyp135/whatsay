import express from "express";
import authMiddleware from "../utils/auth_middleware.js";
import { getChatrooms, getMessages, createChatroom, deleteChatroom, getChatroomInfo, getAdminChatrooms, editChatroom } from "../controllers/chatroom_controllers.js";

const router = express.Router();

router.get("/", getChatrooms);
router.get("/admin", authMiddleware, getAdminChatrooms);
router.get("/:chatroomId/chats", authMiddleware, getMessages);
router.get("/:chatroomId", authMiddleware, getChatroomInfo);
router.post("/", authMiddleware, createChatroom);
router.delete("/:chatroomId", authMiddleware, deleteChatroom);
router.put("/:chatroomId",authMiddleware, editChatroom);
// router.patch("/:chatroomId/mute", authMiddleware, muteChatroom);

export default router;

