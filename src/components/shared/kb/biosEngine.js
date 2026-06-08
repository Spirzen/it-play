export const BIOS_STATE = {
  OFF: 'off',
  POST: 'post',
  BOOT_MENU: 'boot_menu',
  BIOS_SETUP: 'bios_setup',
  LOADING_OS: 'loading_os',
  OS_LOADED: 'os_loaded',
};

export const DEFAULT_SYSTEM = {
  cpu: 'Intel Core i9-9900K @ 3.60GHz',
  ram: '32768 MB DDR4',
  gpu: 'NVIDIA GeForce RTX 3080',
  drives: [
    {id: 'IDE-0', name: 'SSD Samsung 970 EVO (Windows)', type: 'HDD', bootable: true},
    {id: 'IDE-1', name: 'HDD WD Blue 1TB', type: 'HDD', bootable: false},
    {id: 'USB-0', name: 'USB Flash Drive (Win10 Installer)', type: 'USB', bootable: true},
  ],
};

export const POST_SCRIPT = (system) => [
  {delay: 0, text: 'PhoenixBIOS v6.00 (c) 2026 Phoenix Technologies Ltd.'},
  {delay: 600, text: `CPU: ${system.cpu}`, tone: 'ok'},
  {delay: 400, text: 'Memory Test: Checking…', memoryBar: true},
  {delay: 1400, text: `Memory Test: ${system.ram} OK`, tone: 'ok'},
  {delay: 350, text: `Video Adapter: ${system.gpu}`, tone: 'ok'},
  {delay: 350, text: `Primary Master: ${system.drives[0].name}`, tone: 'ok'},
  {delay: 350, text: 'Secondary Master: None', tone: 'warn'},
  {delay: 350, text: 'USB Devices: Keyboard, Mouse', tone: 'ok'},
  {delay: 500, text: ''},
  {delay: 200, text: 'Press DEL to enter SETUP', tone: 'hint'},
  {delay: 0, text: 'Press F12 for Boot Menu', tone: 'hint'},
];

export const SETUP_TABS = ['Main', 'Advanced', 'Security'];

export function createDefaultSetupValues(system) {
  return {
    systemTime: '12:00:00',
    systemDate: 'Tue May 19 2026',
    processorType: system.cpu.split(' ').slice(0, 2).join(' '),
    totalMemory: system.ram,
    sataController: 'Enabled',
    usbLegacy: 'Enabled',
    virtualization: 'Disabled',
    bootOption1: system.drives[0].id,
    bootOption2: system.drives[1].id,
    adminPassword: 'Not Set',
    userPassword: 'Not Set',
    secureBoot: 'Disabled',
  };
}

export function getSetupRows(tab, values, system) {
  if (tab === 0) {
    return [
      {key: 'systemTime', name: 'System Time', value: values.systemTime, type: 'time'},
      {key: 'systemDate', name: 'System Date', value: values.systemDate, type: 'date'},
      {key: 'processorType', name: 'Processor Type', value: values.processorType, type: 'readonly'},
      {key: 'totalMemory', name: 'Total Memory', value: values.totalMemory, type: 'readonly'},
    ];
  }
  if (tab === 1) {
    return [
      {key: 'sataController', name: 'SATA Controller', value: values.sataController, type: 'bool'},
      {key: 'usbLegacy', name: 'USB Legacy Support', value: values.usbLegacy, type: 'bool'},
      {key: 'virtualization', name: 'Virtualization', value: values.virtualization, type: 'bool'},
      {
        key: 'bootOption1',
        name: 'Boot Option #1',
        value: values.bootOption1,
        type: 'device',
        label: system.drives.find((d) => d.id === values.bootOption1)?.name ?? values.bootOption1,
      },
      {
        key: 'bootOption2',
        name: 'Boot Option #2',
        value: values.bootOption2,
        type: 'device',
        label: system.drives.find((d) => d.id === values.bootOption2)?.name ?? values.bootOption2,
      },
    ];
  }
  return [
    {key: 'adminPassword', name: 'Administrator Password', value: values.adminPassword, type: 'pass'},
    {key: 'userPassword', name: 'User Password', value: values.userPassword, type: 'pass'},
    {key: 'secureBoot', name: 'Secure Boot', value: values.secureBoot, type: 'bool'},
  ];
}

export function toggleBoolValue(value) {
  return value === 'Enabled' ? 'Disabled' : 'Enabled';
}
