/** Данные и примеры для демо Dependency Inversion Principle. */

export const DEVICES = [
  {id: 'bulb', name: 'LightBulb', label: 'Лампочка', icon: '💡', accent: '#f39c12'},
  {id: 'fan', name: 'Fan', label: 'Вентилятор', icon: '🌀', accent: '#3498db'},
  {id: 'radio', name: 'Radio', label: 'Радио', icon: '📻', accent: '#e74c3c'},
  {id: 'heater', name: 'Heater', label: 'Обогреватель', icon: '🔥', accent: '#e67e22'},
];

export const BENEFITS = [
  {icon: '🔌', title: 'Гибкость', text: 'Switch не меняется при добавлении устройств'},
  {icon: '🧩', title: 'Расширяемость', text: 'Новый класс — только implements Switchable'},
  {icon: '🧪', title: 'Тестируемость', text: 'В тестах подставляется MockSwitchable'},
];

export const CODE_GOOD = `// Высокоуровневый модуль зависит от абстракции
interface Switchable {
  boolean isOn();
  void turnOn();
  void turnOff();
}

class Switch {
  private final Switchable device;

  Switch(Switchable device) {
    this.device = device;
  }

  void toggle() {
    if (device.isOn()) device.turnOff();
    else device.turnOn();
  }
}

// Любая реализация — Fan, Radio, Heater…
Switch s = new Switch(new Radio());`;

export const CODE_BAD = `// Нарушение DIP: Switch знает о LightBulb
class Switch {
  private LightBulb bulb;  // конкретный класс!

  void toggle() {
    if (bulb.isOn()) bulb.turnOff();
    else bulb.turnOn();
  }
}

// Добавить Fan? Переписывать Switch…`;

export function getDevice(id) {
  return DEVICES.find((d) => d.id === id) ?? DEVICES[0];
}
