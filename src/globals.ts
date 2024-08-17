import { Config } from "./config";
import { HEOSController } from "./HEOSController";
import { HEOSLogger } from "./HEOSLogger";
import express from "express";

const configInstance = Config.getInstance();

export const theConfig = configInstance.config;
export const theLogger = HEOSLogger.getInstance(theConfig);
export const theHEOSController = HEOSController.getInstance(theConfig, theLogger);
export const theWebServer = express();
