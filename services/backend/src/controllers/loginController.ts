import * as core from "express-serve-static-core";
import {
  UserLoginRequest,
  UserLoginResponse,
} from "../../../shared/models/login";
import {
  buildCreateUserResponse,
  buildLoginUserResponse,
} from "../builders/loginBuilders";
import { ServiceLayer } from "../services/serviceLayer";
import { TypedRequestBody, TypedResponse } from "../webServer/expressType";
export function addLoginRoute(
  serverApp: core.Express,
  serviceLayer: ServiceLayer
): void {
  serverApp.post(
    "/login",
    async (
      req: TypedRequestBody<UserLoginRequest>,
      res: TypedResponse<UserLoginResponse>,
      next: core.NextFunction
    ) => {
      try {
        const userToken = await serviceLayer.login.authenticate(req.body);
        res.json(buildLoginUserResponse(req.body.email, userToken));
      } catch (e) {
        console.log("Catch", e);
        return res.status(401).send("Invalid credentials");
      }
    }
  );
}

export function addCreateAccountRoute(
  serverApp: core.Express,
  serviceLayer: ServiceLayer
): void {
  serverApp.post(
    "/login",
    async (
      req: TypedRequestBody<UserLoginRequest>,
      res: TypedResponse<UserLoginResponse>,
      next: core.NextFunction
    ) => {
      try {
        const userToken = await serviceLayer.login.create(req.body);
        res.json(buildCreateUserResponse(req.body.email, userToken));
      } catch (e) {
        console.log("Catch", e);
        return res.status(401).send("Invalid Account Creation");
      }
    }
  );
}
