import { ServiceEnvironment } from "@shared/constants/backend";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import {
  addCreateAccountRoute,
  addLoginRoute,
  addRefreshTokensRoute,
} from "./controllers/loginController";
import { addUserLastActionRoute } from "./controllers/userController";
import { ServiceLayer } from "./services/serviceLayer";
import http from "http";
import { Server } from "socket.io";
import { secureEndpointMiddleware } from "./middlewares/secureEndpoints";

dotenv.config();

const SERVER_IP = process.env.SERVER_IP;
const SERVER_PORT = process.env.SERVER_PORT;
const CORS_CLIENT_ORIGIN = `${process.env.CLIENT_IP}:${process.env.DOCKER_CLIENT_PORT_FORWARD}`;
console.log(`Server ${SERVER_IP}:${SERVER_PORT}`);
console.log(`Socket IO Cors Allowing: ${CORS_CLIENT_ORIGIN}`);

const serviceLayer = new ServiceLayer(ServiceEnvironment.Test);
const serverApp = express();
serverApp.use(bodyParser.json()); // Allows to parse POST body
serverApp.use(bodyParser.urlencoded({ extended: true }));
serverApp.use(cors());

serverApp.get("/health", async (req, res) => {
  console.log("Health Check");
  res.send("ok:" + process.env.NODE_ENV);
});

// Route that does not need the access token
addLoginRoute(serverApp, serviceLayer);
addCreateAccountRoute(serverApp, serviceLayer);
addRefreshTokensRoute(serverApp, serviceLayer);

// Route that must be secured with an access token
serverApp.use(secureEndpointMiddleware(serviceLayer));
addUserLastActionRoute(serverApp, serviceLayer);

const server = http.createServer(serverApp);
const io = new Server(server, {
  cors: {
    //origin: `http://${CORS_CLIENT_ORIGIN}`,
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

io.on("connect_error", function (e) {
  console.log("connect_error", e);
});

server.listen(SERVER_PORT, () =>
  console.log(`Web Server Listening on IP ${SERVER_IP} and PORT ${SERVER_PORT}`)
);
