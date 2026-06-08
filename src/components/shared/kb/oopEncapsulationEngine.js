/** Данные и логика для демо "Инкапсуляция" (статья 4-08-oop/3). */

export const CONCEPT_TABS = [
  {
    id: 'modifiers',
    label: 'Модификаторы',
    hint: 'Класс2 обращается к Класс1: public доступен снаружи, private — только внутри класса.',
  },
  {
    id: 'getters',
    label: 'Геттер / сеттер',
    hint: 'Поле name скрыто; чтение и запись — только через методы с проверками.',
  },
  {
    id: 'bank',
    label: 'Банковский счёт',
    hint: 'Баланс private: снаружи меняют только через setBalance с валидацией.',
  },
];

export const CLASS1_MEMBERS = [
  {
    id: 'publicField',
    access: 'public',
    kind: 'field',
    name: 'публичноеПоле',
    type: 'String',
    value: '"Привет!"',
    externalCall: 'obj.публичноеПоле',
  },
  {
    id: 'privateField',
    access: 'private',
    kind: 'field',
    name: 'приватноеПоле',
    type: 'String',
    value: '"Это секрет!"',
    externalCall: 'obj.приватноеПоле',
  },
  {
    id: 'publicMethod',
    access: 'public',
    kind: 'method',
    name: 'публичныйМетод',
    sig: 'void публичныйМетод()',
    externalCall: 'obj.публичныйМетод()',
    output: 'Это публичный метод.',
  },
  {
    id: 'privateMethod',
    access: 'private',
    kind: 'method',
    name: 'приватныйМетод',
    sig: 'void приватныйМетод()',
    externalCall: 'obj.приватныйМетод()',
    output: 'Это приватный метод.',
  },
];

export function tryExternalAccess(memberId) {
  const member = CLASS1_MEMBERS.find((m) => m.id === memberId);
  if (!member) {
    return {ok: false, message: 'Неизвестный элемент'};
  }

  if (member.access === 'public') {
    if (member.kind === 'field') {
      return {
        ok: true,
        message: `вывод → ${member.value.replace(/"/g, '')}`,
        detail: `Доступ разрешён: ${member.externalCall}`,
      };
    }
    return {
      ok: true,
      message: member.output,
      detail: `Вызов: ${member.externalCall}`,
    };
  }

  return {
    ok: false,
    message: `Ошибка компиляции: '${member.name}' has private access in Класс1`,
    detail: `Недоступно из Класс2: ${member.externalCall}`,
  };
}

export const DEFAULT_USER = {
  varName: 'user',
  name: 'Анна',
};

export function createUserState({varName, name}) {
  return {
    varName: (varName || 'user').trim() || 'user',
    name: (name || '').trim(),
  };
}

export function tryDirectNameAccess(user) {
  return {
    ok: false,
    message: `Ошибка: поле 'name' has private access in User`,
    detail: `${user.varName}.name — прямой доступ запрещён`,
  };
}

export function getUserName(user) {
  return {
    ok: true,
    message: user.name || '(пусто)',
    detail: `${user.varName}.getName()`,
  };
}

export function setUserName(user, newName) {
  const trimmed = (newName ?? '').trim();
  if (!trimmed) {
    return {
      ok: false,
      message: 'Имя не может быть пустым!',
      detail: `${user.varName}.setName("")`,
      user: {...user},
    };
  }
  return {
    ok: true,
    message: `Имя установлено: ${trimmed}`,
    detail: `${user.varName}.setName("${trimmed}")`,
    user: {...user, name: trimmed},
  };
}

export const DEFAULT_BANK = {
  varName: 'account',
  balance: 1000,
};

export function createBankState({varName, balance}) {
  const b = Number(balance);
  return {
    varName: (varName || 'account').trim() || 'account',
    balance: Number.isFinite(b) ? b : 0,
  };
}

export function tryDirectBalanceAccess(bank) {
  return {
    ok: false,
    message: `Ошибка: поле 'баланс' has private access in БанковскийСчёт`,
    detail: `${bank.varName}.баланс — прямой доступ запрещён`,
  };
}

export function getBankBalance(bank) {
  return {
    ok: true,
    message: `${bank.balance.toLocaleString('ru-RU')} ₽`,
    detail: `${bank.varName}.получитьБаланс()`,
  };
}

export function setBankBalance(bank, newBalance, prevBalance) {
  const value = Number(newBalance);
  if (!Number.isFinite(value)) {
    return {
      ok: false,
      message: 'Введите число',
      detail: `${bank.varName}.установитьБаланс(...)`,
      bank: {...bank},
      logLine: null,
    };
  }
  if (value < 0) {
    return {
      ok: false,
      message: 'Ошибка: попытка установить отрицательный баланс.',
      detail: `${bank.varName}.установитьБаланс(${value})`,
      bank: {...bank},
      logLine: `Ошибка: попытка установить отрицательный баланс.`,
    };
  }
  const logLine = `Баланс изменён с ${prevBalance} на ${value}`;
  return {
    ok: true,
    message: logLine,
    detail: `${bank.varName}.установитьБаланс(${value})`,
    bank: {...bank, balance: value},
    logLine,
  };
}
