import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './miscToolsPlays.module.css';

const STACKS = [
  {
    id: 'pkm',
    label: 'База знаний (PKM)',
    tool: 'Obsidian / Logseq',
    format: 'Markdown в папках',
    sync: 'Git, Syncthing, iCloud',
    strength: 'Граф связей, daily notes, плагины',
    sample: '# Проект Alpha\n\n- [[Архитектура]]\n- [[API контракт]]\n\n```mermaid\nflowchart LR\n  A[Заметка] --> B[Связь]\n```',
  },
  {
    id: 'team',
    label: 'Команда / вики',
    tool: 'Notion / Outline / BookStack',
    format: 'Блоки / страницы в БД',
    sync: 'Облако SaaS или self-host',
    strength: 'Права, шаблоны, встроенные БД',
    sample: 'Страница: "Runbook инцидента"\n• Статус: 🔴 P1\n• Ответственный: @oncall\n• Чеклист: 1) алерт 2) rollback',
  },
  {
    id: 'secure',
    label: 'Приватные заметки',
    tool: 'Standard Notes / Joplin',
    format: 'E2E-шифрованные блокноты',
    sync: 'Свой сервер / WebDAV / S3',
    strength: 'Конфиденциальность, офлайн',
    sample: '[Зашифровано на клиенте]\nТолько вы видите текст после разблокировки мастер-паролем.',
  },
  {
    id: 'quick',
    label: 'Быстрые записи',
    tool: 'Google Keep / Simplenote',
    format: 'Облачные карточки',
    sync: 'Аккаунт провайдера',
    strength: 'Скорость, напоминания, мобильный виджет',
    sample: '☐ Купить SSL\n☐ Позвонить в поддержку\n📌 Закреплено: пароль Wi‑Fi гостевой',
  },
];

const STEPS = ['Захват', 'Структура', 'Связи', 'Публикация'];

function NotesWorkflowPlayInner() {
  const [stackId, setStackId] = useState('pkm');
  const [step, setStep] = useState(0);
  const s = STACKS.find((x) => x.id === stackId) ?? STACKS[0];

  return (
    <DemoShell>
      <DemoCard
        title="Жизненный цикл заметки"
        subtitle="Выберите стек и пройдите этапы от быстрой записи до общей базы"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {STACKS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(toolStyles.chip, stackId === item.id && toolStyles.chipActive)}
              onClick={() => {
                setStackId(item.id);
                setStep(0);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className={styles.workflowSteps}>
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              className={clsx(
                styles.step,
                i === step && styles.stepActive,
                i < step && styles.stepDone,
              )}
              onClick={() => setStep(i)}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>

        <p className={styles.lead}>
          <strong>{s.tool}</strong> — {s.strength}
        </p>
        <table className={styles.compareTable}>
          <tbody>
            <tr>
              <th>Формат</th>
              <td>{s.format}</td>
            </tr>
            <tr>
              <th>Синхронизация</th>
              <td>{s.sync}</td>
            </tr>
            <tr>
              <th>Этап "{STEPS[step]}"</th>
              <td>
                {step === 0 && 'Inbox, мобильный виджет, голосовая заметка'}
                {step === 1 && 'Папки, теги, MOC (карта содержания)'}
                {step === 2 && 'Wiki-ссылки [[...]], backlinks, граф'}
                {step === 3 && 'Экспорт PDF, публикация в Outline/Confluence'}
              </td>
            </tr>
          </tbody>
        </table>
        <pre className={styles.codeSample}>{s.sample}</pre>
        <p className="it-demo__hint" style={{marginTop: '0.5rem', marginBottom: 0}}>
          Совет: для IT-документации комбинируйте Markdown в Git + портал (Docusaurus, MkDocs).
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default NotesWorkflowPlayInner;
