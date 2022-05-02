import * as core from "express-serve-static-core";
import { HEADERS, HTTP_STATUS } from "@shared/constants/backend";
import { TypedRequestBody, TypedResponse } from "../webServer/expressType";
import { ServiceLayer } from "../services/serviceLayer";

/**
 * Allows to have in a central place all the security checks for the endpoints.
 * 
 * The access token contains the user email (see generateAccessToken in the authService)
 **/
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
        .status(HTTP_STATUS.token_missing)
        .send({
          status: HTTP_STATUS.token_missing,
          message: "Token not present",
        });
    }
    const accessToken = authHeader.split(" ")[1];
    if (accessToken === undefined) {
      return res
        .status(HTTP_STATUS.token_missing)
        .send({
          status: HTTP_STATUS.token_missing,
          message: "Token not present",
        });
    }
    try {
      const userData = await serviceLayer.auth.verifyAccess(accessToken);
      req.jwtPayload = userData;
      next(); //proceed to the next action in the calling function
    } catch (e) {
      res
        .status(HTTP_STATUS.valid_but_not_authorization)
        .send({ status: HTTP_STATUS.valid_but_not_authorization, message: "Token invalid" });
    }
  };
}
