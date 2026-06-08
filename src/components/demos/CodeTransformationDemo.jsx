import React, {useState, useMemo} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import useCopyToClipboard from '@/components/shared/kb/useCopyToClipboard';
import styles from '@/components/demos/CodeTransformationDemo.module.css';

const VIEWS = [
  {id: 'source', label: 'Исходный код', short: 'Source', audience: 'Для разработчиков'},
  {id: 'bytecode', label: 'Байт-код', short: 'Bytecode', audience: 'Для виртуальной машины'},
  {id: 'machine', label: 'Машинный код', short: 'Machine', audience: 'Для процессора'},
];

const INSIGHTS = {
  source:
    'Исходный код — текст на языке высокого уровня. Понятен человеку, но процессор его не выполняет напрямую.',
  bytecode:
    'Промежуточный код компактнее исходника и платформонезависим: его читает JVM, CLR, V8 и т.д. (интерпретация или JIT).',
  machine:
    'Машинные инструкции для конкретной архитектуры (x86, ARM). Здесь только регистры, память и стек — без абстракций.',
};

const EXAMPLES = {
  java: {
    name: 'Java',
    icon: '☕',
    sourceCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,
    byteCode: `// javap -c Main.class
  public static void main(String[]);
    Code:
       0: getstatic     #2
       3: ldc           #3
       5: invokevirtual #4
       8: return`,
    machineCode: `; x86-64 (JIT)
main:
    push    rbp
    mov     edi, OFFSET .LC0
    call    puts
    xor     eax, eax
    ret
.LC0: .string "Hello World"`,
  },
  python: {
    name: 'Python',
    icon: '🐍',
    sourceCode: `def main():
    print("Hello World")

if __name__ == "__main__":
    main()`,
    byteCode: `  2 LOAD_GLOBAL    0 (print)
    4 LOAD_CONST     1 ('Hello World')
    6 CALL_FUNCTION  1
    8 RETURN_VALUE`,
    machineCode: `// CPython: VM выполняет байткод
case TARGET(CALL_FUNCTION):
    result = call_function(...);
    PUSH(result);`,
  },
  csharp: {
    name: 'C#',
    icon: '🔷',
    sourceCode: `class Program {
    static void Main() {
        Console.WriteLine("Hello World");
    }
}`,
    byteCode: `IL_0001: ldstr "Hello World"
IL_0006: call void Console::WriteLine(string)
IL_000b: ret`,
    machineCode: `; RyuJIT x64
    mov rcx, offset str
    call Console.WriteLine
    ret`,
  },
  javascript: {
    name: 'JavaScript',
    icon: '🟨',
    sourceCode: `function main() {
    console.log("Hello World");
}
main();`,
    byteCode: `LdaConstant [0]  // "Hello World"
LdaGlobal [console]
CallNoFeedback [log]`,
    machineCode: `; TurboFan JIT
    call StringPrint
    ret`,
  },
};

function CodeTransformationDemoInner() {
  const [lang, setLang] = useState('java');
  const [view, setView] = useState('source');
  const {copy, isCopied} = useCopyToClipboard();

  const ex = EXAMPLES[lang];
  const code = useMemo(() => {
    if (view === 'bytecode') return ex.byteCode;
    if (view === 'machine') return ex.machineCode;
    return ex.sourceCode;
  }, [ex, view]);

  const viewMeta = VIEWS.find((v) => v.id === view);

  return (
    <DemoShell>
      <DemoCard
        title="Трансформация кода"
        subtitle="Один и тот же &quot;Hello World&quot; на трёх уровнях абстракции"
      >
        <div className={styles.langRow}>
          {Object.entries(EXAMPLES).map(([key, l]) => (
            <button
              key={key}
              type="button"
              className={clsx('it-demo__btn it-demo__btn--sm', lang !== key && 'it-demo__btn--secondary')}
              onClick={() => {
                setLang(key);
                setView('source');
              }}
            >
              {l.icon} {l.name}
            </button>
          ))}
        </div>

        <div className={styles.pipeline} role="tablist">
          {VIEWS.map((v, i) => (
            <React.Fragment key={v.id}>
              {i > 0 && <span className={styles.pipelineArrow} aria-hidden>→</span>}
              <button
                type="button"
                role="tab"
                aria-selected={view === v.id}
                className={clsx(styles.pipelineStep, view === v.id && styles.pipelineStepActive)}
                onClick={() => setView(v.id)}
              >
                <strong>{v.label}</strong>
                <br />
                <small>{v.short}</small>
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className={styles.codeWindow}>
          <div className={styles.codeTitleBar}>
            <span>
              {ex.icon} {ex.name} · {viewMeta.short}
            </span>
            <span>{viewMeta.audience}</span>
          </div>
          <pre className={styles.codePre}>{code}</pre>
        </div>

        <div className="it-demo__row" style={{marginBottom: '0.75rem'}}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
            onClick={() => copy(code, 'code')}
          >
            {isCopied('code') ? '✓ Скопировано' : 'Копировать код'}
          </button>
        </div>

        <div className={styles.insight}>
          <strong>{viewMeta.label}.</strong> {INSIGHTS[view]}
        </div>

        <div className="it-demo__table-wrap">
          <table className={styles.compareTable}>
            <thead>
              <tr>
                <th>Характеристика</th>
                {VIEWS.map((v) => (
                  <th
                    key={v.id}
                    className={clsx(view === v.id && styles.colHighlight)}
                  >
                    {v.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Для кого', 'Программист', 'Виртуальная машина', 'Процессор'],
                ['Абстракция', 'Высокая', 'Средняя', 'Низкая'],
                ['Читаемость', 'Отличная', 'Средняя', 'Сложная'],
                ['Платформа', 'Обычно независим', 'Спецификация VM', 'x86 / ARM…'],
              ].map(([label, ...vals]) => (
                <tr key={label}>
                  <td>
                    <strong>{label}</strong>
                  </td>
                  {vals.map((cell, i) => (
                    <td
                      key={i}
                      className={clsx(view === VIEWS[i].id && styles.colHighlight)}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default CodeTransformationDemoInner;
