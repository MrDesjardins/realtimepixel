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
      return res
        .status(400)
        .send({ status: 400, message: "Token not present" });
    }
    const accessToken = authHeader.split(" ")[1];
    if (accessToken === undefined) {
      return res
        .status(400)
        .send({ status: 400, message: "Token not present" });
    }
    try {
      const userData = await serviceLayer.login.verifyAccess(accessToken);
      req.jwtPayload = userData;
      next(); //proceed to the next action in the calling function
    } catch (e) {
      res.status(403).send({ status: 403, message: "Token invalid" });
    }
  };
}
