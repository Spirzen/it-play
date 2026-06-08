import React, {useMemo, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import DesktopAppChrome from '@/components/shared/kb/DesktopAppChrome';
import styles from '@/components/demos/WordSimulator.module.css';

const TEMPLATES = {
  blank: {label: 'Пустой', html: '<p>Начните вводить текст…</p>'},
  letter: {
    label: 'Письмо',
    html: '<h2>Служебная записка</h2><p><strong>Кому:</strong> руководителю отдела</p><p><strong>Тема:</strong> согласование ТЗ</p><p>Прошу согласовать приложенное техническое задание до пятницы.</p>',
  },
  report: {
    label: 'Отчёт',
    html: '<h2>Еженедельный отчёт</h2><ol><li>Выполнено: 12 задач</li><li>В работе: интеграция API</li><li>Риски: задержка тестирования</li></ol>',
  },
};

function exec(cmd, value) {
  document.execCommand(cmd, false, value);
}

export function WordSimulatorInner({compact}) {
  const editorRef = useRef(null);
  const [template, setTemplate] = useState('letter');
  const [statsTick, setStatsTick] = useState(0);

  const stats = useMemo(() => {
    const root = editorRef.current;
    if (!root) return {words: 0, chars: 0};
    const text = root.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return {words, chars: text.length};
  }, [template, statsTick]);

  const applyTemplate = (key) => {
    setTemplate(key);
    if (editorRef.current) {
      editorRef.current.innerHTML = TEMPLATES[key].html;
      setStatsTick((n) => n + 1);
    }
  };

  const toolbar = (
    <>
      {Object.entries(TEMPLATES).map(([key, tpl]) => (
        <button
          key={key}
          type="button"
          className={clsx(template === key && styles.active)}
          onClick={() => applyTemplate(key)}
        >
          {tpl.label}
        </button>
      ))}
      <span className={styles.sep} />
      <button type="button" onClick={() => exec('bold')}>
        <strong>B</strong>
      </button>
      <button type="button" onClick={() => exec('italic')}>
        <em>I</em>
      </button>
      <button type="button" onClick={() => exec('formatBlock', 'h2')}>
        H2
      </button>
      <button type="button" onClick={() => exec('insertUnorderedList')}>
        • Список
      </button>
    </>
  );

  const chrome = (
    <DesktopAppChrome
      title="Document1.docx — Microsoft Word (симулятор)"
      accent="#2b579a"
      menu={
        <>
          <button type="button">Файл</button>
          <button type="button">Правка</button>
          <button type="button">Вид</button>
          <button type="button">Рецензирование</button>
        </>
      }
      toolbar={toolbar}
      status={
        <>
          Страница 1 · {stats.words} слов · {stats.chars} символов · DOCX (учебный режим)
        </>
      }
    >
      <div
        ref={editorRef}
        className={styles.editor}
        contentEditable
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{__html: TEMPLATES[template].html}}
        onInput={() => setStatsTick((n) => n + 1)}
      />
    </DesktopAppChrome>
  );

  if (compact) return chrome;

  return (
    <DemoShell>
      <DemoCard
        title="Симулятор Microsoft Word"
        subtitle="Шаблоны, форматирование и счётчик слов — как в текстовом процессоре"
      >
        {chrome}
        <p className={styles.hint}>
          В реальном Word стили, оглавление и рецензирование хранятся в DOCX (Office Open XML), а не
          только как видимый текст на экране.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default WordSimulatorInner;
