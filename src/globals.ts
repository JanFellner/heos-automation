import { Config } from "./config";
import { HEOSLogger } from "./logger";
import express from "express";

const configInstance = Config.getInstance();

export const theConfig = configInstance.config;
export const theLogger = HEOSLogger.getInstance(theConfig);
export const theWebServer = express();
