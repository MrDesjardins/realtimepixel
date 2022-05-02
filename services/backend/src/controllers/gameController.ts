import { HTTP_STATUS, URLS } from "@shared/constants/backend";
import { AllTilesRequest, AllTilesResponse } from "@shared/models/game";
import * as core from "express-serve-static-core";
import { buildBaseJsonResponse } from "../builders/errorBuilders";
import { buildAllTilesResponse } from "../builders/gameBuilders";
import { ServiceLayer } from "../services/serviceLayer";
import { TypedRequestBody, TypedResponse } from "../webServer/expressType";

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
