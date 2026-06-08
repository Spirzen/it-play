import React, {useState} from 'react';

import clsx from 'clsx';

import {
  DataStructureLayout,
  LangTabs,
  CodeBlock,
  VizSection,
  InfoNote,
  ControlRow,
  resolveDataLang,
  useCopyToClipboard,
} from '@/components/shared/kb/dataStructureDemo';
import styles from '@/components/shared/kb/dataStructureDemo.module.css';

const CODE = {
  js: `// Создание стека (массив в JavaScript)
const stack = ['Базовый уровень', 'Второй слой'];

// PUSH — добавление сверху
stack.push('Новый элемент');
console.log(stack[stack.length - 1]); // "Новый элемент"

// POP — удаление сверху
const topElement = stack.pop();
console.log(topElement); // "Новый элемент"

// PEEK — просмотр без удаления
const peekElement = stack[stack.length - 1];
console.log(peekElement); // "Второй слой"`,
  py: `# Создание стека в Python
my_stack = ['Базовый уровень', 'Второй слой']

my_stack.append('Новый элемент')
print(my_stack[-1])  # "Новый элемент"

top_element = my_stack.pop()
print(top_element)  # "Новый элемент"

if my_stack:
    print(my_stack[-1])  # "Второй слой"`,
  java: `Deque<String> stack = new ArrayDeque<>();
stack.push("Базовый уровень");
stack.push("Второй слой");
stack.push("Новый элемент");
String top = stack.peek();   // PEEK
stack.pop();                 // POP`,
  cs: `var stack = new Stack<string> { "Базовый уровень", "Второй слой" };
stack.Push("Новый элемент");
Console.WriteLine(stack.Peek());
string topElement = stack.Pop();
Console.WriteLine(stack.Peek());`,
  dart: `final stack = <String>['Базовый уровень', 'Второй слой'];
stack.add('Новый элемент');
print(stack.last); // PEEK
stack.removeLast(); // POP`,
  r: `stack <- c("Базовый уровень", "Второй слой")
stack <- c(stack, "Новый элемент")
tail(stack, 1)  # PEEK
stack <- head(stack, -1)  # POP`,
  lua: `local stack = {"Базовый уровень", "Второй слой"}
table.insert(stack, "Новый элемент")
local top = stack[#stack]  -- PEEK
table.remove(stack)        -- POP`,
  groovy: `def stack = ['Базовый уровень', 'Второй слой']
stack << 'Новый элемент'
println stack[-1]  // PEEK
stack.pop()        // POP`,
  fortran: `! стек часто моделируют массивом + счётчик top
integer :: top = 0
character(len=32), allocatable :: stack(:)
! push: top = top + 1; pop: top = top - 1`,
  bsl: `Стек = Новый Массив;
Стек.Добавить("Базовый уровень");
Стек.Добавить("Второй слой");
Верх = Стек[Стек.ВГраница()]; // PEEK
Стек.Удалить(Стек.ВГраница()); // POP`,
};

function StackLogic({defaultLang = 'js'}) {
  const [activeTab, setActiveTab] = useState(() => resolveDataLang(defaultLang, CODE));
  const [stack, setStack] = useState(['Базовый уровень', 'Второй слой', 'Верхний элемент']);
  const [tempValue, setTempValue] = useState('');
  const [anim, setAnim] = useState(null);
  const [peek, setPeek] = useState(null);
  const {copied, copy} = useCopyToClipboard();

  const handlePush = () => {
    if (!tempValue.trim()) return;
    setAnim('push');
    setPeek(null);
    window.setTimeout(() => {
      setStack((s) => [...s, tempValue.trim()]);
      setTempValue('');
      setAnim(null);
    }, 320);
  };

  const handlePop = () => {
    if (!stack.length) return;
    setAnim('pop');
    setPeek(null);
    window.setTimeout(() => {
      setStack((s) => s.slice(0, -1));
      setAnim(null);
    }, 320);
  };

  const handlePeek = () => {
    if (!stack.length) return;
    setPeek(stack[stack.length - 1]);
  };

  return (
    <DataStructureLayout
      title="Стек (Stack)"
      subtitle="Линейная структура LIFO (Last In, First Out): последний добавленный элемент извлекается первым. Операции выполняются только с вершиной стека."
    >
      <LangTabs active={activeTab} onChange={setActiveTab} />
      <CodeBlock code={CODE[activeTab] ?? CODE.js} copied={copied} onCopy={copy} />

      <VizSection label="Интерактивная модель">
        <div className={styles.stackCol}>
          {stack
            .slice()
            .reverse()
            .map((item, index) => (
              <div
                key={`${item}-${index}`}
                className={clsx(
                  styles.stackItem,
                  index === 0 && styles.stackItemTop,
                  anim === 'push' && index === 0 && styles.stackItemEnter,
                  anim === 'pop' && index === 0 && styles.stackItemExit,
                )}
              >
                {item}
              </div>
            ))}
          {stack.length === 0 && (
            <div className={clsx(styles.stackItem)} style={{borderColor: 'var(--demo-border)', color: 'var(--demo-muted)', fontStyle: 'italic'}}>
              Пусто
            </div>
          )}
          <div className={styles.stackBase} aria-hidden="true" />
        </div>

        {peek && (
          <p className={styles.coordHint}>
            PEEK → <strong>{peek}</strong>
          </p>
        )}

        <ControlRow>
          <input
            type="text"
            className="it-demo__input"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder="Новое значение..."
            onKeyDown={(e) => e.key === 'Enter' && handlePush()}
            style={{flex: 1, minWidth: 140}}
          />
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={handlePush} disabled={!tempValue.trim()}>
            Push
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--danger" onClick={handlePop} disabled={!stack.length}>
            Pop
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={handlePeek} disabled={!stack.length}>
            Peek
          </button>
        </ControlRow>

        <p className={styles.coordHint} style={{color: 'var(--demo-muted)'}}>
          Элементов в стеке: <strong>{stack.length}</strong>
        </p>
      </VizSection>

      <InfoNote title="Как это работает:">
        Представьте стопку тарелок: класть и брать можно только сверху. Так устроены вызовы функций, история Undo/Redo и разбор выражений.
      </InfoNote>
    </DataStructureLayout>
  );
}

export default function DataStructureStack({defaultLang = 'js'}) {
  return <StackLogic/>;
}
