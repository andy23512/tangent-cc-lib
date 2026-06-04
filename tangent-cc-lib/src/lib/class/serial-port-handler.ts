import { serial as webUsbSerial } from 'web-serial-polyfill';
import { CHARACHORDER_DEVICE_PORTS } from '../data/charachorder-device.js';

export type SupportedSerialPort = Pick<
  SerialPort,
  'open' | 'close' | 'getInfo' | 'readable' | 'writable'
>;

type SerialProvider = {
  requestPort(options?: SerialPortRequestOptions): Promise<SupportedSerialPort>;
  getPorts(): Promise<SupportedSerialPort[]>;
};

export class SerialPortHandler {
  constructor(
    public autoConnect = false,
    private readonly devicePorts = CHARACHORDER_DEVICE_PORTS,
  ) {}

  public async getPort(): Promise<SupportedSerialPort> {
    const serialProvider = this.getSerialProvider();
    if (this.autoConnect) {
      const viablePorts = await this.getViablePorts(serialProvider);
      if (viablePorts.length === 1) {
        return viablePorts[0];
      }
    }
    return this.requestPort(serialProvider);
  }

  private getSerialProvider(): SerialProvider {
    const browserNavigator = navigator as Navigator & {
      serial?: Serial;
      usb?: unknown;
    };

    if (browserNavigator.serial) {
      return browserNavigator.serial;
    }

    if (browserNavigator.usb) {
      return {
        requestPort: (options) => webUsbSerial.requestPort(options),
        getPorts: () => webUsbSerial.getPorts(),
      };
    }

    throw new Error('This browser does not support Web Serial or WebUSB.');
  }

  private async requestPort(
    serialProvider: SerialProvider,
  ): Promise<SupportedSerialPort> {
    return serialProvider.requestPort({
      filters: [...this.devicePorts.values()],
    });
  }

  private async getViablePorts(
    serialProvider: SerialProvider,
  ): Promise<SupportedSerialPort[]> {
    return serialProvider.getPorts().then((ports) =>
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
