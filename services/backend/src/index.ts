import { ServiceEnvironment } from "@shared/constants/backend";
import {
  isNextActionReadyForUser,
  isPixelAvailableForNewAction,
} from "@shared/logics/time";
import { Tile } from "@shared/models/game";
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
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { buildLastActionResponse } from "./builders/userBuilders";
import {
  addAllTilesRoute,
  addRemoveExpiredTiles,
} from "./controllers/gameController";
import {
  addCreateAccountRoute,
  addLoginRoute,
  addLogoutRoute,
  addRefreshTokensRoute,
} from "./controllers/loginController";
import { addUserLastActionRoute } from "./controllers/userController";
import { secureEndpointMiddleware } from "./middlewares/secureEndpoints";
import { UserTableSchema } from "./Repositories/userRepository";
import { ServiceLayer } from "./services/serviceLayer";
import { authorizationMiddleware } from "./socket/authorizationMiddleware";
import { RequestUserFromJwt } from "./webServer/expressType";
dotenv.config();

const SERVER_IP = process.env.SERVER_IP;
const SERVER_PORT = process.env.SERVER_PORT;
const CORS_CLIENT_ORIGIN = `${process.env.CLIENT_IP}:${process.env.DOCKER_CLIENT_PORT_FORWARD}`;
console.log(`Server ${SERVER_IP}:${SERVER_PORT}`);
console.log(`Socket IO Cors Allowing: ${CORS_CLIENT_ORIGIN}`);

const serviceLayer = new ServiceLayer(ServiceEnvironment.Test);
const serverApp = express();

const server = http.createServer(serverApp);
const io = new Server(server, {
  cors: {
    //origin: `http://${CORS_CLIENT_ORIGIN}`,
    origin: "*",
  },
});

serverApp.use(bodyParser.json()); // Allows to parse POST body
serverApp.use(bodyParser.urlencoded({ extended: true }));
serverApp.use(cors());

serverApp.get("/health", async (req, res) => {
  console.log("Health Check");
  res.send("ok:" + process.env.NODE_ENV);
});

// Middlewares
serverApp.use(secureEndpointMiddleware(serviceLayer));

// Route that does not need the access token
addLoginRoute(serverApp, serviceLayer);
addCreateAccountRoute(serverApp, serviceLayer);
addRefreshTokensRoute(serverApp, serviceLayer);
addAllTilesRoute(serverApp, serviceLayer);
addRemoveExpiredTiles(serverApp, serviceLayer, io);

// Route that must be secured with an access token
addLogoutRoute(serverApp, serviceLayer);
addUserLastActionRoute(serverApp, serviceLayer);

serverApp.use((err: any, req: any, res: any, next: any) => {
  console.error("ERROR ENDPOINT", err.stack);
  res.status(500).send("Something broke!");
});

io.on("connection", async (socket) => {
  const accessToken = socket.handshake.query.access_token;
  console.log("User connected", socket.id);
  let userData: RequestUserFromJwt | undefined;
  let userId: string | undefined;
  if (typeof accessToken === "string") {
    try {
      userData = await serviceLayer.auth.verifyAccess(accessToken);
      userId = userData.id;
      serviceLayer.user.addUserSocket(userId, socket.id);
    } catch (e) {
      socket.disconnect();
    }

    // Middlewares
    socket.use(authorizationMiddleware(serviceLayer, socket));
    //
    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
      onUserDisconnect(userId, socket);
    });

    socket.on("error", (err) => {
      console.log("socket.error: ", err);
      socket.disconnect(); // will call the socket.on(disconnect)
    });

    socket.on(MsgUserPixelKind, async (msg: MsgUserPixel, callback) => {
      await onReceivePixel(msg, callback, socket);
    });
  }
});

io.on("connect_error", function (e) {
  console.log("connect_error", e);
});

server.listen(SERVER_PORT, () =>
  console.log(`Web Server Listening on IP ${SERVER_IP} and PORT ${SERVER_PORT}`)
);
async function onReceivePixel(
  msg: MsgUserPixel,
  callback: (arg: MsgUserPixelValidation | MsgError) => void,
  socket: Socket
): Promise<void> {
  console.log("MsgUserPixelKind");
  try {
    const currentTime = new Date().valueOf();
    const user = socket.data.user as UserTableSchema | undefined; // From the middleware
    const lastUserAction = user?.lastUserAction;
    if (user) {
      if (isNextActionReadyForUser(lastUserAction)) {
        const existingTile = await serviceLayer.game.getTile(msg.coordinate);
        if (isPixelAvailableForNewAction(existingTile, currentTime)) {
          const newTile: Tile = {
            time: currentTime,
            userId: user.id,
            coordinate: msg.coordinate,
            color: msg.color,
          };
          // Persist the new tile and the last action of the user
          await Promise.all([
            serviceLayer.game.setTile(newTile),
            serviceLayer.user.setLastUserAction(user.id, newTile.time),
          ]);

          // Send confirmation to the user who submitted
          const confirmation: MsgUserPixelValidation = {
            kind: MsgUserPixelValidationKind,
            userId: newTile.userId,
            ...buildLastActionResponse(newTile.time),
            coordinate: msg.coordinate,
            colorBeforeRequest: msg.color,
          };

          // If the user who submitted has more than one socket, we need to send to all of them
          // to ensure the **lastAction time** is updated on all the user device
          if (user.socketIds.length > 1) {
            for (let userSocket of user.socketIds) {
              console.log("Submitting to socket#", userSocket);
              io.to(userSocket).emit(MsgUserPixelValidationKind, confirmation);
            }
          }

          // Broadcast the pixel to the other users (and the user who submitted)
          const broadcastPayload: MsgBroadcastNewPixel = {
            kind: MsgBroadcastNewPixelKind,
            tile: newTile,
          };
          io.emit(MsgBroadcastNewPixelKind, broadcastPayload);
          callback(confirmation);
        } else {
          const error: MsgError = {
            kind: MsgErrorKind,
            errorMessage: "Life of the tile is not over",
          };
          callback(error); // No need to broadcast, just the sender
        }
      } else {
        const error: MsgError = {
          kind: MsgErrorKind,
          errorMessage:
            "The user did not wait the full time before submitting a new pixel",
        };
        callback(error); // No need to broadcast, just the sender
      }
    } else {
      const error: MsgError = {
        kind: MsgErrorKind,
        errorMessage: "Invalid user",
      };
      callback(error); // No need to broadcast, just the sender
    }
  } catch (e) {
    console.error("Err", e); // Todo
    const error: MsgError = {
      kind: MsgErrorKind,
      errorMessage: "Invalid access token",
    };
    socket.emit(MsgErrorKind, error);
  }
}

function onUserDisconnect(userId: string | undefined, socket: Socket) {
  if (userId !== undefined) {
    serviceLayer.user.removeUserSocket(userId, socket.id);
  }
}
