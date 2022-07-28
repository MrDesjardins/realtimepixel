import { HTTP_STATUS, URLS_UNSECURE } from "@shared/constants/backend";
import {
  RequestUserFromJwt,
  TypedRequestBody,
  TypedResponse,
} from "../webServer/expressType";
import { ServiceLayer } from "../services/serviceLayer";
import { NextFunction } from "express";
/**
 * Must be after the secureEndpoint. Assume to have the JWT payload in the request
 **/
export function userActivatedMiddleware(serviceLayer: ServiceLayer) {
  return async function (
    req: TypedRequestBody<any>,
    res: TypedResponse<any>,
    next: NextFunction
  ) {
    // Unsecure endpoints are not checked
    const requestUrl = req.url.slice(1);
    if (URLS_UNSECURE.includes(requestUrl)) {
      return next();
    }

    // Get the user JWT from the previous middleware
    const userJWT: RequestUserFromJwt | undefined = req.jwtPayload;
    if (userJWT === undefined) {
      // Should not happen and be catched by the secureEndpoint middleware
      return res.status(HTTP_STATUS.token_missing).send({
        status: HTTP_STATUS.token_missing,
        message: "Token not present",
      });
    } else {
      const user = await serviceLayer.user.getUser(userJWT.id);
      if (user === undefined) {
        return res.status(HTTP_STATUS.account_not_validated).send({
          status: HTTP_STATUS.account_not_validated,
          message: "User Email Not validated",
        });
      } else {
        if (!user.emailValidated) {
          return res.status(HTTP_STATUS.account_not_validated).send({
            status: HTTP_STATUS.account_not_validated,
            message: "User Email Not validated",
          });
        } else if (user.accessToken === undefined) {
          return res.status(HTTP_STATUS.token_invalid).send({
            status: HTTP_STATUS.token_invalid,
            message: "User Access Token is Invalid",
          });
        }
      }
    }

    return next(); // All good, we have a user with a validated email
  };
}
