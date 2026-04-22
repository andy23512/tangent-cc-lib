// Reference: https://github.com/CharaChorder/DeviceManager/blob/45682f0d1adddb0d689285e284d309123028f22d/src/lib/serial/device.ts#L14-L24

export enum CharaChorderDevice {
  OneM0 = 'ONE M0',
  TwoS3PreProduction = 'TWO S3 (pre-production)',
  TwoS3 = 'TWO S3',
  LiteS2 = 'LITE S2',
  LiteM0 = 'LITE M0',
  X = 'X',
  M4GS3PreProduction = 'M4G S3 (pre-production)',
  M4GS3 = 'M4G S3',
  T4GS2 = 'T4G S2',
}

export const CHARACHORDER_DEVICES: CharaChorderDevice[] = [
  CharaChorderDevice.OneM0,
  CharaChorderDevice.TwoS3PreProduction,
  CharaChorderDevice.TwoS3,
  CharaChorderDevice.LiteS2,
  CharaChorderDevice.LiteM0,
  CharaChorderDevice.X,
  CharaChorderDevice.M4GS3PreProduction,
  CharaChorderDevice.M4GS3,
  CharaChorderDevice.T4GS2,
];

export const CHARACHORDER_3D_INPUT_DEVICES: CharaChorderDevice[] = [
  CharaChorderDevice.OneM0,
  CharaChorderDevice.TwoS3PreProduction,
  CharaChorderDevice.TwoS3,
  CharaChorderDevice.M4GS3PreProduction,
  CharaChorderDevice.M4GS3,
];

export const CHARACHORDER_DEVICE_PORTS = new Map<
  CharaChorderDevice,
  SerialPortFilter
>([
  [CharaChorderDevice.OneM0, { usbProductId: 32783, usbVendorId: 9114 }],
  [
    CharaChorderDevice.TwoS3PreProduction,
    { usbProductId: 0x8252, usbVendorId: 0x303a },
  ],
  [CharaChorderDevice.TwoS3, { usbProductId: 0x8253, usbVendorId: 0x303a }],
  [CharaChorderDevice.LiteS2, { usbProductId: 0x812e, usbVendorId: 0x303a }],
  [CharaChorderDevice.LiteM0, { usbProductId: 32796, usbVendorId: 9114 }],
  [CharaChorderDevice.X, { usbProductId: 0x818b, usbVendorId: 0x303a }],
  [
    CharaChorderDevice.M4GS3PreProduction,
    { usbProductId: 0x1001, usbVendorId: 0x303a },
  ],
  [CharaChorderDevice.M4GS3, { usbProductId: 0x829a, usbVendorId: 0x303a }],
  [CharaChorderDevice.T4GS2, { usbProductId: 0x82f2, usbVendorId: 0x303a }],
]);

export const CHARACHORDER_3D_INPUT_DEVICE_PORTS: Map<
  CharaChorderDevice,
  SerialPortFilter
> = new Map(
  CHARACHORDER_3D_INPUT_DEVICES.map((device) => [
    device,
    CHARACHORDER_DEVICE_PORTS.get(device) as SerialPortFilter,
  ]),
);
