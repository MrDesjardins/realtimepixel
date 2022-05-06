import * as core from "express-serve-static-core";
import {
  LastUserActionRequest,
  LastUserActionResponse,
} from "@shared/models/user";

import { ServiceLayer } from "../services/serviceLayer";
import { TypedRequestBody, TypedResponse } from "../webServer/expressType";
import { URLS } from "../../../shared/constants/backend";
import { buildLastActionResponse } from "../builders/userBuilders";
export function addUserLastActionRoute(
  serverApp: core.Express,
  serviceLayer: ServiceLayer
): void {
  serverApp.get(
    `/${URLS.lastUserAction}`,
    async (
      req: TypedRequestBody<LastUserActionRequest>,
      res: TypedResponse<LastUserActionResponse>,
      next: core.NextFunction
    ) => {
      try {
        if (req.jwtPayload === undefined) {
          res.json(buildLastActionResponse(undefined));
        } else {
          const ts = await serviceLayer.user.getLastUserAction(req.jwtPayload.id);
          res.json(buildLastActionResponse(ts));
        }
      } catch (e) {
        console.log("addUserLastActionRoute catch", e);
        res.json(buildLastActionResponse(undefined));
      }
    }
  );
}