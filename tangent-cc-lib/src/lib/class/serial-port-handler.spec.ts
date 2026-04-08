import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockRequestPort = vi.fn();
const mockGetPorts = vi.fn();

vi.stubGlobal('navigator', {
  serial: {
    requestPort: mockRequestPort,
    getPorts: mockGetPorts,
  },
});

function makePort(usbVendorId: number, usbProductId: number): SerialPort {
  return {
    getInfo: () => ({ usbVendorId, usbProductId }),
  } as unknown as SerialPort;
}

describe('SerialPortHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPort()', () => {
    it('calls requestPort when autoConnect is false', async () => {
      const { SerialPortHandler } = await import('./serial-port-handler.js');
      const mockPort = makePort(9114, 32783);
      mockRequestPort.mockResolvedValue(mockPort);

      const handler = new SerialPortHandler(false);
      const result = await handler.getPort();

      expect(mockGetPorts).not.toHaveBeenCalled();
      expect(mockRequestPort).toHaveBeenCalledOnce();
      expect(result).toBe(mockPort);
    });

    it('returns the single viable port when autoConnect is true and exactly one viable port exists', async () => {
      const { SerialPortHandler } = await import('./serial-port-handler.js');
      const viablePort = makePort(9114, 32783); // ONE M0
      mockGetPorts.mockResolvedValue([viablePort]);

      const handler = new SerialPortHandler(true);
      const result = await handler.getPort();

      expect(mockGetPorts).toHaveBeenCalledOnce();
      expect(mockRequestPort).not.toHaveBeenCalled();
      expect(result).toBe(viablePort);
    });

    it('falls back to requestPort when autoConnect is true but no viable ports exist', async () => {
      const { SerialPortHandler } = await import('./serial-port-handler.js');
      const unknownPort = makePort(0x1234, 0x5678);
      const mockPort = makePort(9114, 32783);
      mockGetPorts.mockResolvedValue([unknownPort]);
      mockRequestPort.mockResolvedValue(mockPort);

      const handler = new SerialPortHandler(true);
      const result = await handler.getPort();

      expect(mockRequestPort).toHaveBeenCalledOnce();
      expect(result).toBe(mockPort);
    });

    it('falls back to requestPort when autoConnect is true but multiple viable ports exist', async () => {
      const { SerialPortHandler } = await import('./serial-port-handler.js');
      const portA = makePort(9114, 32783); // ONE M0
      const portB = makePort(0x303a, 0x8253); // TWO S3
      const mockPort = makePort(9114, 32783);
      mockGetPorts.mockResolvedValue([portA, portB]);
      mockRequestPort.mockResolvedValue(mockPort);

      const handler = new SerialPortHandler(true);
      const result = await handler.getPort();

      expect(mockRequestPort).toHaveBeenCalledOnce();
      expect(result).toBe(mockPort);
    });
  });

  describe('getViablePorts() filtering', () => {
    it('includes only ports matching a known device filter', async () => {
      const { SerialPortHandler } = await import('./serial-port-handler.js');
      const knownPort = makePort(9114, 32783); // ONE M0
      const unknownPort = makePort(0xdead, 0xbeef);
      mockGetPorts.mockResolvedValue([knownPort, unknownPort]);

      const handler = new SerialPortHandler(true);
      // With 2 viable candidates we fall through to requestPort; use a custom
      // devicePorts map with two entries so exactly two known ports trigger
      // fallback, letting us inspect the filter behaviour via the path that
      // ends up calling requestPort after finding >1 viable port.
      // Instead, use a single-entry map so exactly one match returns directly.
      const singleDevicePorts = new Map([
        ['ONE M0', { usbProductId: 32783, usbVendorId: 9114 }],
      ]);
      const handlerSingle = new SerialPortHandler(true, singleDevicePorts);
      const result = await handlerSingle.getPort();

      expect(result).toBe(knownPort);
      expect(mockRequestPort).not.toHaveBeenCalled();
    });

    it('excludes ports with matching vendorId but wrong productId', async () => {
      const { SerialPortHandler } = await import('./serial-port-handler.js');
      const wrongProduct = makePort(9114, 0x9999);
      mockGetPorts.mockResolvedValue([wrongProduct]);
      const mockFallback = makePort(9114, 32783);
      mockRequestPort.mockResolvedValue(mockFallback);

      const handler = new SerialPortHandler(true);
      const result = await handler.getPort();

      expect(mockRequestPort).toHaveBeenCalledOnce();
      expect(result).toBe(mockFallback);
    });
  });

  describe('constructor', () => {
    it('defaults autoConnect to false', async () => {
      const { SerialPortHandler } = await import('./serial-port-handler.js');
      const mockPort = makePort(9114, 32783);
      mockRequestPort.mockResolvedValue(mockPort);

      const handler = new SerialPortHandler();
      expect(handler.autoConnect).toBe(false);
      await handler.getPort();
      expect(mockGetPorts).not.toHaveBeenCalled();
    });

    it('accepts a custom devicePorts map', async () => {
      const { SerialPortHandler } = await import('./serial-port-handler.js');
      const customPort = makePort(0xaaaa, 0xbbbb);
      mockGetPorts.mockResolvedValue([customPort]);

      const customPorts = new Map([
        ['Custom', { usbProductId: 0xbbbb, usbVendorId: 0xaaaa }],
      ]);
      const handler = new SerialPortHandler(true, customPorts);
      const result = await handler.getPort();

      expect(result).toBe(customPort);
      expect(mockRequestPort).not.toHaveBeenCalled();
    });
  });
});
