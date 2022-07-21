import { ServiceEnvironment } from "@shared/constants/backend";
import { MsgUserPixel, MsgUserPixelKind } from "@shared/models/socketMessages";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { createClient } from "redis";
import { Server, Socket } from "socket.io";
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
import {
  addRemoveAllUsersSocketsAndCredentialsRoute,
  addUserLastActionRoute,
} from "./controllers/userController";
import { secureEndpointMiddleware } from "./middlewares/secureEndpointMiddleware";
import { ServiceLayer } from "./services/serviceLayer";
import { onReceivePixel } from "./socket/actions/onReceivePixel";
import { authorizationMiddleware } from "./socket/authorizationMiddleware";
import { RequestUserFromJwt } from "./webServer/expressType";
import { createAdapter } from "@socket.io/redis-adapter";
import { userActivatedMiddleware } from "./middlewares/userActivatedMiddleware";
import { userActivateMiddleware } from "./socket/userActivateMiddleware";
import { addHealthRoute } from "./controllers/systemController";

dotenv.config();

const REDIS_IP = process.env.IP_REDIS;
const REDIS_PORT = Number(process.env.OUTER_PORT_REDIS);
const REDIS_URL = `redis://${REDIS_IP}:${REDIS_PORT}`;
const pubClient = createClient({
  socket: {
    port: REDIS_PORT,
    host: REDIS_IP,
  },
});

const subClient = pubClient.duplicate(); // https://socket.io/docs/v4/redis-adapter/

async function connectToRedis(): Promise<void> {
  await Promise.all([pubClient.connect(), subClient.connect()]);
  io.adapter(createAdapter(pubClient, subClient));
}

pubClient.on("connect", () => {
  console.log("Redis is connected");
});
pubClient.on("error", function (err: any) {
  console.error("Redis (pubClient) error:", err);
});
subClient.on("error", function (err: any) {
  console.error("Redis (subClient) error:", err);
});

connectToRedis();

const SERVER_IP = process.env.IP_BACKEND;
const SERVER_PORT = process.env.INNER_PORT_BACKEND;
console.log("Starting...");
console.log(`Inner backend Server ${SERVER_IP}:${SERVER_PORT}`);
console.log(`Outer Redis: ${REDIS_URL}`);

const serviceLayer = new ServiceLayer(ServiceEnvironment.Test, pubClient);
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
// Middlewares in specific order (top to bottom)
serverApp.use(secureEndpointMiddleware(serviceLayer));
serverApp.use(userActivatedMiddleware(serviceLayer));

// Route that does not need the access token
addHealthRoute(serverApp, serviceLayer);
addLoginRoute(serverApp, serviceLayer);
addCreateAccountRoute(serverApp, serviceLayer);
addRefreshTokensRoute(serverApp, serviceLayer);
addAllTilesRoute(serverApp, serviceLayer);
addRemoveExpiredTiles(serverApp, serviceLayer, io);

// Route that must be secured with an access token
addLogoutRoute(serverApp, serviceLayer);
addUserLastActionRoute(serverApp, serviceLayer);
addRemoveAllUsersSocketsAndCredentialsRoute(serverApp, serviceLayer);

const receivePixelWithServices = onReceivePixel(serviceLayer);

serverApp.use((err: any, req: any, res: any, next: any) => {
  console.error("ERROR ENDPOINT", err.stack);
  return res.status(500).send("Something broke!");
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
      socket.disconnect(true);
    }

    // Middlewares
    socket.use(authorizationMiddleware(serviceLayer, socket));
    socket.use(userActivateMiddleware(serviceLayer, socket));

    //
    socket.on("disconnect", async () => {
      console.log("User disconnected", socket.id);
      try {
        await onUserDisconnect(userId, socket);
      } catch (e) {
        console.log("Error disconnecting user", e);
      }
    });

    socket.on("error", (err) => {
      console.log("socket.error: ", err);
      // socket.disconnect(true); // will call the socket.on(disconnect)
    });

    socket.on(MsgUserPixelKind, async (msg: MsgUserPixel, callback) => {
      await receivePixelWithServices(msg, callback, socket, io);
    });
  }
});

io.on("connect_error", function (e) {
  console.log("connect_error", e);
});

server.listen(SERVER_PORT, () =>
  console.log(`Web Server Listening on IP ${SERVER_IP} and PORT ${SERVER_PORT}`)
);

async function onUserDisconnect(
  userId: string | undefined,
  socket: Socket
): Promise<void> {
  if (userId !== undefined) {
    return serviceLayer.user.removeUserSocket(userId, socket.id);
  } else {
    console.error("User disconnected with no userId");
  }
}

