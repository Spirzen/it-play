import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {getFranchise, RELEASE_TYPES} from '@/components/shared/kb/gameFranchiseData';
import styles from '@/components/demos/gameStudiesPlays.module.css';

function typeLabel(type) {
  return RELEASE_TYPES[type]?.label ?? type;
}

function typeColor(type) {
  return RELEASE_TYPES[type]?.color ?? '#6b7280';
}

function TimelineTab({franchise, releases, typeFilter, setTypeFilter}) {
  const filtered = useMemo(
    () =>
      typeFilter === 'all'
        ? releases
        : releases.filter((r) => r.type === typeFilter),
    [releases, typeFilter],
  );

  const [idx, setIdx] = useState(0);
  const safeIdx = Math.min(idx, Math.max(0, filtered.length - 1));
  const current = filtered[safeIdx];

  const years = releases.map((r) => r.year).filter(Boolean);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  if (!filtered.length) {
    return <p className={styles.hint}>Нет релизов для выбранного фильтра.</p>;
  }

  return (
    <>
      <div className={styles.filterRow}>
        {['all', 'main', 'expansion', 'spinoff'].map((t) => (
          <button
            key={t}
            type="button"
            className={clsx(styles.filterBtn, typeFilter === t && styles.filterBtnActive)}
            onClick={() => {
              setTypeFilter(t);
              setIdx(0);
            }}
          >
            {t === 'all' ? 'Все' : typeLabel(t)}
          </button>
        ))}
      </div>

      <div
        className={clsx(styles.panel, styles.panelAccent)}
        style={{'--accent': franchise.color}}
      >
        <h5 className={styles.releaseTitle}>{current.name}</h5>
        <div className={styles.releaseMeta}>
          {current.year != null && (
            <span className={styles.badge} style={{background: franchise.color}}>
              {current.year}
            </span>
          )}
          <span className={styles.badge} style={{background: typeColor(current.type)}}>
            {typeLabel(current.type)}
          </span>
          <span className={clsx(styles.badge, styles.badgeMuted)}>{current.platforms}</span>
        </div>
        <p className={styles.hint} style={{margin: 0}}>
          {current.note}
        </p>
      </div>

      <input
        type="range"
        className={styles.slider}
        min={0}
        max={Math.max(0, filtered.length - 1)}
        value={safeIdx}
        onChange={(e) => setIdx(Number(e.target.value))}
        aria-label="Хронология релизов"
      />
      <div className={styles.timelineTicks}>
        <span>{minYear}</span>
        <span>
          {safeIdx + 1} / {filtered.length}
        </span>
        <span>{maxYear}</span>
      </div>
    </>
  );
}

function MechanicsTab({mechanics, activeId, setActiveId}) {
  const active = mechanics.find((m) => m.id === activeId) ?? mechanics[0];
  return (
    <>
      <div className={styles.chips}>
        {mechanics.map((m) => (
          <button
            key={m.id}
            type="button"
            className={clsx(styles.chip, activeId === m.id && styles.chipActive)}
            onClick={() => setActiveId(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>
      {active && (
        <p className={styles.hint} style={{marginTop: '0.75rem'}}>
          <strong>{active.label}:</strong> {active.desc}
        </p>
      )}
    </>
  );
}

function LoreTab({lore, activeId, setActiveId}) {
  const active = lore.find((l) => l.id === activeId) ?? lore[0];
  return (
    <div className={styles.loreGrid}>
      {lore.map((node) => (
        <button
          key={node.id}
          type="button"
          className={clsx(styles.loreCard, activeId === node.id && styles.loreCardActive)}
          onClick={() => setActiveId(node.id)}
        >
          <strong>{node.label}</strong>
          <p className={styles.hint} style={{margin: '0.35rem 0 0'}}>
            {activeId === node.id ? node.desc : 'Нажмите, чтобы раскрыть'}
          </p>
        </button>
      ))}
    </div>
  );
}

function LootSpecial({tiers}) {
  const [tierId, setTierId] = useState(tiers[0].id);
  const tier = tiers.find((t) => t.id === tierId);
  return (
    <>
      <p className={styles.hint}>Симулятор "редкости лута" — ядро цикла Diablo.</p>
      <div className={styles.lootBar}>
        {tiers.map((t) => (
          <button
            key={t.id}
            type="button"
            className={clsx(styles.lootBtn, tierId === t.id && styles.lootBtnActive)}
            style={{background: t.color, color: tierId === t.id ? undefined : 'inherit'}}
            onClick={() => setTierId(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tier && <p className={styles.hint}>{tier.desc}</p>}
    </>
  );
}

function ProvincesSpecial({provinces}) {
  const [step, setStep] = useState(0);
  const p = provinces[step];
  return (
    <>
      <p className={styles.hint}>Эпохи Тамриэля — как менялся масштаб мира серии.</p>
      <div className={styles.provinceTrack}>
        {provinces.map((row, i) => (
          <button
            key={row.game}
            type="button"
            className={clsx(styles.provinceStep, step === i && styles.provinceStepActive)}
            onClick={() => setStep(i)}
          >
            <span className={styles.hint} style={{margin: 0, fontWeight: 700}}>
              {row.era}
            </span>
            <span>
              <strong>{row.place}</strong> — {row.game}
              <br />
              <span className={styles.hint}>{row.tone}</span>
            </span>
          </button>
        ))}
      </div>
      {p && (
        <p className={styles.hint}>
          Выбрано: <strong>{p.game}</strong> ({p.place}) — {p.tone}
        </p>
      )}
    </>
  );
}

function RacesSpecial({races}) {
  const [raceId, setRaceId] = useState(races[0].id);
  const race = races.find((r) => r.id === raceId);
  return (
    <>
      <p className={styles.hint}>Три асимметричные фракции — основа баланса RTS.</p>
      <div className={styles.chips}>
        {races.map((r) => (
          <button
            key={r.id}
            type="button"
            className={clsx(styles.chip, raceId === r.id && styles.chipActive)}
            onClick={() => setRaceId(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>
      {race && (
        <p className={styles.hint} style={{marginTop: '0.75rem'}}>
          <strong>{race.label}:</strong> {race.desc}
          {race.traits?.length > 0 && <> — {race.traits.join(', ')}</>}
        </p>
      )}
    </>
  );
}

function ArsenalSpecial({weaponEras, color}) {
  const [eraId, setEraId] = useState(weaponEras[0].era);
  const era = weaponEras.find((e) => e.era === eraId);
  return (
    <>
      <p className={styles.hint}>Арсенал по эпохам — от shareware 1993 до Eternal.</p>
      <div className={styles.weaponEra}>
        {weaponEras.map((e) => (
          <button
            key={e.era}
            type="button"
            className={clsx(styles.tab, eraId === e.era && styles.tabActive)}
            onClick={() => setEraId(e.era)}
          >
            {e.label}
          </button>
        ))}
      </div>
      {era && (
        <div className={styles.weaponList} style={{'--accent': color}}>
          {era.weapons.map((w) => (
            <span key={w} className={styles.weaponTag}>
              {w}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

function SpecialTab({franchise}) {
  if (franchise.specialMode === 'loot' && franchise.lootTiers) {
    return <LootSpecial tiers={franchise.lootTiers} />;
  }
  if (franchise.specialMode === 'provinces' && franchise.provinces) {
    return <ProvincesSpecial provinces={franchise.provinces} />;
  }
  if (franchise.specialMode === 'races' && franchise.races) {
    return <RacesSpecial races={franchise.races} />;
  }
  if (franchise.specialMode === 'arsenal' && franchise.weaponEras) {
    return <ArsenalSpecial weaponEras={franchise.weaponEras} color={franchise.color} />;
  }
  return null;
}

function GameFranchisePlayInner({franchise: franchiseId = 'elder-scrolls'}) {
  const franchise = getFranchise(franchiseId);
  const [tab, setTab] = useState('timeline');
  const [typeFilter, setTypeFilter] = useState('all');
  const [mechanicId, setMechanicId] = useState(null);
  const [loreId, setLoreId] = useState(null);

  if (!franchise) {
    return (
      <DemoShell>
        <DemoCard title="Игроведение">
          <p className={styles.hint}>Франшиза "{franchiseId}" не найдена в каталоге.</p>
        </DemoCard>
      </DemoShell>
    );
  }

  const releases = franchise.releases ?? [];
  const mechanics = franchise.mechanics ?? [];
  const lore = franchise.lore ?? [];
  const hasSpecial = Boolean(franchise.specialMode);
  const activeMechanic = mechanicId ?? mechanics[0]?.id;
  const activeLore = loreId ?? lore[0]?.id;

  const tabs = [
    {id: 'timeline', label: 'Хронология'},
    {id: 'mechanics', label: 'Механики'},
    ...(lore.length ? [{id: 'lore', label: 'Лор'}] : []),
    ...(hasSpecial ? [{id: 'special', label: 'Особое'}] : []),
  ];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title={`${franchise.icon} ${franchise.title}`}
        subtitle={franchise.tagline ?? `Интерактивный обзор серии · ${franchise.studio}`}
      >
        <div className={styles.tabs}>
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx(styles.tab, tab === t.id && styles.tabActive)}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'timeline' && (
          <TimelineTab
            franchise={franchise}
            releases={releases}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
          />
        )}
        {tab === 'mechanics' && mechanics.length > 0 && (
          <MechanicsTab
            mechanics={mechanics}
            activeId={activeMechanic}
            setActiveId={setMechanicId}
          />
        )}
        {tab === 'lore' && lore.length > 0 && (
          <LoreTab lore={lore} activeId={activeLore} setActiveId={setLoreId} />
        )}
        {tab === 'special' && hasSpecial && <SpecialTab franchise={franchise} />}

        <p className={styles.hint}>
          Данные упрощены для обучения; подробности — в тексте статьи ниже.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default GameFranchisePlayInner;
