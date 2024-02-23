const { port, env, isAppSocketIOEnable } = require("./src/config/vars.js");
const app = require("./src/config/express.js");
const socket = require("./src/config/socket.js");
const mongoose = require("./src/config/mongoose.js");
// Open mongoose connection
mongoose.connect();

// Listen to requests
const server = isAppSocketIOEnable ? socket : app;
server.listen(port, () =>
  console.log("⚙️  Server is running on port: " + port)
);
