import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {BREADCRUMB_TRAIL} from '@/components/shared/kb/uiInterfaceDemoEngine';
import ui from '@/components/shared/kb/uiInterfaceDemo.module.css';

const SIDEBAR_ITEMS = [
  {id: 'home', label: 'Главная'},
  {id: 'catalog', label: 'Каталог'},
  {id: 'orders', label: 'Заказы'},
  {id: 'profile', label: 'Профиль'},
];

function UiNavigationElementsDemoInner() {
  const [crumbDepth, setCrumbDepth] = useState(4);
  const [page, setPage] = useState(1);
  const [sidebar, setSidebar] = useState('catalog');
  const totalPages = 12;

  const crumbs = BREADCRUMB_TRAIL.slice(0, crumbDepth);

  return (
    <DemoShell>
      <DemoCard
        title="Навигационные элементы"
        subtitle="Хлебные крошки, пагинация, боковая панель и футер — как пользователь ориентируется в структуре."
      >
        <div className={ui.mockApp}>
          <div className={ui.mockBar}>
            <span className={ui.mockDot} />
            <span className={ui.mockDot} />
            <span className={ui.mockDot} />
          </div>
          <div className={ui.mockBody}>
            <p className="it-demo__label">Хлебные крошки</p>
            <nav className={ui.breadcrumbs} aria-label="Путь в каталоге">
              {crumbs.map((item, i) => (
                <span key={item.label}>
                  {i > 0 && <span className={ui.breadcrumbSep}> / </span>}
                  {item.current ? (
                    <span className={ui.breadcrumbCurrent}>{item.label}</span>
                  ) : (
                    <button
                      type="button"
                      className={ui.breadcrumbLink}
                      onClick={() => setCrumbDepth(i + 1)}
                    >
                      {item.label}
                    </button>
                  )}
                </span>
              ))}
            </nav>

            <p className="it-demo__label" style={{marginTop: '1rem'}}>
              Пагинация (страница {page} из {totalPages})
            </p>
            <div className={ui.pagination}>
              <button
                type="button"
                className={ui.pageBtn}
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ‹
              </button>
              {[1, 2, 3, '…', totalPages].map((p, idx) =>
                typeof p === 'number' ? (
                  <button
                    key={`${p}-${idx}`}
                    type="button"
                    className={clsx(ui.pageBtn, page === p && ui.pageBtnActive)}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ) : (
                  <span key={`ellipsis-${idx}`} style={{padding: '0 0.25rem'}}>
                    …
                  </span>
                ),
              )}
              <button
                type="button"
                className={ui.pageBtn}
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                ›
              </button>
            </div>

            <p className="it-demo__label" style={{marginTop: '1rem'}}>
              Боковая панель и контент
            </p>
            <div className={ui.layoutWithSidebar}>
              <aside className={ui.sidebar} aria-label="Боковое меню">
                {SIDEBAR_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={clsx(ui.sidebarItem, sidebar === item.id && ui.sidebarItemActive)}
                    onClick={() => setSidebar(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </aside>
              <div>
                <p style={{margin: '0 0 0.5rem'}}>
                  Раздел: <strong>{SIDEBAR_ITEMS.find((s) => s.id === sidebar)?.label}</strong>
                </p>
                <p className={ui.hintText}>
                  Сайдбар держит фильтры и вторичную навигацию, не перегружая основную область.
                </p>
              </div>
            </div>

            <footer className={ui.footerMock}>
              <span>© IT Universe</span>
              <a href="#privacy">Конфиденциальность</a>
              <a href="#map">Карта сайта</a>
              <a href="#contact">Контакты</a>
            </footer>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default UiNavigationElementsDemoInner;
