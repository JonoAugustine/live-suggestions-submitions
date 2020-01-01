const path = require("path");
const feathers = require("@feathersjs/feathers");
const express = require("@feathersjs/express");
const socketio = require("@feathersjs/socketio");
const moment = require("moment");
const db = require("./db");

const PORT = process.env.PORT || 7000;

class IdeaService {
  constructor() {}

  async find() {
    return await db.Idea.find();
  }

  async create(data) {
    return await db.Idea.create({
      username: data.username,
      text: data.text
    });
  }
}

const server = express(feathers())
  // Parse body to JSON
  .use(express.json())
  // Config socket.io
  .configure(socketio())
  // Enable REST
  .configure(express.rest())
  // Register Services
  .use("/api/ideas", new IdeaService())
  // Serve Public
  .use(express.static(path.join(__dirname, "public")));

// New Connections connect to channel
server.on("connection", conn => server.channel("stream").join(conn));

// Publish events to channel
server.publish(data => server.channel("stream"));

const init = async () => {
  await db.dbConnect();

  server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
};

init();
