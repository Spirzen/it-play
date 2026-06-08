import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {NOTIFICATION_TYPES} from '@/components/shared/kb/uiInterfaceDemoEngine';
import ui from '@/components/shared/kb/uiInterfaceDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const TOAST_CLASS = {
  info: ui.toastInfo,
  success: ui.toastSuccess,
  warning: ui.toastWarning,
  danger: ui.toastDanger,
};

function UiFeedbackElementsDemoInner() {
  const [toasts, setToasts] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [modal, setModal] = useState(null);
  const [email, setEmail] = useState('');
  const [context, setContext] = useState(null);

  const pushToast = (type) => {
    const meta = NOTIFICATION_TYPES.find((t) => t.id === type);
    setToasts((prev) => [
      ...prev,
      {id: Date.now(), tone: meta.tone, text: meta.label + ': действие выполнено'},
    ]);
  };

  const validateEmail = () => {
    if (!email.includes('@')) {
      return 'Укажите корректный email (нужен символ @)';
    }
    return '';
  };

  const error = validateEmail();

  return (
    <DemoShell>
      <DemoCard
        title="Элементы обратной связи"
        subtitle="Уведомления, подсказки, тултипы, ошибки формы и диалоговые окна."
      >
        <p className="it-demo__label">Уведомления</p>
        <div className={toolStyles.chips} style={{marginBottom: '0.5rem'}}>
          {NOTIFICATION_TYPES.map((t) => (
            <button key={t.id} type="button" className={toolStyles.chip} onClick={() => pushToast(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className={ui.toastStack}>
          {toasts.length === 0 ? (
            <p className={ui.hintText}>Нажмите тип уведомления, чтобы показать toast.</p>
          ) : (
            toasts.map((toast) => (
              <div key={toast.id} className={clsx(ui.toast, TOAST_CLASS[toast.tone])}>
                {toast.text}
              </div>
            ))
          )}
        </div>

        <div className={clsx('it-demo__grid', 'it-demo__grid--2')} style={{marginTop: '1rem'}}>
          <div>
            <p className="it-demo__label">Подсказка и тултип</p>
            <input
              className={ui.uiInput}
              placeholder="name@company.ru"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(error && email)}
            />
            <p className={ui.hintText}>Подсказка: используйте рабочий адрес для восстановления доступа.</p>
            <div className={ui.tooltipHost} style={{marginTop: '0.5rem'}}>
              <button
                type="button"
                className={clsx(ui.uiBtn, ui.uiBtnGhost)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
              >
                ?
              </button>
              {showTooltip && <span className={ui.tooltipBubble}>Формат: user@domain.ru</span>}
            </div>
            {error && email ? <p className={ui.errorText}>{error}</p> : null}
          </div>

          <div style={{position: 'relative'}}>
            <p className="it-demo__label">Контекстное меню</p>
            <button
              type="button"
              className={ui.uiBtn}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setContext({x: 0, y: rect.height + 4});
              }}
            >
              Правый клик (симуляция)
            </button>
            {context && (
              <div className={ui.contextMenu} style={{top: context.y, left: context.x}}>
                {['Копировать', 'Вставить', 'Удалить'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={ui.contextItem}
                    onClick={() => setContext(null)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="it-demo__label" style={{marginTop: '1rem'}}>
          Диалоговые окна
        </p>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
          <button type="button" className={ui.uiBtn} onClick={() => setModal('alert')}>
            Alert
          </button>
          <button type="button" className={clsx(ui.uiBtn, ui.uiBtnSecondary)} onClick={() => setModal('confirm')}>
            Подтверждение
          </button>
          <button type="button" className={clsx(ui.uiBtn, ui.uiBtnGhost)} onClick={() => setModal('modal')}>
            Модальное
          </button>
        </div>

        {modal && (
          <div className={ui.modalBackdrop} role="presentation" onClick={() => setModal(null)}>
            <div
              className={ui.modalBox}
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              {modal === 'alert' && (
                <>
                  <h4 style={{marginTop: 0}}>Предупреждение</h4>
                  <p>Файл не сохранён. Проверьте соединение.</p>
                  <button type="button" className={ui.uiBtn} onClick={() => setModal(null)}>
                    OK
                  </button>
                </>
              )}
              {modal === 'confirm' && (
                <>
                  <h4 style={{marginTop: 0}}>Удалить запись?</h4>
                  <p>Действие нельзя отменить.</p>
                  <div style={{display: 'flex', gap: '0.5rem'}}>
                    <button type="button" className={ui.uiBtn} onClick={() => setModal(null)}>
                      Да
                    </button>
                    <button type="button" className={clsx(ui.uiBtn, ui.uiBtnGhost)} onClick={() => setModal(null)}>
                      Нет
                    </button>
                  </div>
                </>
              )}
              {modal === 'modal' && (
                <>
                  <h4 style={{marginTop: 0}}>Модальное окно</h4>
                  <p>Фокус заблокирован на диалоге до закрытия.</p>
                  <button type="button" className={ui.uiBtn} onClick={() => setModal(null)}>
                    Закрыть
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default UiFeedbackElementsDemoInner;
