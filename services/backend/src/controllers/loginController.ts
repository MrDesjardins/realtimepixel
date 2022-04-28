import * as core from "express-serve-static-core";
import {
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UserLoginRequest,
  UserLoginResponse,
} from "@shared/models/login";
import {
  buildCreateUserResponse,
  buildLoginUserResponse,
  buildRefreshTokensResponse,
} from "../builders/loginBuilders";
import { ServiceLayer } from "../services/serviceLayer";
import { URLS } from "@shared/constants/backend";

import { TypedRequestBody, TypedResponse } from "../webServer/expressType";
export function addLoginRoute(
  serverApp: core.Express,
  serviceLayer: ServiceLayer
): void {
  serverApp.post(
    `/${URLS.login}`,
    async (
      req: TypedRequestBody<UserLoginRequest>,
      res: TypedResponse<UserLoginResponse>,
      next: core.NextFunction
    ) => {
      try {
        const { accessToken, refreshToken } =
          await serviceLayer.login.authenticate(req.body);
        res.json(
          buildLoginUserResponse(req.body.email, accessToken, refreshToken)
        );
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
    `/${URLS.create}`,
    async (
      req: TypedRequestBody<UserLoginRequest>,
      res: TypedResponse<UserLoginResponse>,
      next: core.NextFunction
    ) => {
      try {
        const { accessToken, refreshToken } = await serviceLayer.login.create(
          req.body
        );
        res.json(
          buildCreateUserResponse(req.body.email, accessToken, refreshToken)
        );
      } catch (e) {
        console.log("Catch", e);
        return res.status(401).send("Invalid Account Creation");
      }
    }
  );
}

export function addRefreshTokensRoute(
  serverApp: core.Express,
  serviceLayer: ServiceLayer
): void {
  serverApp.post(
    `/${URLS.refreshtokens}`,
    async (
      req: TypedRequestBody<RefreshTokenRequest>,
      res: TypedResponse<RefreshTokenResponse>,
      next: core.NextFunction
    ) => {
      try {
        const { accessToken, refreshToken } =
          await serviceLayer.login.refreshTokens(req.body);
        res.json(buildRefreshTokensResponse(accessToken, refreshToken));
      } catch (e) {
        console.log("Catch", e);
        return res.status(401).send("Refresh Tokens Failed");
      }
    }
  );
}

export function addLogoutRoute(
  serverApp: core.Express,
  serviceLayer: ServiceLayer
): void {
  serverApp.post(
    `/${URLS.logout}`,
    async (
      req: TypedRequestBody<LogoutRequest>,
      res: TypedResponse<LogoutResponse>,
      next: core.NextFunction
    ) => {
      try {
        await serviceLayer.login.logout(req.body);
        res.status(204).send("Logout Successful");
      } catch (e) {
        console.log("Catch", e);
        return res.status(401).send("Refresh Tokens Failed");
      }
    }
  );
}
