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
  buildSuccessfulResponse,
  buildLoginUserResponse,
  buildRefreshTokensResponse,
} from "../builders/loginBuilders";
import { ServiceLayer } from "../services/serviceLayer";
import { HTTP_STATUS, URLS } from "@shared/constants/backend";

import { TypedRequestBody, TypedResponse } from "../webServer/expressType";
import { buildBaseJsonResponse } from "../builders/errorBuilders";
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
          await serviceLayer.auth.authenticate(req.body);
        return res.json(
          buildLoginUserResponse(req.body.email, accessToken, refreshToken)
        );
      } catch (e) {
        console.log("Catch", e);
        return res
          .status(HTTP_STATUS.token_invalid)
          .send(buildBaseJsonResponse(HTTP_STATUS.token_invalid, "Invalid credential"));
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
        const { accessToken, refreshToken } = await serviceLayer.auth.create(
          req.body
        );
        return res.json(
          buildCreateUserResponse(req.body.email, accessToken, refreshToken)
        );
      } catch (e) {
        console.log("Catch", e);
        return res
          .status(HTTP_STATUS.token_invalid)
          .send(
            buildBaseJsonResponse(HTTP_STATUS.token_invalid, "Invalid account creation")
          );
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
          await serviceLayer.auth.refreshTokens(req.body);
        res.json(buildRefreshTokensResponse(accessToken, refreshToken));
      } catch (e) {
        console.log("Catch", e);
        return res
          .status(HTTP_STATUS.token_invalid)
          .send(buildBaseJsonResponse(HTTP_STATUS.token_invalid, "Refresh Tokens Failed"));
      }
    }
  );
}

export function addLogoutRoute(
  serverApp: core.Express,
  serviceLayer: ServiceLayer
): void {
  serverApp.get(
    `/${URLS.logout}`,
    async (
      req: TypedRequestBody<LogoutRequest>,
      res: TypedResponse<LogoutResponse>,
      next: core.NextFunction
    ) => {
      try {
        if (req.jwtPayload?.email === undefined) {
          return res
            .status(HTTP_STATUS.token_invalid)
            .send(
              buildBaseJsonResponse(HTTP_STATUS.token_invalid, "Refresh Tokens Failed")
            );
        } else {
          await serviceLayer.auth.logout(req.jwtPayload?.email);

          buildSuccessfulResponse;
          return res.status(HTTP_STATUS.ok).send("Logout Successful");
        }
      } catch (e) {
        console.log("Catch", e);
        return res
          .status(HTTP_STATUS.token_invalid)
          .send(buildBaseJsonResponse(HTTP_STATUS.token_invalid, "Refresh Tokens Failed"));
      }
    }
  );
}
