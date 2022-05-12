import * as core from "express-serve-static-core";
import {
  LastUserActionRequest,
  LastUserActionResponse,
} from "@shared/models/user";

import { ServiceLayer } from "../services/serviceLayer";
import { TypedRequestBody, TypedResponse } from "../webServer/expressType";
import { HTTP_STATUS, URLS } from "@shared/constants/backend";
import { buildLastActionResponse } from "../builders/userBuilders";
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
