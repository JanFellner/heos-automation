import { theHEOSController, theLogger } from "./globals";
import express, { Application } from "express";
export const theWebServer: Application = express();

theLogger.init();
theHEOSController.init();
