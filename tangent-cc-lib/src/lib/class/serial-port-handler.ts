import { CHARACHORDER_DEVICE_PORTS } from '../data/charachorder-device-ports.js';

export class SerialPortHandler {
  constructor(
    public autoConnect = false,
    private readonly devicePorts = CHARACHORDER_DEVICE_PORTS,
  ) {}

  public async getPort(): Promise<SerialPort> {
    if (this.autoConnect) {
      const viablePorts = await this.getViablePorts();
      if (viablePorts.length === 1) {
        return viablePorts[0];
      }
    }
    return this.requestPort();
  }

  private async requestPort(): Promise<SerialPort> {
    return navigator.serial.requestPort({
      filters: [...this.devicePorts.values()],
    });
  }

  private async getViablePorts(): Promise<SerialPort[]> {
    return navigator.serial.getPorts().then((ports) =>
      ports.filter((port) => {
        const { usbProductId, usbVendorId } = port.getInfo();
        for (const filter of this.devicePorts.values()) {
          if (
            filter.usbProductId === usbProductId &&
            filter.usbVendorId === usbVendorId
          ) {
            return true;
          }
        }
        return false;
      }),
    );
  }
}
