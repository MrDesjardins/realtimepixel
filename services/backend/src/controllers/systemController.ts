import { URLS } from "@shared/constants/backend";
import { Express, NextFunction } from "express";
import { ServiceLayer } from "../services/serviceLayer";
export function addHealthRoute(serverApp: Express, serviceLayer: ServiceLayer) {
  serverApp.get(`/${URLS.health}`, async (req, res) => {
    console.log("Health Check");
    return res.send("ok:" + process.env.NODE_ENV);
  });
}
