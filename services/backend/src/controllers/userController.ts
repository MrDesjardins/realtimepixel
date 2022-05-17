import * as core from "express-serve-static-core";
import {
  LastUserActionRequest,
  LastUserActionResponse,
} from "@shared/models/user";

import { ServiceLayer } from "../services/serviceLayer";
import { TypedRequestBody, TypedResponse } from "../webServer/expressType";
import { HTTP_STATUS, URLS } from "@shared/constants/backend";
import {
  buildLastActionResponse,
  buildRemoveUsersSocketsResponse,
} from "../builders/userBuilders";
import { buildBaseJsonResponse } from "../builders/errorBuilders";
export function addUserLastActionRoute(
  serverApp: core.Express,
  serviceLayer: ServiceLayer
): void {
  serverApp.get(
    `/${URLS.lastUserAction}`,
    async (
      req: TypedRequestBody<LastUserActionRequest>,
      res: TypedResponse<LastUserActionResponse>
      // next: core.NextFunction
    ) => {
      try {
        if (req.jwtPayload === undefined) {
          return res.json(buildLastActionResponse(undefined));
        } else {
          const ts = await serviceLayer.user.getUser(req.jwtPayload.id);
          return res.json(buildLastActionResponse(ts?.lastUserAction));
        }
      } catch (e) {
        console.log("addUserLastActionRoute catch", e);
        return res
          .status(HTTP_STATUS.bad_request)
          .json(buildLastActionResponse(undefined));
      }
    }
  );
}

export function addRemoveAllUsersSocketsAndCredentialsRoute(
  serverApp: core.Express,
  serviceLayer: ServiceLayer
): void {
  serverApp.delete(
    `/${URLS.clearUsersSocketsAndCredentials}`,
    async (
      req: TypedRequestBody<LastUserActionRequest>,
      res: TypedResponse<LastUserActionResponse>
      // next: core.NextFunction
    ) => {
      try {
        if (req.jwtPayload === undefined) {
          return res.json(
            buildBaseJsonResponse(
              HTTP_STATUS.token_invalid,
              "Must be authenticated"
            )
          );
        } else {
          const ts = await serviceLayer.user.getUser(req.jwtPayload.id);
          if (ts?.email === "test") {
            // Todo: Make that endpoint just for me (admin) instead of test@test.com
            const count =
              await serviceLayer.user.removeAllUsersSocketsAndCredentials();
            console.log("Removed User Sockets and Credentials", count);
            return res.json(buildRemoveUsersSocketsResponse());
          } else {
            console.log("TS", ts);
            return res
              .status(HTTP_STATUS.valid_but_not_authorization)
              .json(
                buildBaseJsonResponse(
                  HTTP_STATUS.valid_but_not_authorization,
                  "Authentication required for this action"
                )
              );
          }
        }
      } catch (e) {
        console.log("addUserLastActionRoute catch", e);
        return res
          .status(HTTP_STATUS.bad_request)
          .json(buildLastActionResponse(undefined));
      }
    }
  );
}
