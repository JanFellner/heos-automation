import { ELogger, IELoggerSettings } from "@estos/uclogger";
import { IConfig } from "./config";
import { hostname } from "os";

/**
 * The logger object
 */
export class HEOSLogger extends ELogger {
	// The singleton instance of this class
	private static instance: HEOSLogger;
	// Config settings
	private config: IConfig;

	/**
	 * Gets instance of HEOSLogger to use as singleton.
	 *
	 * @param config - the config
	 * @returns - an instance of this class.
	 */
	public static getInstance(config: IConfig): HEOSLogger {
		if (!HEOSLogger.instance)
			HEOSLogger.instance = new HEOSLogger(config);
		return HEOSLogger.instance;
	}

	/**
	 * Constructor --- you know?
	 *
	 * @param config - the config
	 */
	private constructor(config: IConfig) {
		super();
		this.config = config;
	}

	/**
	 * Initializes the logger object
	 */
	public override init(): void {
		const eLoggerSettings: IELoggerSettings = {
			logLevel: this.config.logLevel,
			infrastructure: {
				environment: this.config.environment,
				servername: hostname(),
				role: "heos-automation",
				role_instance: 0
			},
			logSubsequentErrorsAs: "debug"
		};

		if (this.config.logToConsole) {
			eLoggerSettings.consoleLog = {
				logConsole: true,
				logObjectInsteadOfMessage: this.config.environment === "development",
				filter: {
					error: true,
					warn: true,
					debug: false,
					info: false
				}
			};
		}

		eLoggerSettings.fileLog = [];
		eLoggerSettings.fileLog.push(
			{
				logFilename: "econfserver.log",
				logDirectory: this.config.logDirectory,
				prettyPrintLogFile: 2,
				maxFileSize: 1024 * 1024 * 25,
				maxFileCount: (this.config.environment === "development") ? 1 : 10,
				bNewFileAlways: (this.config.environment === "development") ? true : false,
				logLevel: "debug",
				bSyncLogging: this.config.development
			}
		);

		super.init(eLoggerSettings);
	}
}
