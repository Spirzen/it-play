/** Логика демо Dependency Injection (без React). */

export const INJECTION_TYPES = [
  {id: 'constructor', name: 'Constructor', desc: 'Через конструктор', antiPattern: false, recommended: true},
  {id: 'setter', name: 'Setter', desc: 'Через сеттер', antiPattern: false, recommended: false},
  {id: 'property', name: 'Property', desc: 'Через свойство', antiPattern: false, recommended: false},
  {id: 'field', name: 'Field', desc: 'Через поле', antiPattern: true, recommended: false},
  {id: 'method', name: 'Method', desc: 'Через метод', antiPattern: false, recommended: false},
];

export const COMPARISON_ROWS = [
  {criterion: 'Обязательность', constructor: 'Обязательная', setter: 'Опциональная', field: 'Неочевидна', method: 'На вызов'},
  {criterion: 'Изменяемость', constructor: 'Иммутабельная', setter: 'Мутабельная', field: 'Мутабельная', method: 'Не хранится'},
  {criterion: 'Тестируемость', constructor: 'Легко', setter: 'Доп. код', field: 'Сложно', method: 'Легко'},
  {criterion: 'Рекомендация', constructor: 'Лучший', setter: 'Опциональные deps', field: 'Избегать', method: 'Один вызов'},
];

export const CODE_SNIPPETS = {
  constructor: `// Constructor Injection (рекомендуется)
class UserService {
  private final EmailService emailService;

  public UserService(EmailService emailService) {
    this.emailService = emailService;
  }
}`,
  setter: `// Setter Injection
class UserService {
  private EmailService emailService;

  public void setEmailService(EmailService s) {
    this.emailService = s;
  }
}`,
  property: `// Property Injection
public class UserService {
  public IEmailService EmailService { get; set; }
}`,
  field: `// Field Injection (anti-pattern)
@Service
public class UserService {
  @Autowired
  private EmailService emailService;
}`,
  method: `// Method Injection
class UserService {
  public void register(User user, EmailService email) {
    email.send("Welcome!");
  }
}`,
};

export const CONTAINER_SNIPPET = `// IoC-контейнер управляет жизненным циклом
container.register<IEmailService, SmtpEmailService>(Lifetime.Singleton);
container.register<UserService>();

var userService = container.resolve<UserService>();`;

export function createEmailService(impl) {
  if (impl === 'mock') {
    return {
      channel: 'mock',
      send(msg) {
        return {ok: true, message: `[MOCK] ${msg}`, channel: 'mock'};
      },
    };
  }
  return {
    channel: 'smtp',
    send(msg) {
      return {ok: true, message: msg, channel: 'smtp'};
    },
  };
}

function userMessage(type, user) {
  const label = INJECTION_TYPES.find((t) => t.id === type)?.name ?? type;
  return `Welcome, ${user}! Registration via ${label} DI is complete.`;
}

export function createUserService(type, emailService) {
  switch (type) {
    case 'constructor': {
      if (!emailService) throw new Error('Constructor Injection требует EmailService');
      const svc = {injectedVia: 'constructor', emailService};
      return {
        ...svc,
        hasDependency: () => !!svc.emailService,
        register(user) {
          const msg = userMessage('constructor', user);
          svc.emailService.send(msg);
          return msg;
        },
      };
    }
    case 'setter': {
      const svc = {injectedVia: 'setter', emailService: null};
      return {
        ...svc,
        setEmailService(es) {
          svc.emailService = es;
        },
        hasDependency: () => !!svc.emailService,
        register(user) {
          if (!svc.emailService) throw new Error('EmailService не внедрён через setter');
          const msg = userMessage('setter', user);
          svc.emailService.send(msg);
          return msg;
        },
      };
    }
    case 'property': {
      const svc = {injectedVia: 'property', _email: null};
      return {
        ...svc,
        get EmailService() {
          return svc._email;
        },
        set EmailService(v) {
          svc._email = v;
        },
        hasDependency: () => !!svc._email,
        register(user) {
          if (!svc._email) throw new Error('EmailService не внедрён через property');
          const msg = userMessage('property', user);
          svc._email.send(msg);
          return msg;
        },
      };
    }
    case 'field': {
      const svc = {injectedVia: 'field', emailService: emailService ?? null};
      return {
        ...svc,
        hasDependency: () => !!svc.emailService,
        register(user) {
          if (!svc.emailService) throw new Error('EmailService не внедрён в поле');
          const msg = userMessage('field', user);
          svc.emailService.send(msg);
          return msg;
        },
      };
    }
    case 'method':
      return {
        injectedVia: 'method',
        hasDependency: () => false,
        register(user, es) {
          if (!es) throw new Error('EmailService должен быть передан в метод');
          const msg = userMessage('method', user);
          es.send(msg);
          return msg;
        },
      };
    default:
      throw new Error(`Unknown injection type: ${type}`);
  }
}

export function injectDependency(service, type, emailService) {
  if (!emailService) return;
  switch (type) {
    case 'setter':
      service.setEmailService?.(emailService);
      break;
    case 'property':
      service.EmailService = emailService;
      break;
    case 'field':
      service.emailService = emailService;
      break;
    default:
      break;
  }
}

export function registerUser(service, type, emailService, userName = 'DIP User') {
  if (type === 'method') return service.register(userName, emailService);
  injectDependency(service, type, emailService);
  return service.register(userName);
}

export class DIContainer {
  constructor() {
    this.services = new Map();
    this.instances = new Map();
  }

  register(name, factory, lifetime = 'transient') {
    this.services.set(name, {factory, lifetime});
  }

  resolve(name) {
    const reg = this.services.get(name);
    if (!reg) throw new Error(`Service ${name} not registered`);

    if (reg.lifetime === 'singleton') {
      if (!this.instances.has(name)) {
        this.instances.set(name, reg.factory());
      }
      return this.instances.get(name);
    }
    return reg.factory();
  }
}

export function runContainerRegistration(emailImpl, userName = 'Container User') {
  const container = new DIContainer();
  container.register('IEmailService', () => createEmailService(emailImpl), 'singleton');

  const emailService = container.resolve('IEmailService');
  const userService = createUserService('constructor', emailService);
  const message = userService.register(userName);
  const preview =
    emailImpl === 'mock' ? `[MOCK] ${message}` : message;

  return {
    ok: true,
    message,
    emailPreview: preview,
    channel: emailImpl,
    summary: 'DI-контейнер: singleton IEmailService → UserService (constructor)',
  };
}
