/** Данные для GroovyEcosystemPlay — статья 5-12-groovy/11. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура приложения'},
  {id: 'build', label: 'Сборка и артефакты'},
  {id: 'modules', label: 'Подключение библиотек'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'jvm',
    tag: 'Платформа',
    label: 'JVM и Java',
    color: '#e76f00',
    icon: '☕',
    items: ['JDK 8+ · bytecode', 'java.lang.* · Spring', 'ClassLoader · JAR'],
    detail:
      'Groovy компилируется в тот же байт-код, что и Java. Любые Java-библиотеки доступны без обёрток; Groovy-классы вызываются из Java как обычные beans.',
  },
  {
    id: 'runtime',
    tag: 'Runtime',
    label: 'Groovy · groovyc',
    color: '#639638',
    icon: 'G',
    items: ['groovy.jar · GroovyObject', 'MetaClass · Closure', '@CompileStatic'],
    detail:
      'Рантайм Groovy нужен для динамики и DSL. Статическая компиляция убирает часть зависимости от MetaClass в критичных модулях.',
  },
  {
    id: 'gdk',
    tag: 'GDK',
    label: 'Расширения JDK',
    color: '#4298b8',
    icon: '📚',
    items: ['DefaultGroovyMethods', 'JsonSlurper · XmlSlurper', 'each · collect · grep'],
    detail:
      'GDK добавляет методы к String, List, Map и File через метаклассы. Java-коллекции в Groovy-скрипте сразу получают функциональный API.',
  },
  {
    id: 'deps',
    tag: 'Зависимости',
    label: 'Gradle · Maven · Grape',
    color: '#10b981',
    icon: '📦',
    items: ['build.gradle', 'gmavenplus-plugin', '@Grab · Ivy', 'Maven Central'],
    detail:
      'Gradle DSL на Groovy — главный способ сборки. Grape подключает JAR прямо в скрипт. Maven смешивает Java и Groovy через gmavenplus.',
  },
  {
    id: 'frameworks',
    tag: 'Фреймворки',
    label: 'Gradle · Grails · Spock',
    color: '#7c3aed',
    icon: '⚙',
    items: ['Grails · GSP', 'Spock · Geb', 'Spring Groovy', 'Jenkins Pipeline'],
    detail:
      'Фреймворки используют замыкания и delegate: конфигурация сборки, веб-слой, тесты и CI выглядят как декларативный DSL, а не XML.',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Ваш Groovy-код',
    color: '#6366f1',
    icon: '🏗',
    items: ['*.groovy · buildSrc', 'controllers · services', 'Jenkinsfile · скрипты'],
    detail:
      'Прикладной код, DSL-правила, тесты Spock и скрипты автоматизации. Структура зависит от Grails, Spring Boot или "голого" Gradle-проекта.',
  },
];

/** Узлы графа зависимостей (viewBox 400×220). */
export const DEP_NODES = [
  {id: 'app', label: 'App.groovy', type: 'app', x: 200, y: 24},
  {id: 'services', label: 'services/', type: 'module', x: 90, y: 88},
  {id: 'build', label: 'build.gradle', type: 'module', x: 310, y: 88},
  {id: 'spock', label: 'src/test Spock', type: 'lazy', x: 200, y: 88},
  {id: 'spring', label: 'spring-boot', type: 'maven', x: 50, y: 168},
  {id: 'groovy', label: 'groovy-all', type: 'maven', x: 130, y: 168},
  {id: 'gradleApi', label: 'gradle-api', type: 'maven', x: 220, y: 168},
  {id: 'spockLib', label: 'spock-core', type: 'maven', x: 310, y: 168},
  {id: 'slf4j', label: 'slf4j-api', type: 'maven', x: 370, y: 168},
];

export const DEP_EDGES = [
  ['app', 'services'],
  ['app', 'build'],
  ['app', 'spock'],
  ['services', 'spring'],
  ['services', 'groovy'],
  ['services', 'slf4j'],
  ['build', 'gradleApi'],
  ['build', 'groovy'],
  ['spock', 'spockLib'],
  ['spock', 'groovy'],
  ['spock', 'services'],
  ['spring', 'slf4j'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа', stroke: '#6366f1'},
  module: {label: 'Модуль / скрипт', stroke: '#10b981'},
  lazy: {label: 'Тесты Spock', stroke: '#f59e0b', dash: '6 4'},
  maven: {label: 'Maven / Gradle deps', stroke: '#639638'},
};

export const ARCH_PRESETS = [
  {
    id: 'gradle-groovy',
    label: 'Gradle + Groovy',
    toolchain: 'build.gradle · compileGroovy · Spring Boot (опц.)',
    tree: [
      {
        type: 'dir',
        path: 'shop-groovy',
        children: [
          {
            type: 'file',
            path: 'shop-groovy/build.gradle',
            role: 'DSL сборки',
            hint: 'plugins { id "groovy" }; dependencies { implementation ... }',
          },
          {
            type: 'file',
            path: 'shop-groovy/settings.gradle',
            role: 'Мультипроект',
            hint: 'include ":app", ":buildSrc" — корень Gradle',
          },
          {
            type: 'dir',
            path: 'shop-groovy/buildSrc',
            role: 'Groovy в classpath сборки',
            children: [
              {
                type: 'file',
                path: 'shop-groovy/buildSrc/src/main/groovy/VersionPlugin.groovy',
                role: 'Свой плагин',
                hint: 'Компилируется до основного build.gradle',
              },
            ],
          },
          {
            type: 'dir',
            path: 'shop-groovy/src/main/groovy',
            children: [
              {
                type: 'file',
                path: 'shop-groovy/src/main/groovy/com/example/App.groovy',
                role: 'Точка входа',
                hint: 'static void main или @SpringBootApplication',
              },
              {
                type: 'dir',
                path: 'shop-groovy/src/main/groovy/com/example/services',
                children: [
                  {
                    type: 'file',
                    path: 'shop-groovy/src/main/groovy/com/example/services/OrderService.groovy',
                    role: 'Сервис',
                    hint: '@CompileStatic для hot-path; delegate для DSL',
                  },
                ],
              },
            ],
          },
          {
            type: 'dir',
            path: 'shop-groovy/src/test/groovy',
            children: [
              {
                type: 'file',
                path: 'shop-groovy/src/test/groovy/OrderSpec.groovy',
                role: 'Spock',
                hint: 'def "..."() { expect: ... where: ... }',
              },
            ],
          },
          {
            type: 'file',
            path: 'shop-groovy/build/libs/shop-groovy.jar',
            role: 'Артефакт',
            hint: './gradlew bootJar или jar — байт-код + зависимости',
          },
        ],
      },
    ],
  },
  {
    id: 'grails',
    label: 'Grails 6',
    toolchain: 'GORM · GSP · Spring Boot под капотом',
    tree: [
      {
        type: 'dir',
        path: 'crm-grails',
        children: [
          {type: 'file', path: 'crm-grails/build.gradle', role: 'Gradle', hint: 'org.grails.grails-web и плагины'},
          {type: 'file', path: 'crm-grails/grails-app/conf/application.yml', role: 'Конфиг', hint: 'Datasource, плагины, профили'},
          {
            type: 'dir',
            path: 'crm-grails/grails-app/controllers',
            children: [
              {
                type: 'file',
                path: 'crm-grails/grails-app/controllers/BookController.groovy',
                role: 'REST / MVC',
                hint: 'Динамические finders: Book.findByTitle(...)',
              },
            ],
          },
          {
            type: 'dir',
            path: 'crm-grails/grails-app/domain',
            children: [
              {
                type: 'file',
                path: 'crm-grails/grails-app/domain/Book.groovy',
                role: 'GORM-модель',
                hint: 'constraints, mapping — Hibernate под капотом',
              },
            ],
          },
          {
            type: 'dir',
            path: 'crm-grails/grails-app/views/book',
            children: [
              {
                type: 'file',
                path: 'crm-grails/grails-app/views/book/index.gsp',
                role: 'GSP',
                hint: 'Groovy в HTML: ${book.title}',
              },
            ],
          },
          {
            type: 'file',
            path: 'crm-grails/src/integration-test/groovy/BookSpec.groovy',
            role: 'Spock integration',
            hint: '@Integration, Geb для UI',
          },
        ],
      },
    ],
  },
  {
    id: 'jenkins',
    label: 'Jenkins Pipeline',
    toolchain: 'Jenkinsfile · shared libraries · Groovy sandbox',
    tree: [
      {
        type: 'dir',
        path: 'ci-repo',
        children: [
          {
            type: 'file',
            path: 'ci-repo/Jenkinsfile',
            role: 'Pipeline DSL',
            hint: 'pipeline { agent any; stages { stage("Build") { ... } } }',
          },
          {
            type: 'dir',
            path: 'ci-repo/vars',
            children: [
              {
                type: 'file',
                path: 'ci-repo/vars/deployApp.groovy',
                role: 'Shared library',
                hint: 'Вызов из Jenkinsfile: deployApp(version: "1.2")',
              },
            ],
          },
          {
            type: 'file',
            path: 'ci-repo/scripts/notify.groovy',
            role: 'Утилита',
            hint: 'Загрузка через load "scripts/notify.groovy"',
          },
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'source',
    label: 'Исходники',
    cmd: 'src/main/groovy/App.groovy\n@CompileStatic class OrderService { ... }',
    detail:
      'Файлы .groovy парсятся в AST. Аннотации @Immutable, @Delegate, @Lazy меняют дерево до генерации байт-кода.',
  },
  {
    id: 'compile',
    label: 'Компиляция',
    cmd: 'groovyc src/main/groovy/*.groovy\n# или\n./gradlew compileGroovy',
    detail:
      'groovyc выдаёт .class, совместимые с javac. Gradle вызывает compileGroovy после (или вместе с) compileJava в смешанных проектах.',
  },
  {
    id: 'resolve',
    label: 'Зависимости',
    cmd: 'dependencies {\n  implementation "org.apache.groovy:groovy:4.0.15"\n  testImplementation "org.spockframework:spock-core:2.3-groovy-4.0"\n}',
    detail:
      'Gradle разрешает дерево из Maven Central. В скрипте без сборки — @Grab("group:artifact:version") через Grape/Ivy.',
  },
  {
    id: 'test',
    label: 'Тесты',
    cmd: './gradlew test\n# Spock → JUnit Platform',
    detail:
      'Spock-классы компилируются в обычные JUnit-тесты. Geb добавляет Selenium-слой для UI.',
  },
  {
    id: 'package',
    label: 'Артефакт',
    cmd: './gradlew bootJar\n# build/libs/app.jar',
    detail:
      'JAR содержит байт-код Groovy/Java и зависимости (fat jar) или тонкий jar + lib/. Groovy-рантайм нужен, если нет @CompileStatic везде.',
  },
  {
    id: 'run',
    label: 'Запуск',
    cmd: 'java -jar build/libs/app.jar\n# скрипт:\ngroovy analyze-logs.groovy',
    detail:
      'Прод: JVM + jar. Скрипты: groovy или GroovyShell без предварительной сборки; Grape подтягивает библиотеки при старте.',
  },
];

export const MODULE_SYSTEMS = [
  {
    id: 'grape',
    label: 'Grape · @Grab',
    era: 'Автономный скрипт',
    color: '#4298b8',
    syntax: `@Grab('org.apache.commons:commons-math3:3.6.1')
import org.apache.commons.math3.stat.DescriptiveStatistics

def stats = new DescriptiveStatistics()
[1, 2, 3].each { stats.addValue(it) }`,
    traits: ['Один .groovy-файл', 'Ivy-кэш ~/.groovy/grapes', 'Без build.gradle'],
    tools: 'groovy script.groovy · Groovy Console',
    use: 'Утилиты, анализ логов, прототипы, Jenkins steps',
  },
  {
    id: 'gradle-dsl',
    label: 'Gradle Groovy DSL',
    era: 'Сборка · плагины',
    color: '#639638',
    syntax: `plugins {
    id 'groovy'
    id 'org.springframework.boot' version '3.2.0'
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter'
    testImplementation 'org.spockframework:spock-core:2.3-groovy-4.0'
}

tasks.named('test') { useJUnitPlatform() }`,
    traits: ['Closure + DELEGATE_FIRST', 'buildSrc на Groovy', 'Плагины расширяют DSL'],
    tools: 'gradlew · IntelliJ IDEA · buildSrc',
    use: 'Основной способ сборки Groovy/JVM-проектов',
  },
  {
    id: 'maven-mixed',
    label: 'Maven + gmavenplus',
    era: 'Java + Groovy',
    color: '#e76f00',
    syntax: `<plugin>
  <groupId>org.codehaus.gmavenplus</groupId>
  <artifactId>gmavenplus-plugin</artifactId>
</plugin>
<!-- src/main/java + src/main/groovy -->`,
    traits: ['Смешанные .java и .groovy', 'Порядок компиляции настраивается', 'pom.xml вместо build.gradle'],
    tools: 'mvn compile · gmavenplus · IDE Maven support',
    use: 'Legacy-энтерпрайз, постепенное внедрение Groovy в Java-модуль',
  },
];

export function flattenArchFiles(tree, acc = []) {
  for (const node of tree) {
    if (node.type === 'file') acc.push(node);
    if (node.children) flattenArchFiles(node.children, acc);
  }
  return acc;
}

export function getArchPreset(id) {
  return ARCH_PRESETS.find((p) => p.id === id) ?? ARCH_PRESETS[0];
}

export function activeDepEdges(enabledNodeIds) {
  return DEP_EDGES.filter(([from, to]) => enabledNodeIds.has(from) && enabledNodeIds.has(to));
}

export function defaultEnabledNodes() {
  return new Set(DEP_NODES.map((n) => n.id));
}

export function bundleSummary(enabledNodeIds) {
  const hasSpock = enabledNodeIds.has('spock');
  const mavenCount = DEP_NODES.filter((n) => n.type === 'maven' && enabledNodeIds.has(n.id)).length;
  const layers = hasSpock
    ? ['App.groovy', 'services/ · build.gradle · Spock', `Maven/Gradle deps: ${mavenCount}`]
    : ['App.groovy', 'services/ · build.gradle', `Deps: ${mavenCount - 1} (без spock-core)`];
  return {layers, hasSpock, mavenCount};
}
