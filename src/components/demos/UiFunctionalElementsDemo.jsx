import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import ui from '@/components/shared/kb/uiInterfaceDemo.module.css';

function UiFunctionalElementsDemoInner() {
  const [text, setText] = useState('');
  const [select, setSelect] = useState('ru');
  const [volume, setVolume] = useState(60);
  const [notify, setNotify] = useState(true);
  const [tasks, setTasks] = useState({a: true, b: false, c: false});
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastAction, setLastAction] = useState('—');

  const toggleTask = (key) => {
    setTasks((prev) => ({...prev, [key]: !prev[key]}));
    setLastAction(`Чекбокс "${key}"`);
  };

  return (
    <DemoShell>
      <DemoCard
        title="Функциональные элементы"
        subtitle="Кнопки, поля ввода, списки, слайдер, переключатель и чекбоксы — попробуйте изменить состояние."
      >
        <div className={ui.mockApp}>
          <div className={ui.mockBar}>
            <span className={ui.mockDot} />
            <span className={ui.mockDot} />
            <span className={ui.mockDot} />
            <span style={{marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.7}}>
              Последнее: {lastAction}
            </span>
          </div>
          <div className={ui.mockBody}>
            <div className={ui.controlsGrid}>
              <div className={ui.controlBlock}>
                <span className="it-demo__label">Кнопки</span>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                  <button type="button" className={ui.uiBtn} onClick={() => setLastAction('Основная кнопка')}>
                    Сохранить
                  </button>
                  <button
                    type="button"
                    className={clsx(ui.uiBtn, ui.uiBtnSecondary)}
                    onClick={() => setLastAction('Вторичная')}
                  >
                    Отмена
                  </button>
                  <button type="button" className={clsx(ui.uiBtn, ui.uiBtnGhost)} onClick={() => setLastAction('⚙ Настройки')}>
                    ⚙
                  </button>
                </div>
              </div>

              <div className={ui.controlBlock}>
                <label className="it-demo__label" htmlFor="ui-demo-input">
                  Поле ввода
                </label>
                <input
                  id="ui-demo-input"
                  className={ui.uiInput}
                  placeholder="Введите email"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <div className={ui.controlBlock}>
                <label className="it-demo__label" htmlFor="ui-demo-select">
                  Выпадающий список
                </label>
                <select
                  id="ui-demo-select"
                  className={ui.uiSelect}
                  value={select}
                  onChange={(e) => {
                    setSelect(e.target.value);
                    setLastAction(`Язык: ${e.target.value}`);
                  }}
                >
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div className={ui.controlBlock}>
                <label className="it-demo__label" htmlFor="ui-demo-range">
                  Слайдер: {volume}%
                </label>
                <input
                  id="ui-demo-range"
                  type="range"
                  className={ui.uiRange}
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                />
              </div>

              <div className={ui.controlBlock}>
                <span className="it-demo__label">Переключатель</span>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <button
                    type="button"
                    className={clsx(ui.toggle, notify && ui.toggleOn)}
                    onClick={() => {
                      setNotify((v) => !v);
                      setLastAction('Уведомления');
                    }}
                    aria-pressed={notify}
                  >
                    <span className={ui.toggleKnob} />
                  </button>
                  <span>{notify ? 'Вкл' : 'Выкл'}</span>
                </div>
              </div>

              <div className={ui.controlBlock}>
                <span className="it-demo__label">Чекбоксы</span>
                {[
                  {key: 'a', label: 'Выполненная задача'},
                  {key: 'b', label: 'Невыполненная задача'},
                  {key: 'c', label: 'Другая задача'},
                ].map(({key, label}) => (
                  <label key={key} className={ui.checkRow}>
                    <input
                      type="checkbox"
                      checked={tasks[key]}
                      onChange={() => toggleTask(key)}
                    />
                    {label}
                  </label>
                ))}
              </div>

              <div className={ui.controlBlock} style={{position: 'relative'}}>
                <span className="it-demo__label">Меню</span>
                <button
                  type="button"
                  className={clsx(ui.uiBtn, ui.uiBtnGhost)}
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  Файл ▾
                </button>
                {menuOpen && (
                  <div className={ui.contextMenu} style={{position: 'relative', marginTop: '0.35rem'}}>
                    {['Создать', 'Открыть', 'Экспорт'].map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={ui.contextItem}
                        onClick={() => {
                          setLastAction(item);
                          setMenuOpen(false);
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default UiFunctionalElementsDemoInner;
