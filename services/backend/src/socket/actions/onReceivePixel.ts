import {
  MsgBroadcastNewPixel,
  MsgBroadcastNewPixelKind,
  MsgError,
  MsgErrorKind,
  MsgUserPixel,
  MsgUserPixelValidation,
  MsgUserPixelValidationKind,
} from "@shared/models/socketMessages";
import { Server, Socket } from "socket.io";
import {
  isNextActionReadyForUser,
  isPixelAvailableForNewAction,
} from "../../../../shared/logics/time";
import { Tile } from "../../../../shared/models/game";
import { buildLastActionResponse } from "../../builders/userBuilders";
import { UserTableSchema } from "../../Repositories/userRepository";
import { ServiceLayer } from "../../services/serviceLayer";
export function onReceivePixel(serviceLayer: ServiceLayer) {
  return async function (
    msg: MsgUserPixel,
    callback: (arg: MsgUserPixelValidation | MsgError) => void,
    socket: Socket,
    io: Server
  ): Promise<void> {
    console.log("MsgUserPixelKind");
    try {
      const currentTime = new Date().valueOf();
      const user = socket.data.user as UserTableSchema | undefined; // From the middleware
      const lastUserAction = user?.lastUserAction;
      if (user) {
        if (isNextActionReadyForUser(lastUserAction)) {
          const existingTile = await serviceLayer.game.getTile(msg.coordinate);
          if (isPixelAvailableForNewAction(existingTile, currentTime)) {
            const newTile: Tile = {
              time: currentTime,
              userId: user.id,
              coordinate: msg.coordinate,
              color: msg.color,
            };
            // Persist the new tile and the last action of the user
            await Promise.all([
              serviceLayer.game.setTile(newTile),
              serviceLayer.user.setLastUserAction(user.id, newTile.time),
            ]);

            // Send confirmation to the user who submitted
            const confirmation: MsgUserPixelValidation = {
              kind: MsgUserPixelValidationKind,
              userId: newTile.userId,
              ...buildLastActionResponse(newTile.time),
              coordinate: msg.coordinate,
              colorBeforeRequest: msg.color,
            };

            // If the user who submitted has more than one socket, we need to send to all of them
            // to ensure the **lastAction time** is updated on all the user device
            if (user.socketIds.length > 1) {
              for (let userSocket of user.socketIds) {
                console.log("Submitting to socket#", userSocket);
                console.log(
                  io
                    .to(userSocket)
                    .emit(MsgUserPixelValidationKind, confirmation)
                );
              }
            }

            // Broadcast the pixel to the other users (and the user who submitted)
            const broadcastPayload: MsgBroadcastNewPixel = {
              kind: MsgBroadcastNewPixelKind,
              tile: newTile,
            };
            io.emit(MsgBroadcastNewPixelKind, broadcastPayload);
            callback(confirmation);
          } else {
            const error: MsgError = {
              kind: MsgErrorKind,
              errorMessage: "Life of the tile is not over",
            };
            callback(error); // No need to broadcast, just the sender
          }
        } else {
          const error: MsgError = {
            kind: MsgErrorKind,
            errorMessage:
              "The user did not wait the full time before submitting a new pixel",
          };
          callback(error); // No need to broadcast, just the sender
        }
      } else {
        const error: MsgError = {
          kind: MsgErrorKind,
          errorMessage: "Invalid user",
        };
        callback(error); // No need to broadcast, just the sender
      }
    } catch (e) {
      console.error("Err", e); // Todo
      const error: MsgError = {
        kind: MsgErrorKind,
        errorMessage: "Invalid access token",
      };
      socket.emit(MsgErrorKind, error);
    }
    return Promise.resolve(); // Always return a success
  };
}
