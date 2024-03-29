const express = require("express");
const bodyParser = require("body-parser");

const GCloudManager = require("./GCloudManager");
const router = require("./router");

const app = express();
const gcloudManager = new GCloudManager();

const NODE_ENV = process.env.NODE_ENV;
require("dotenv").config({ path: `./.env.${NODE_ENV}` });

const topicName = process.env.TOPIC_NAME;
const subscriptionName = process.env.SUBSCRIPTION_NAME;

gcloudManager.listenForMessages(
  topicName,
  subscriptionName,
  (message) => {
    console.log(`Received message: ${message.data.toString()}`);
    message.ack();
  },
  (error) => {
    console.error(`Received error: ${error.message}`);
  }
);

app.use(bodyParser.json());
app.use("/api", router);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

process.on("SIGINT", () => {
  gcloudManager.stopListening();
  process.exit();
});
