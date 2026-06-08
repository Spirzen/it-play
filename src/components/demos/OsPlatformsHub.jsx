import React, {useCallback, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from './osPlays.module.css';

const PLATFORMS = [
  {id: 'windows', label: 'Windows', badge: 'NTFS'},
  {id: 'linux', label: 'Linux', badge: 'ext4'},
  {id: 'macos', label: 'macOS', badge: 'APFS'},
  {id: 'android', label: 'Android', badge: 'Linux'},
  {id: 'ios', label: 'iOS', badge: 'Darwin'},
];

const WIN_VIEWS = [
  {id: 'explorer', label: 'Проводник'},
  {id: 'taskmgr', label: 'Диспетчер задач'},
  {id: 'powershell', label: 'PowerShell'},
];

const WIN_FILES = [
  {name: 'Документы', type: 'folder'},
  {name: 'Загрузки', type: 'folder'},
  {name: 'report.docx', type: 'file'},
  {name: 'setup.exe', type: 'file'},
];

const WIN_PROCS = [
  {name: 'System', cpu: '2%', mem: '12 МБ'},
  {name: 'explorer.exe', cpu: '4%', mem: '89 МБ'},
  {name: 'chrome.exe', cpu: '18%', mem: '412 МБ'},
  {name: 'Code.exe', cpu: '7%', mem: '256 МБ'},
];

const LINUX_CMDS = {
  help: 'Доступно: help, ls, pwd, cd, cat, whoami, apt',
  ls: 'bin  boot  dev  etc  home  lib  usr  var',
  pwd: '/home/student',
  whoami: 'student',
  cat: 'Linux — ядро + GNU + DE. Дистрибутив = ядро + пакеты + оболочка.',
  'cd ..': '/',
  'cd /': '/',
  'cd /etc': '/etc',
  'apt update': 'Чтение списков пакетов… готово.',
  'apt install nginx': 'Установка nginx… зависимости разрешены. Готово.',
};

const MAC_APPS = [
  {id: 'finder', icon: '📁', label: 'Finder'},
  {id: 'terminal', icon: '⌨️', label: 'Terminal'},
  {id: 'settings', icon: '⚙️', label: 'Настройки'},
];

const MAC_FINDER = ['Macintosh HD', 'Applications', 'Users', 'tim — Домашняя'];
const MAC_TERM_LINES = [
  'Last login: Thu May 21 09:00:00',
  'tim@MacBook ~ % sw_vers',
  'ProductName:\tmacOS',
  'ProductVersion:\t15.0',
  'tim@MacBook ~ % uname',
  'Darwin',
];

function WindowsMini({view, setView}) {
  const path = 'C:\\Users\\User';

  return (
    <div className={styles.platformFrame}>
      <div className={styles.winDesktop}>
        <div className={styles.winWindow}>
          <div className={styles.winTitle}>
            <span>
              {view === 'explorer' && 'Проводник'}
              {view === 'taskmgr' && 'Диспетчер задач'}
              {view === 'powershell' && 'Windows PowerShell'}
            </span>
            <div className={styles.tabs} style={{margin: 0, flex: 1, justifyContent: 'flex-end'}}>
              {WIN_VIEWS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={clsx(styles.tab, view === v.id && styles.tabActive)}
                  style={{fontSize: '0.65rem', padding: '0.2rem 0.45rem'}}
                  onClick={() => setView(v.id)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.winBody}>
            {view === 'explorer' && (
              <>
                <p className={styles.mono} style={{color: '#555'}}>
                  {path}
                </p>
                {WIN_FILES.map((f) => (
                  <div key={f.name} className={styles.fileRow}>
                    <span>{f.type === 'folder' ? '📁' : '📄'}</span>
                    {f.name}
                  </div>
                ))}
              </>
            )}
            {view === 'taskmgr' && (
              <>
                <div className={styles.procRow} style={{fontWeight: 700}}>
                  <span>Процесс</span>
                  <span>ЦП</span>
                  <span>Память</span>
                </div>
                {WIN_PROCS.map((p) => (
                  <div key={p.name} className={styles.procRow}>
                    <span>{p.name}</span>
                    <span>{p.cpu}</span>
                    <span>{p.mem}</span>
                  </div>
                ))}
                <p className={styles.hint}>Планировщик Windows NT распределяет кванты времени CPU.</p>
              </>
            )}
            {view === 'powershell' && (
              <pre className={styles.mono}>
                {`PS ${path}> Get-Process | Select-Object -First 3\n\nHandles NPM(K) PM(K)\n------- ------ -----\n    892     45  41200 chrome\n    234     12   8900 explorer\n\nPS ${path}> `}
              </pre>
            )}
          </div>
        </div>
        <div className={styles.winTaskbar}>
          <button type="button" className={styles.winStart} title="Пуск">
            ⊞
          </button>
          <span style={{fontSize: '0.72rem', color: '#ccc'}}>Windows 11 · NTFS · x64</span>
        </div>
      </div>
    </div>
  );
}

function LinuxMini() {
  const [history, setHistory] = useState([
    {type: 'out', text: 'Добро пожаловать в учебный терминал. Введите help.'},
  ]);
  const [input, setInput] = useState('');

  const run = useCallback(
    (raw) => {
      const cmd = raw.trim();
      if (!cmd) return;
      const lines = [{type: 'in', text: `student@linux:~$ ${cmd}`}];
      const lower = cmd.toLowerCase();
      if (lower === 'help') lines.push({type: 'out', text: LINUX_CMDS.help});
      else if (lower === 'ls') lines.push({type: 'out', text: LINUX_CMDS.ls});
      else if (lower === 'pwd') lines.push({type: 'out', text: LINUX_CMDS.pwd});
      else if (lower === 'whoami') lines.push({type: 'out', text: LINUX_CMDS.whoami});
      else if (lower === 'cat readme') lines.push({type: 'out', text: LINUX_CMDS.cat});
      else if (LINUX_CMDS[lower]) lines.push({type: 'out', text: LINUX_CMDS[lower]});
      else if (lower.startsWith('cd ')) {
        const target = lower.slice(3);
        lines.push({
          type: 'out',
          text: LINUX_CMDS[target] ?? LINUX_CMDS['cd /etc'] ?? `cd: переход в ${target}`,
        });
      } else if (lower.startsWith('apt ')) {
        lines.push({type: 'out', text: LINUX_CMDS[lower] ?? 'Пакетный менеджер apt (deb).'});
      } else {
        lines.push({type: 'out', text: `Команда не найдена: ${cmd}. help — список.`});
      }
      setHistory((h) => [...h, ...lines]);
      setInput('');
    },
    [],
  );

  return (
    <div className={styles.platformFrame}>
      <div className={styles.linuxTerm}>
        <div className={styles.linuxHeader}>tim@ubuntu — bash — 80×24</div>
        <div className={styles.linuxOut}>
          {history.map((line, i) => (
            <div key={i}>
              {line.type === 'in' ? (
                <span className={styles.linuxPrompt}>{line.text}</span>
              ) : (
                line.text
              )}
            </div>
          ))}
        </div>
        <form
          className={styles.linuxInputRow}
          onSubmit={(e) => {
            e.preventDefault();
            run(input);
          }}
        >
          <span className={styles.linuxPrompt}>$</span>
          <input
            className={styles.linuxInput}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ls, pwd, apt install nginx…"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
}

const ANDROID_LAYERS = [
  'Linux kernel — драйверы, питание',
  'HAL — абстракция железа',
  'Native (C/C++) — SurfaceFlinger',
  'Android Runtime (ART) — bytecode → машинный код',
  'Framework — Activity, Service, ContentProvider',
  'Приложения (.apk)',
];

const IOS_LAYERS = [
  'Darwin / XNU — ядро как у macOS',
  'Core OS — I/O, память, безопасность',
  'Cocoa Touch — UIKit, SwiftUI',
  'Приложения (.app sandbox)',
];

function AndroidMini() {
  const [app, setApp] = useState('home');

  return (
    <div className={styles.platformFrame}>
      <div className={styles.mobileFrame}>
        <div className={styles.mobileDevice}>
          <div className={styles.mobileNotch} />
          <div className={clsx(styles.mobileScreen, styles.mobileAndroid)}>
            {app === 'home' && (
              <>
                <div style={{fontWeight: 700}}>12:30 · 5G</div>
                <div className={styles.appGrid}>
                  {[
                    {id: 'settings', icon: '⚙️', name: 'Настройки'},
                    {id: 'layers', icon: '📚', name: 'Слои'},
                    {id: 'store', icon: '🛒', name: 'Store'},
                    {id: 'files', icon: '📁', name: 'Файлы'},
                  ].map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      className={styles.appIcon}
                      onClick={() => setApp(a.id)}
                    >
                      <span>{a.icon}</span>
                      {a.name}
                    </button>
                  ))}
                </div>
              </>
            )}
            {app === 'layers' && (
              <>
                <button type="button" className={styles.tab} onClick={() => setApp('home')}>
                  ← Домой
                </button>
                <p style={{fontWeight: 700, margin: '0.35rem 0'}}>Стек Android</p>
                <ul className={styles.layerList}>
                  {ANDROID_LAYERS.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </>
            )}
            {app !== 'home' && app !== 'layers' && (
              <>
                <button type="button" className={styles.tab} onClick={() => setApp('home')}>
                  ← Домой
                </button>
                <p className={styles.hint}>AOSP + GMS · изоляция приложений · разрешения.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function IosMini() {
  const [app, setApp] = useState('home');

  return (
    <div className={styles.platformFrame}>
      <div className={styles.mobileFrame}>
        <div className={styles.mobileDevice}>
          <div className={styles.mobileNotch} />
          <div className={clsx(styles.mobileScreen, styles.mobileIos)}>
            {app === 'home' && (
              <>
                <div style={{fontWeight: 700, textAlign: 'center'}}>9:41</div>
                <div className={styles.appGrid}>
                  {[
                    {id: 'layers', icon: '📱', name: 'Слои'},
                    {id: 'sandbox', icon: '🔒', name: 'Sandbox'},
                    {id: 'photos', icon: '🖼️', name: 'Фото'},
                    {id: 'settings', icon: '⚙️', name: 'Настройки'},
                  ].map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      className={clsx(styles.appIcon, app === a.id && styles.appIconActive)}
                      onClick={() => setApp(a.id)}
                    >
                      <span>{a.icon}</span>
                      {a.name}
                    </button>
                  ))}
                </div>
              </>
            )}
            {app === 'layers' && (
              <>
                <button type="button" className={styles.tab} onClick={() => setApp('home')}>
                  ← Домой
                </button>
                <ul className={styles.layerList}>
                  {IOS_LAYERS.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </>
            )}
            {app === 'sandbox' && (
              <>
                <button type="button" className={styles.tab} onClick={() => setApp('home')}>
                  ← Домой
                </button>
                <p className={styles.hint}>
                  Каждое приложение — песочница: свой каталог, нет прямого доступа к данным соседей без
                  разрешений.
                </p>
              </>
            )}
            {app !== 'home' && app !== 'layers' && app !== 'sandbox' && (
              <>
                <button type="button" className={styles.tab} onClick={() => setApp('home')}>
                  ← Домой
                </button>
                <p className={styles.hint}>Закрытая экосистема App Store · подпись разработчика.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MacOsMini() {
  const [app, setApp] = useState('finder');

  return (
    <div className={styles.platformFrame}>
      <div className={styles.macDesktop}>
        <div className={styles.macMenuBar}>
          <span className={styles.macApple} aria-hidden>
            {'\uF8FF'}
          </span>
          <span style={{fontWeight: 800}}>Finder</span>
          <span>Файл</span>
          <span>Правка</span>
          <span>Вид</span>
          <span style={{marginLeft: 'auto', fontWeight: 400}}>⌘ — основная клавиша ярлыков</span>
        </div>
        <div className={styles.macWindow}>
          <div className={styles.macTraffic}>
            <span style={{background: '#ff5f57'}} />
            <span style={{background: '#febc2e'}} />
            <span style={{background: '#28c840'}} />
          </div>
          <div className={styles.winBody} style={{flex: 1}}>
            {app === 'finder' &&
              MAC_FINDER.map((item) => (
                <div key={item} className={styles.fileRow}>
                  <span>📁</span>
                  {item}
                </div>
              ))}
            {app === 'terminal' && (
              <pre className={styles.mono} style={{fontSize: '0.72rem'}}>
                {MAC_TERM_LINES.join('\n')}
              </pre>
            )}
            {app === 'settings' && (
              <p className={styles.hint}>
                Системные настройки · launchd · APFS · App Sandbox — типичные темы macOS в статье.
              </p>
            )}
          </div>
        </div>
        <div className={styles.macDock}>
          {MAC_APPS.map((a) => (
            <button
              key={a.id}
              type="button"
              className={styles.macDockIcon}
              title={a.label}
              onClick={() => setApp(a.id)}
              style={app === a.id ? {outline: '2px solid #007aff'} : undefined}
            >
              {a.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OsPlatformsHubInner({defaultPlatform = 'windows', compact}) {
  const [platform, setPlatform] = useState(
    PLATFORMS.some((p) => p.id === defaultPlatform) ? defaultPlatform : 'windows',
  );
  const [winView, setWinView] = useState('explorer');

  const current = PLATFORMS.find((p) => p.id === platform) ?? PLATFORMS[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title={compact ? 'Симулятор ОС' : 'Операционные системы — интерактивный обзор'}
        subtitle={
          compact
            ? 'Упрощённые интерфейсы для сравнения подходов'
            : 'Windows, Linux и macOS: переключайте платформу и изучайте типичные инструменты'
        }
      >
        <div className={styles.tabs}>
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(styles.tab, platform === p.id && styles.tabActive)}
              onClick={() => setPlatform(p.id)}
            >
              {p.label}
              <span className={styles.badge}>{p.badge}</span>
            </button>
          ))}
        </div>

        {platform === 'windows' && <WindowsMini view={winView} setView={setWinView} />}
        {platform === 'linux' && <LinuxMini />}
        {platform === 'macos' && <MacOsMini />}
        {platform === 'android' && <AndroidMini />}
        {platform === 'ios' && <IosMini />}

        <p className={styles.hint}>
          {platform === 'windows' &&
            'GUI (Проводник), фоновые службы, PowerShell — три грани одной ОС. Реестр и AD — в отдельной статье Windows.'}
          {platform === 'linux' &&
            'CLI и пакетный менеджер — норма для админов и разработчиков; DE (GNOME/KDE) строится поверх X11/Wayland.'}
          {platform === 'macos' &&
            'Darwin + Aqua: Unix внутри, закрытая экосистема снаружи. ⌘ заменяет часть Ctrl/Win.'}
          {platform === 'android' &&
            'Ядро Linux + слой Google: открытый AOSP и проприетарные GMS. Откройте "Слои" на экране телефона.'}
          {platform === 'ios' &&
            'Тот же Darwin, что у macOS, но жёсткая песочница приложений и единый магазин.'}
        </p>
        <p className={styles.mono} style={{marginTop: '0.35rem'}}>
          Фокус: {current.label} · ФС: {current.badge}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default OsPlatformsHubInner;
