import { ServiceEnvironment } from "@shared/constants/backend";
import {
  MsgUserPixel,
  MsgUserPixelKind
} from "@shared/models/socketMessages";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { createClient } from "redis";
import { Server, Socket } from "socket.io";
import {
  addAllTilesRoute,
  addRemoveExpiredTiles
} from "./controllers/gameController";
import {
  addCreateAccountRoute,
  addLoginRoute,
  addLogoutRoute,
  addRefreshTokensRoute
} from "./controllers/loginController";
import {
  addRemoveAllUsersSocketsAndCredentialsRoute,
  addUserLastActionRoute
} from "./controllers/userController";
import { secureEndpointMiddleware } from "./middlewares/secureEndpoints";
import { ServiceLayer } from "./services/serviceLayer";
import { onReceivePixel } from "./socket/actions/onReceivePixel";
import { authorizationMiddleware } from "./socket/authorizationMiddleware";
import { RequestUserFromJwt } from "./webServer/expressType";
import { createAdapter } from "@socket.io/redis-adapter";

dotenv.config();

const REDIS_IP = process.env.REDIS_IP;
const REDIS_PORT = Number(process.env.REDIS_PORT);
const REDIS_URL = `redis://${REDIS_IP}:${REDIS_PORT}`;
const pubClient = createClient({
  socket: {
    port: REDIS_PORT,
    host: REDIS_IP,
  },
});

const subClient = pubClient.duplicate();

async function connectToRedis(): Promise<void> {
  await Promise.all([pubClient.connect(), subClient.connect()]);
  io.adapter(createAdapter(pubClient, subClient));
  await pubClient.on("connect", () => {
    console.log("Redis is connected");
  });
}

connectToRedis();

const SERVER_IP = process.env.SERVER_IP;
const SERVER_PORT = process.env.SERVER_PORT;
const CORS_CLIENT_ORIGIN = `${process.env.CLIENT_IP}:${process.env.DOCKER_CLIENT_PORT_FORWARD}`;
console.log(`Server ${SERVER_IP}:${SERVER_PORT}`);
console.log(`Socket IO Cors Allowing: ${CORS_CLIENT_ORIGIN}`);
console.log(`Redis: ${REDIS_URL}`);

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

serverApp.get("/health", async (req, res) => {
  console.log("Health Check");
  return res.send("ok:" + process.env.NODE_ENV);
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
      socket.disconnect(true); // will call the socket.on(disconnect)
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
