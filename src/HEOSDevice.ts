import * as heos from "heos-api";
import { HeosConnection } from "heos-api/dist/types/connection/heosConnection";

/**
 * A HEOS device
 */
export class HEOSDevice {
	// The IP-Address of the device
	public readonly ip: string;
	// The connection to the device
	private connection?: HeosConnection;

	/**
	 * Constructs the HEOSDevice
	 *
	 * @param ip - the ip of the device
	 */
	public constructor(ip: string) {
		this.ip = ip;
		this.onClose = this.onClose.bind(this);
	}

	/**
	 * Called if the connection to a HEOS device was closed
	 *
	 * @param hadError - closed due to an error
	 */
	private onClose(hadError: boolean): void {

	}

	/**
	 * Called if the connection faced an error
	 *
	 * @param error - the Error object
	 */
	private onError(error: Error): void {
		console.error(error);
	}

	/**
	 * Connects to a device
	 *
	 * @returns a void promise
	 */
	public async connect(): Promise<boolean> {
		try {
			this.connection = await heos.connect(this.ip);
			this.connection.onClose(this.onClose);
			this.connection.onError(this.onError);
		} catch (error) {

		}

		return false;
	}

	/**
	 * A helper method which handles reconnecting to the device
	 */
	public onReconnectTimer(): void {

	}
}
