import { Event, Socket } from "socket.io";
import { BaseMsg } from "../../../shared/models/socketMessages";
import { ServiceLayer } from "../services/serviceLayer";
export const userActivateMiddleware =
  (serviceLayer: ServiceLayer, socket: Socket) =>
  async (event: Event, next: (err?: Error) => void) => {
    const user = socket.data.user;

    if (user === undefined) {
      return next(new Error("User Email Not validated"));
    } else {
      if (!user.emailValidated) {
        return next(new Error("User Email Not validated"));
      } else if (user.accessToken === undefined) {
        return next(new Error("User Access Token is Invalid"));
      }
    }

    return next();
  };
