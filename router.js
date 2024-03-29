const express = require("express");
const gcloudController = require("./controller/gcloudController");

const router = express.Router();

/* Chatroom routes */
router.post("/chatroom", gcloudController.createChatroom);

router.post("/chatroom/:chatroomId/message", gcloudController.postMessage);

router.post(
  "/chatroom/:chatroomId/subscribe",
  gcloudController.subscribeToChatroom
);

router.get(
  "/chatroom/:chatroomId/messages",
  gcloudController.getChatroomMessages
);

module.exports = router;
