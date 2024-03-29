const GCloudManager = require("../GCloudManager");
const fs = require("fs");
const path = require("path");

const gcloudManager = new GCloudManager();

function readDb() {
  const dbPath = path.join(__dirname, "../data/db.json");
  const dbJson = fs.readFileSync(dbPath);
  return JSON.parse(dbJson);
}

function writeDb(db) {
  const dbPath = path.join(__dirname, "../data/db.json");
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

exports.createChatroom = (req, res) => {
  const { roomName, userId } = req.body;

  const db = readDb();

  const newChatroomId = `chatroom${Math.random().toString(36).substr(2, 9)}`;
  const newChatroom = { id: newChatroomId, roomName };
  db.chatrooms.push(newChatroom);
  db.subscriptions.push({
    id: db.subscriptions.length + 1,
    userId,
    chatroomId: newChatroomId,
  });

  writeDb(db);

  res.json({
    message: "Chatroom created successfully",
    chatroomId: newChatroomId,
  });
};

exports.postMessage = (req, res) => {
  const { userId, text } = req.body;
  const { chatroomId } = req.params;

  const db = readDb();

  const subscription = db.subscriptions.find(
    (sub) => sub.userId === userId && sub.chatroomId === chatroomId
  );
  if (!subscription) {
    return res
      .status(403)
      .json({ message: "User is not subscribed to this chatroom." });
  }

  const newMessage = {
    id: db.messages.length + 1,
    userId,
    chatroomId,
    text,
    timestamp: new Date().toISOString(),
  };

  db.messages.push(newMessage);

  writeDb(db);

  res.json({
    message: "Message posted successfully",
    messageId: newMessage.id,
  });
};

exports.subscribeToChatroom = (req, res) => {
  const userId = parseInt(req.body.userId, 10);
  const { chatroomId } = req.params;

  const db = readDb();

  const alreadySubscribed = db.subscriptions.some(
    (sub) => sub.userId === userId && sub.chatroomId === chatroomId
  );
  if (alreadySubscribed) {
    return res
      .status(400)
      .json({ message: "User is already subscribed to this chatroom." });
  }

  const newSubscription = {
    id: db.subscriptions.length + 1,
    userId,
    chatroomId,
  };
  db.subscriptions.push(newSubscription);

  writeDb(db);

  res.json({ message: "Subscription successful" });
};

exports.getChatroomMessages = (req, res) => {
  const { userId } = req.body;
  const { chatroomId } = req.params;

  const db = readDb();

  console.log(`UserId: ${userId}, ChatroomId: ${chatroomId}`);
  const isSubscribed = db.subscriptions.some(
    (sub) => sub.userId === userId && sub.chatroomId === chatroomId
  );
  console.log(`Is Subscribed: ${isSubscribed}`);
  if (!isSubscribed) {
    return res
      .status(403)
      .json({ message: "User is not subscribed to this chatroom." });
  }

  const messages = db.messages.filter(
    (message) => message.chatroomId === chatroomId
  );

  res.json({ messages });
};
