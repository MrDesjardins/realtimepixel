import { ServiceEnvironment } from "@shared/constants/backend";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { addCreateAccountRoute, addLoginRoute } from "./controllers/loginController";
import { ServiceLayer } from "./services/serviceLayer";
dotenv.config();

const SERVER_IP = process.env.SERVER_IP;
const SERVER_PORT = process.env.SERVER_PORT;
console.log(`Server ${SERVER_IP}:${SERVER_PORT}`);

const serviceLayer = new ServiceLayer(ServiceEnvironment.Test);
const serverApp = express();
serverApp.use(bodyParser.json()); // Allows to parse POST body
serverApp.use(bodyParser.urlencoded({ extended: true }));
serverApp.use(cors());

serverApp.get("/health", async (req, res) => {
  res.send("ok:" + process.env.NODE_ENV);
});

serverApp.listen(SERVER_PORT, () =>
  console.log(`Web Server Listening on IP ${SERVER_IP} and PORT ${SERVER_PORT}`)
);

addLoginRoute(serverApp, serviceLayer);
addCreateAccountRoute(serverApp, serviceLayer);
