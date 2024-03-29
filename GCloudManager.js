const { PubSub } = require("@google-cloud/pubsub");

class GCloudManager {
  constructor() {
    this.pubsub = new PubSub({
      projectId: process.env.PROJECT_ID,
      keyFilename: "./data/leprojetsubv-03afe917999e.json",
    });
  }

  async publishMessage(topicName, message) {
    const dataBuffer = Buffer.from(message);
    try {
      const messageId = await this.pubSubClient
        .topic(topicName)
        .publish(dataBuffer);
      console.log(`Message ${messageId} published.`);
    } catch (error) {
      console.error(`Error publishing message to topic ${topicName}`, error);
    }
  }
}

module.exports = GCloudManager;
