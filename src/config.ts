import { EConfigTemplate, validators, ICoreConfig } from "@estos/ucconfig";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * The static config this package
 */
class StaticConfig {
}

interface IEconfConfig extends StaticConfig {
	// The configure log directory
	logDirectory: string;
	// The configured webserver port
	webServerPort: number;
}

export type IConfig = IEconfConfig & ICoreConfig

/**
 * The config
 */
export class Config extends EConfigTemplate {
	private static _config: Config;
	private _configuration: IEconfConfig;
	// The singleton instance of this class
	private static instance: Config;

	/**
	 * Gets instance of OBDConnection to use as singleton.
	 *
	 * @returns - an instance of this class.
	 */
	public static getInstance(): Config {
		if (!Config.instance)
			Config.instance = new Config();
		return Config.instance;
	}

	/**
	 * Constructor --- you know?
	 */
	private constructor() {
		super("HEOS");
		if (process.env["NODE_ENV"] === "test")
			dotenv.config({ path: ".env.test" });
		else
			dotenv.config();
		this.initCore();
		this._configuration = this.init();
		this.validate(true);
	}

	/**
	 * Getter for the main config
	 *
	 * @returns - IConfig object
	 */
	public get config(): IConfig {
		return { ...this._configuration, ...this.coreConfig };
	}

	/**
	 * Inits all configurations/settings from given environment variables
	 *
	 * @returns IEConfig - configuration by env
	 */
	public init(): IEconfConfig {
		const config: IEconfConfig = {
			...new StaticConfig(),
			logDirectory: this.newProperty<string>("LOG_DIRECTORY", validators.validateFolderExists()),
			webServerPort: this.newProperty<number>("WEBSERVER_PORT", validators.validatePort(), 80)
		};
		return config;
	}

	/**
	 * Current working directory of the Node.js process
	 *
	 * @returns - current working directory of the Node.js process
	 */
	public get rootdir(): string {
		return process.cwd();
	}
}
