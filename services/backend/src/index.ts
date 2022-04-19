import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { LoginRequest, LoginResponse } from "@shared/models/login";
import { ServiceLayer } from "./services/serviceLayer";
import { ServiceEnvironment } from "@shared/constants/backend";
import { buildLoginResponse } from "./builders/loginBuilders";
import { TypedRequestBody, TypedResponse } from "./webServer/expressType";
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

serverApp.post(
  "/login",
  async (
    req: TypedRequestBody<LoginRequest>,
    res: TypedResponse<LoginResponse>
  ) => {
    const userToken = await serviceLayer.login.authenticate(req.body);
    if (userToken === undefined) {
      res.status(401).send("Invalid credentials");
    } else {
      res.json(buildLoginResponse(req.body.email, userToken));
    }
  }
);
