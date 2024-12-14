import express from "express";
import authMiddleware from "../utils/auth_middleware.js";
import { getChatrooms, getMessages, createChatroom, deleteChatroom, getChatroomInfo, muteChatroom, getUserChatrooms, getAdminChatrooms, editChatroom } from "../controllers/chatroom_controllers.js";

const router = express.Router();

router.get("/", authMiddleware, getChatrooms);
router.get("/userChatrooms", authMiddleware, getUserChatrooms);
router.get("/admin", authMiddleware, getAdminChatrooms);
router.get("/:chatroomId/chats", authMiddleware, getMessages);
router.get("/:chatroomId", authMiddleware, getChatroomInfo);
router.post("/", authMiddleware, createChatroom);
router.delete("/:chatroomId", authMiddleware, deleteChatroom);
router.put("/:chatroomId",authMiddleware, editChatroom);
// router.patch("/:chatroomId/mute", authMiddleware, muteChatroom);

export default router;

