import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {VIDEO_FILTERS, VIDEO_TOOLS} from '@/components/shared/kb/toolsNetworkData';
import {VideoConferenceSimulatorInner} from '@/components/demos/VideoConferenceSimulator';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './programPlays.module.css';

function VideoConferencingCatalogPlayInner() {
  const [cat, setCat] = useState('all');
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState('jitsi');
  const [showSim, setShowSim] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VIDEO_TOOLS.filter((v) => {
      if (cat !== 'all' && v.cat !== cat) return false;
      if (!q) return true;
      return `${v.name} ${v.cap}`.toLowerCase().includes(q);
    });
  }, [cat, query]);

  const tool = VIDEO_TOOLS.find((v) => v.id === picked) ?? filtered[0] ?? VIDEO_TOOLS[0];
  const catLabel = VIDEO_FILTERS.find((c) => c.id === tool?.cat)?.label ?? '';

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Видеосвязь и стриминг"
        subtitle="Self-host, облако или запись — выберите инструмент и откройте симулятор встречи"
      >
        <input
          type="search"
          className="it-demo__input"
          style={{width: '100%', marginBottom: '0.65rem'}}
          placeholder="Jitsi, Zoom, OBS…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Поиск видеосервиса"
        />
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {VIDEO_FILTERS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={clsx(toolStyles.chip, cat === c.id && toolStyles.chipActive)}
              onClick={() => setCat(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className={styles.explorer}>
          <ul className={styles.tree} aria-label="Список решений">
            {filtered.length === 0 ? (
              <li style={{padding: '0.5rem', fontSize: '0.8rem', opacity: 0.8}}>Ничего не найдено</li>
            ) : (
              filtered.map((v) => (
                <li key={v.id}>
                  <button
                    type="button"
                    className={clsx(styles.treeItem, picked === v.id && styles.treeItemActive)}
                    onClick={() => setPicked(v.id)}
                  >
                    <span>{v.name}</span>
                    <span className={styles.ext}>{v.cat}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
          <div className={styles.detail}>
            <h4 className={styles.detailTitle}>{tool.name}</h4>
            <p className={styles.detailRole}>
              {catLabel} · {tool.os}
            </p>
            <p>{tool.cap}</p>
            <p className={styles.detailRole} style={{marginTop: '0.5rem'}}>
              {tool.install}
            </p>
          </div>
        </div>
        <div style={{marginTop: '0.75rem', textAlign: 'center'}}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={() => setShowSim((v) => !v)}
          >
            {showSim ? 'Скрыть симулятор встречи' : 'Симулятор видеоконференции'}
          </button>
        </div>
        {showSim && (
          <div style={{marginTop: '0.85rem'}}>
            <VideoConferenceSimulatorInner compact />
          </div>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default VideoConferencingCatalogPlayInner;
