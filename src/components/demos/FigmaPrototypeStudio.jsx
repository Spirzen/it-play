import React, {useCallback, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/FigmaPrototypeStudio.module.css';

const TOOLS = [
  {id: 'select', label: 'Выбор', icon: '↖'},
  {id: 'frame', label: 'Фрейм', icon: '▢'},
  {id: 'rect', label: 'Прямоугольник', icon: '▭'},
  {id: 'text', label: 'Текст', icon: 'T'},
  {id: 'button', label: 'Кнопка', icon: 'Btn'},
];

const PRESETS = [
  {id: 'desktop', label: 'Desktop 1440×900', w: 360, h: 225},
  {id: 'mobile', label: 'iPhone 375×812', w: 140, h: 280},
];

let elId = 0;
function newId() {
  elId += 1;
  return `el-${elId}`;
}

function FigmaPrototypeStudioInner() {
  const [tool, setTool] = useState('select');
  const [elements, setElements] = useState([
    {id: 'f1', type: 'frame', label: 'Главная', x: 24, y: 24, w: 360, h: 225},
    {id: 't1', type: 'text', label: 'IT Universe', x: 48, y: 48, w: 160, h: 32},
    {id: 'b1', type: 'button', label: 'Связаться', x: 48, y: 120, w: 120, h: 36},
  ]);
  const [selected, setSelected] = useState('f1');
  const [comments, setComments] = useState([
    {id: 1, target: 'b1', author: 'Заказчик', text: 'Сделать кнопку заметнее'},
  ]);
  const [commentText, setCommentText] = useState('');
  const [shareRole, setShareRole] = useState('edit');
  const [page, setPage] = useState('Главная');

  const selectedEl = elements.find((e) => e.id === selected);

  const addElement = useCallback(
    (type) => {
      const preset = type === 'frame' ? PRESETS[0] : {w: 100, h: type === 'text' ? 28 : 40};
      const node = {
        id: newId(),
        type,
        label: type === 'frame' ? 'Новый фрейм' : type === 'button' ? 'Кнопка' : 'Текст',
        x: 60 + elements.length * 8,
        y: 60 + elements.length * 8,
        w: preset.w,
        h: preset.h,
      };
      setElements((prev) => [...prev, node]);
      setSelected(node.id);
      setTool('select');
    },
    [elements.length],
  );

  const updateSelected = (patch) => {
    if (!selected) return;
    setElements((prev) => prev.map((e) => (e.id === selected ? {...e, ...patch} : e)));
  };

  const addComment = () => {
    if (!commentText.trim() || !selected) return;
    setComments((prev) => [
      ...prev,
      {id: Date.now(), target: selected, author: 'Вы', text: commentText.trim()},
    ]);
    setCommentText('');
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Симулятор Figma"
        subtitle="Фреймы, компоненты, комментарии и права доступа — как в облачном редакторе макетов"
      >
        <div className={styles.app}>
          <aside className={styles.sidebar}>
            <div className={styles.logo}>Figma · Demo</div>
            <div className={styles.pages}>
              <button
                type="button"
                className={clsx(styles.pageBtn, page === 'Главная' && styles.pageActive)}
                onClick={() => setPage('Главная')}
              >
                Главная
              </button>
              <button type="button" className={styles.pageBtn} onClick={() => setPage('Личный кабинет')}>
                + Страница
              </button>
            </div>
            <div className={styles.layers}>
              <div className={styles.layersHead}>Слои</div>
              {[...elements].reverse().map((el) => (
                <button
                  key={el.id}
                  type="button"
                  className={clsx(styles.layer, selected === el.id && styles.layerActive)}
                  onClick={() => setSelected(el.id)}
                >
                  {el.type}: {el.label}
                </button>
              ))}
            </div>
          </aside>

          <div className={styles.main}>
            <div className={styles.toolbar}>
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={clsx(styles.tool, tool === t.id && styles.toolActive)}
                  title={t.label}
                  onClick={() => {
                    setTool(t.id);
                    if (t.id !== 'select') addElement(t.id);
                  }}
                >
                  {t.icon}
                </button>
              ))}
              <span className={styles.sep} />
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={styles.preset}
                  onClick={() => addElement('frame')}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className={styles.canvas}>
              {elements.map((el) => (
                <div
                  key={el.id}
                  className={clsx(
                    styles.el,
                    styles[`el_${el.type}`],
                    selected === el.id && styles.elSelected,
                  )}
                  style={{left: el.x, top: el.y, width: el.w, height: el.h}}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(el.id);
                  }}
                >
                  {el.type === 'button' ? (
                    <span className={styles.btnInner}>{el.label}</span>
                  ) : (
                    el.label
                  )}
                  {comments.some((c) => c.target === el.id) && (
                    <span className={styles.commentDot} title="Есть комментарий" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <aside className={styles.inspector}>
            <h4 className={styles.insHead}>Дизайн</h4>
            {selectedEl ? (
              <>
                <label className={styles.field}>
                  Название
                  <input
                    value={selectedEl.label}
                    onChange={(e) => updateSelected({label: e.target.value})}
                  />
                </label>
                <div className={styles.grid2}>
                  <label className={styles.field}>
                    W
                    <input
                      type="number"
                      value={selectedEl.w}
                      onChange={(e) => updateSelected({w: Number(e.target.value)})}
                    />
                  </label>
                  <label className={styles.field}>
                    H
                    <input
                      type="number"
                      value={selectedEl.h}
                      onChange={(e) => updateSelected({h: Number(e.target.value)})}
                    />
                  </label>
                </div>
                <button type="button" className={styles.autoLayout}>
                  ⊞ Auto Layout
                </button>
              </>
            ) : (
              <p className={styles.muted}>Выберите объект</p>
            )}

            <h4 className={styles.insHead}>Share</h4>
            <select value={shareRole} onChange={(e) => setShareRole(e.target.value)}>
              <option value="edit">Can edit</option>
              <option value="comment">Can comment</option>
              <option value="view">Can view</option>
            </select>

            <h4 className={styles.insHead}>Комментарии</h4>
            <ul className={styles.commentList}>
              {comments.map((c) => (
                <li key={c.id}>
                  <strong>{c.author}</strong> → {elements.find((e) => e.id === c.target)?.label}
                  <br />
                  {c.text}
                </li>
              ))}
            </ul>
            {shareRole !== 'view' && (
              <>
                <textarea
                  rows={2}
                  placeholder="Комментарий к выбранному элементу…"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button type="button" className={styles.addComment} onClick={addComment}>
                  Оставить комментарий
                </button>
              </>
            )}
          </aside>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default FigmaPrototypeStudioInner;
