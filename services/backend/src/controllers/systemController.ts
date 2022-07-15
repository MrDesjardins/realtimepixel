import { URLS } from "@shared/constants/backend";
import { ServiceLayer } from "../services/serviceLayer";
import * as core from "express-serve-static-core";

export function addHealthRoute(
  serverApp: core.Express,
  serviceLayer: ServiceLayer
) {
  serverApp.get(`/${URLS.health}`, async (req, res) => {
    console.log("Health Check");
    return res.send("ok:" + process.env.NODE_ENV);
  });
}
