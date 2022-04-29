import * as core from "express-serve-static-core";
import { HEADERS } from "@shared/constants/backend";
import { TypedRequestBody, TypedResponse } from "../webServer/expressType";
import { ServiceLayer } from "../services/serviceLayer";
export function secureEndpointMiddleware(serviceLayer: ServiceLayer) {
  return async function (
    req: TypedRequestBody<any>,
    res: TypedResponse<any>,
    next: core.NextFunction
  ) {
    //get token from request header
    const authHeader = req.headers[HEADERS.authorization]; // Format is "Bearer <token>"
    if (authHeader === undefined) {
      res.status(400).send("Token not present");
      return;
    }
    const accessToken = authHeader.split(" ")[1];
    if (accessToken === undefined) {
      res.status(400).send("Token not present");
      return;
    }
    try {
      const userData = await serviceLayer.login.verifyAccess(accessToken);
      req.jwtPayload = userData;
      next(); //proceed to the next action in the calling function
    } catch (e) {
      res.status(403).send("Token invalid");
    }
  };
}
