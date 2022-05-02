import { ServiceEnvironment } from "@shared/constants/backend";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import {
  addCreateAccountRoute,
  addLoginRoute,
  addLogoutRoute,
  addRefreshTokensRoute,
} from "./controllers/loginController";
import { addUserLastActionRoute } from "./controllers/userController";
import { ServiceLayer } from "./services/serviceLayer";
import http from "http";
import { Server } from "socket.io";
import { secureEndpointMiddleware } from "./middlewares/secureEndpoints";
import {
  MsgBroadcastNewPixel,
  MsgBroadcastNewPixelKind,
  MsgError,
  MsgErrorKind,
  MsgUserPixel,
  MsgUserPixelKind,
  MsgUserPixelValidation,
  MsgUserPixelValidationKind,
} from "@shared/models/socketMessages";
import { buildLastActionResponse } from "./builders/userBuilders";
import { isNextActionReadyForUser, secondsUntilNextAction } from "@shared/logics/time";
import { Tile } from "@shared/models/game";
import { addAllTilesRoute } from "./controllers/gameController";

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
addAllTilesRoute(serverApp, serviceLayer);

// Route that must be secured with an access token
serverApp.use(secureEndpointMiddleware(serviceLayer));
addLogoutRoute(serverApp, serviceLayer);
addUserLastActionRoute(serverApp, serviceLayer);

serverApp.use((err: any, req: any, res: any, next: any) => {
  console.error("ERROR ENDPOINT", err.stack);
  res.status(500).send("Something broke!");
});
const server = http.createServer(serverApp);
const io = new Server(server, {
  cors: {
    //origin: `http://${CORS_CLIENT_ORIGIN}`,
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
  socket.on(MsgUserPixelKind, async (msg: MsgUserPixel) => {
    console.log("user pixel", msg);
    try {
      const userData = await serviceLayer.auth.verifyAccess(msg.accessToken);

      const lastUserAction = await serviceLayer.user.getLastUserAction(
        userData?.user
      );

      if (userData && isNextActionReadyForUser(lastUserAction)) {
        const newTile: Tile = {
          time: new Date().valueOf(),
          userId: userData?.user,
          coordinate: msg.coordinate,
          color: msg.color,
        };

        // Persist the new tile and the last action of the user
        await Promise.all([
          serviceLayer.game.setTile(newTile),
          serviceLayer.user.setLastUserAction(userData.user, newTile.time),
        ]);

        // Send confirmation to the user who submitted
        const confirmation: MsgUserPixelValidation = {
          kind: MsgUserPixelValidationKind,
          status: "ok",
          ...buildLastActionResponse(Date.now()), // Todo: MUST use the UserService to update the last action of the user this way the Rest Endpoint can have the real value
          coordinate: msg.coordinate,
          colorBeforeRequest: msg.color,
        };
        socket.emit(MsgUserPixelValidationKind, confirmation);

        // Broadcast the pixel to the other users (and the user who submitted)
        const broadcastPayload: MsgBroadcastNewPixel = {
          kind: MsgBroadcastNewPixelKind,
          tile: newTile,
        };
        io.emit(MsgBroadcastNewPixelKind, broadcastPayload);
      } else {
        console.log("Send error to the user who submitted"); // Todo
      }
    } catch (e) {
      const error: MsgError = {
        kind: MsgErrorKind,
        errorMessage: "Invalid access token",
      };
      socket.emit(MsgErrorKind, error);
    }
  });
});

io.on("connect_error", function (e) {
  console.log("connect_error", e);
});

server.listen(SERVER_PORT, () =>
  console.log(`Web Server Listening on IP ${SERVER_IP} and PORT ${SERVER_PORT}`)
);
