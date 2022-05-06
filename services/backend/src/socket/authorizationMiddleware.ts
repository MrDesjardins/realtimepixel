import { Event, Socket } from "socket.io";
import { BaseMsg } from "../../../shared/models/socketMessages";
import { ServiceLayer } from "../services/serviceLayer";
export const authorizationMiddleware =
  (serviceLayer: ServiceLayer, socket: Socket) =>
  async (event: Event, next: (err?: Error) => void) => {
    // const nameMessage = event[0];
    const content = event[1] as BaseMsg;
    try {
      const userData = await serviceLayer.auth.verifyAccess(
        content.accessToken
      );
      const user = await serviceLayer.user.getUser(userData.id);
      socket.data.user = user;
      next();
    } catch (e) {
      if (e instanceof Error) {
        next(e);
      } else {
        next(new Error("Invalid access token"));
      }
    }
  };
