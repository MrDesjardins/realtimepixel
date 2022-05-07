import { HTTP_STATUS, URLS } from "@shared/constants/backend";
import {
  AllTilesRequest,
  AllTilesResponse,
  RemoveExpiredTilesRequest,
  RemoveExpiredTilesResponse,
} from "@shared/models/game";
import * as core from "express-serve-static-core";
import { buildBaseJsonResponse } from "../builders/errorBuilders";
import {
  buildAllTilesResponse,
  buildRemoveExpiredTilesResponse,
} from "../builders/gameBuilders";
import { ServiceLayer } from "../services/serviceLayer";
import { TypedRequestBody, TypedResponse } from "../webServer/expressType";
import { Server } from "socket.io";
import {
  MsgBroadcastRemovedPixels,
  MsgBroadcastRemovedPixelsKind,
} from "@shared/models/socketMessages";

export function addAllTilesRoute(
  serverApp: core.Express,
  serviceLayer: ServiceLayer
): void {
  serverApp.get(
    `/${URLS.allTiles}`,
    async (
      req: TypedRequestBody<AllTilesRequest>,
      res: TypedResponse<AllTilesResponse>,
      next: core.NextFunction
    ) => {
      try {
        const tiles = await serviceLayer.game.getAllTiles();
        return res.json(buildAllTilesResponse(tiles));
      } catch (e) {
        console.log("Catch", e);
        return res
          .status(HTTP_STATUS.bad_request)
          .send(
            buildBaseJsonResponse(
              HTTP_STATUS.bad_request,
              "Failed to fetch tiles"
            )
          );
      }
    }
  );
}

export function addRemoveExpiredTiles(
  serverApp: core.Express,
  serviceLayer: ServiceLayer,
  io: Server
): void {
  serverApp.delete(
    `/${URLS.removeExpiredTiles}`,
    async (
      req: TypedRequestBody<RemoveExpiredTilesRequest>,
      res: TypedResponse<RemoveExpiredTilesResponse>,
      next: core.NextFunction
    ) => {
      try {
        const removedTiles = await serviceLayer.game.removeExpiredTiles();
        console.log(
          "GameController>addRemoveExpiredTiles",
          removedTiles.length
        );
        const broadcastPayload: MsgBroadcastRemovedPixels = {
          kind: "MsgBroadcastRemovedPixelsKind",
          tiles: removedTiles,
        };
        io.emit(MsgBroadcastRemovedPixelsKind, broadcastPayload);
        return res.json(buildRemoveExpiredTilesResponse());
      } catch (e) {
        return res
          .status(HTTP_STATUS.bad_request)
          .send(
            buildBaseJsonResponse(
              HTTP_STATUS.bad_request,
              "Failed to remove expired tiles"
            )
          );
      }
    }
  );
}
