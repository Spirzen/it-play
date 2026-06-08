/** Данные для JobDslPlayground — статья 5-12-groovy/25. */

export const JOB_DSL_PRESETS = [
  {
    id: 'pipeline',
    label: 'Pipeline job',
    dsl: `pipelineJob('shop-build') {
    description('Сборка shop на каждый push в main')
    definition {
        cpsScm {
            scm {
                git {
                    remote { url('https://github.com/example/shop.git') }
                    branch('main')
                }
            }
            scriptPath('Jenkinsfile')
        }
    }
    triggers {
        scm('H/15 * * * *')
    }
}`,
    jobs: [
      {name: 'shop-build', type: 'Pipeline', detail: 'Script from SCM: Jenkinsfile'},
    ],
    notes: 'pipelineJob создаёт Pipeline as Code; triggers scm — опрос Git каждые ~15 мин.',
  },
  {
    id: 'freestyle',
    label: 'Freestyle + Gradle',
    dsl: `job('hello-groovy-nightly') {
    description('Ночная сборка Groovy-проекта')
    scm {
        git {
            remote { url('https://github.com/example/hello-groovy.git') }
            branch('main')
        }
    }
    triggers {
        cron('H 2 * * *')
    }
    steps {
        shell('./gradlew test --no-daemon')
    }
    publishers {
        junit('**/build/test-results/test/*.xml')
    }
}`,
    jobs: [
      {name: 'hello-groovy-nightly', type: 'Freestyle', detail: 'shell: gradlew test + junit'},
    ],
    notes: 'Классический job: SCM, cron, shell step, публикация JUnit.',
  },
  {
    id: 'folder',
    label: 'Папка и view',
    dsl: `folder('backend') {
    description('Сервисы backend-команды')
}

pipelineJob('backend/api-gateway') {
    definition {
        cps {
            script("""
                pipeline {
                    agent any
                    stages {
                        stage('Test') { steps { sh './gradlew test' } }
                    }
                }
            """.stripIndent())
        }
    }
}

listView('backend/all') {
    jobs {
        regex('backend/.*')
    }
    columns {
        status()
        weather()
        name()
        lastSuccess()
        lastFailure()
    }
}`,
    jobs: [
      {name: 'backend', type: 'Folder', detail: 'Группировка jobs'},
      {name: 'backend/api-gateway', type: 'Pipeline', detail: 'Inline CPS script'},
    ],
    views: [{name: 'backend/all', type: 'List', detail: 'Regex backend/.*'}],
    notes: 'folder + вложенный pipelineJob; listView фильтрует по regex.',
  },
];

export const SEED_FLOW = [
  {id: 'repo', label: 'Git-репозиторий', detail: 'jobs/*.groovy или dsl/*.groovy'},
  {id: 'seed', label: 'Seed job', detail: 'Freestyle: Process Job DSLs / Execute DSL'},
  {id: 'dsl', label: 'Job DSL script', detail: 'Groovy DSL → Jenkins model'},
  {id: 'jobs', label: 'Jobs на controller', detail: 'Pipeline, folder, view'},
];

export function getPreset(id) {
  return JOB_DSL_PRESETS.find((p) => p.id === id) ?? JOB_DSL_PRESETS[0];
}
