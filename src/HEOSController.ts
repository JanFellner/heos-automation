import { ILogger } from "@estos/uclogger";
import { IConfig } from "./config";
import * as heos from "heos-api";
import { DiscoverOptions } from "heos-api/dist/types/connection/discover";
import { HEOSDevices } from "./HEOSDevices";
import { HEOSDevice } from "./HEOSDevice";

const heosDiscoverOptions: DiscoverOptions = {
	timeout: 5000
};

/**
 * The HEOS Controller searches and finds
 */
export class HEOSController {
	// The singleton instance of this class
	private static instance: HEOSController;
	// Config settings
	private config: IConfig;
	// Logger
	private logger: ILogger;
	// The list of devices
	private devices: HEOSDevices;

	/**
	 * Gets instance of HEOSLogger to use as singleton.
	 *
	 * @param config - the config
	 * @param logger - the logger
	 * @returns - an instance of this class.
	 */
	public static getInstance(config: IConfig, logger: ILogger): HEOSController {
		if (!HEOSController.instance)
			HEOSController.instance = new HEOSController(config, logger);
		return HEOSController.instance;
	}

	/**
	 * Constructs the HEOController
	 *
	 * @param config - the config
	 * @param logger - the logger
	 */
	private constructor(config: IConfig, logger: ILogger) {
		this.config = config;
		this.logger = logger;
		this.devices = new HEOSDevices();
		this.onDeviceDiscovered = this.onDeviceDiscovered.bind(this);
		this.onDeviceDiscoverTimeout = this.onDeviceDiscoverTimeout.bind(this);
	}

	/**
	 * A new device was discovered
	 *
	 * @param address - the ip address of the device
	 */
	private async onDeviceDiscovered(address: string): Promise<void> {
		if (!this.devices.has(address)) {
			this.logger.debug("New device discovered", "onDeviceDiscovered", this, { address });
			const heosDevice = new HEOSDevice(address);
			await heosDevice.connect();
			this.devices.set(address, heosDevice);
		}
	}

	/**
	 * Discovering devices timed out
	 *
	 * @param addresses - the ip addresses of all the discovered devices
	 */
	private onDeviceDiscoverTimeout(addresses: string[]): void {
		heos.discoverDevices(heosDiscoverOptions, this.onDeviceDiscovered, this.onDeviceDiscoverTimeout);
	}

	/**
	 * Initializes the HEOS Controller
	 * Starts searching and connecting of devices
	 */
	public init() {
		heos.discoverDevices(heosDiscoverOptions, this.onDeviceDiscovered, this.onDeviceDiscoverTimeout);
	}

	/**
	 * Terminates the HEOS Controller
	 * Stops searching and connecting of devices
	 */
	public exit() {
	}
}
