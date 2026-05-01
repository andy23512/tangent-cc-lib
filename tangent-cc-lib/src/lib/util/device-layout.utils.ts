import { DeviceLayout } from '../model/device-layout.models.js';

export function downloadDeviceLayout(
  deviceLayout: DeviceLayout,
  device = 'TWO',
) {
  const blob = new Blob(
    [
      JSON.stringify({
        charaVersion: 1,
        type: 'layout',
        device,
        layout: deviceLayout.layout,
      }),
    ],
    {
      type: 'application/json',
    },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${deviceLayout.name.replace(/\.json$/, '')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
