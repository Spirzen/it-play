import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/WebViewBridgePlay.module.css';

const PLATFORMS = [
  {
    id: 'android',
    label: 'Android',
    engine: 'Chromium WebView',
    send: 'AndroidBridge.postMessage(JSON.stringify(msg))',
    recv: 'webView.evaluateJavascript("bridge.handleResponse(...)")',
  },
  {
    id: 'ios',
    label: 'iOS',
    engine: 'WKWebView / WebKit',
    send: 'webkit.messageHandlers.nativeBridge.postMessage(msg)',
    recv: 'WKScriptMessageHandler → evaluateJavaScript',
  },
  {
    id: 'windows',
    label: 'Windows',
    engine: 'WebView2 (Edge Chromium)',
    send: 'chrome.webview.postMessage(msg)',
    recv: 'CoreWebView2.WebMessageReceived',
  },
];

const PROCESSES = [
  {id: 'main', label: 'Основной процесс', desc: 'Нативный код, объект WebView'},
  {id: 'render', label: 'Рендеринг', desc: 'DOM, CSS, отрисовка'},
  {id: 'gpu', label: 'GPU', desc: 'Композитинг слоёв'},
  {id: 'network', label: 'Сеть', desc: 'HTTP, кэш'},
  {id: 'bridge', label: 'Мост (Bridge)', desc: 'JS ↔ нативный код'},
];

const NATIVE_HANDLERS = {
  getDeviceInfo: (platform) => ({
    platform,
    version: platform === 'android' ? '14' : platform === 'ios' ? '17.4' : '11',
    model: platform === 'android' ? 'Pixel 8' : platform === 'ios' ? 'iPhone 15' : 'Surface',
  }),
  shareContent: () => ({shared: true, channel: 'system_sheet'}),
  getGeolocation: () => ({latitude: 55.7558, longitude: 37.6173, accuracy: 12}),
};

const ALLOWED_HOSTS = ['app.example.com', 'example.com'];

function buildWebDocument() {
  const bridgeInit = 'window.__send = (m) => parent.postMessage({source:"webview",payload:m},"*");';

  return `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8">
<style>
  *{box-sizing:border-box}
  body{font-family:system-ui,sans-serif;margin:0;padding:1rem;background:linear-gradient(160deg,#f8fafc,#eef2ff);color:#1e293b}
  h2{margin:0 0 0.35rem;font-size:1rem;color:#4338ca}
  p{margin:0 0 0.75rem;font-size:0.78rem;line-height:1.45;color:#475569}
  .actions{display:flex;flex-wrap:wrap;gap:0.4rem}
  button{padding:0.45rem 0.7rem;font-size:0.72rem;border:0;border-radius:8px;background:#4338ca;color:#fff;cursor:pointer}
  button:hover{background:#3730a3}
  #out{margin-top:0.75rem;padding:0.55rem;font-size:0.68rem;font-family:ui-monospace,monospace;background:#fff;border:1px solid #c7d2fe;border-radius:6px;min-height:2.5rem;white-space:pre-wrap}
  .nav{margin-top:0.65rem;display:flex;gap:0.35rem;flex-wrap:wrap}
  .nav button{background:#0ea5e9}
  .nav button.danger{background:#dc2626}
</style></head><body>
<h2>Гибридный UI (HTML)</h2>
<p>Кнопки вызывают нативные методы через мост — ответ появится ниже.</p>
<div class="actions">
  <button type="button" data-call="getDeviceInfo">getDeviceInfo</button>
  <button type="button" data-call="shareContent">shareContent</button>
  <button type="button" data-call="getGeolocation">getGeolocation</button>
</div>
<div class="nav">
  <button type="button" data-url="https://app.example.com/home">app.example.com</button>
  <button type="button" data-url="https://evil.phish/login" class="danger">evil.phish</button>
</div>
<pre id="out">Ожидание вызова…</pre>
<script>
${bridgeInit}
var callId=0;
document.querySelectorAll('[data-call]').forEach(function(btn){
  btn.addEventListener('click',function(){
    var method=btn.getAttribute('data-call');
    var id=++callId;
    __send({id:id,method:method,params:{},dir:'js→native'});
    document.getElementById('out').textContent='→ '+method+' (id='+id+')';
  });
});
document.querySelectorAll('[data-url]').forEach(function(btn){
  btn.addEventListener('click',function(){
    __send({dir:'navigate',url:btn.getAttribute('data-url')});
  });
});
window.addEventListener('message',function(e){
  if(!e.data||e.data.dir!=='native→js')return;
  document.getElementById('out').textContent=JSON.stringify(e.data,null,2);
});
</script></body></html>`;
}

function formatTime() {
  return new Date().toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  });
}

function WebViewBridgePlayInner() {
  const [platform, setPlatform] = useState('android');
  const [secureMode, setSecureMode] = useState(true);
  const [activeProcesses, setActiveProcesses] = useState([]);
  const [log, setLog] = useState([]);
  const [lastNav, setLastNav] = useState(null);
  const iframeRef = useRef(null);
  const callSeq = useRef(0);

  const platformMeta = PLATFORMS.find((p) => p.id === platform) ?? PLATFORMS[0];
  const srcDoc = useMemo(() => buildWebDocument(), []);

  const appendLog = useCallback((entry) => {
    setLog((prev) => [{id: ++callSeq.current, time: formatTime(), ...entry}, ...prev].slice(0, 10));
  }, []);

  const pulseProcesses = useCallback((ids, ms = 1400) => {
    setActiveProcesses(ids);
    window.setTimeout(() => setActiveProcesses([]), ms);
  }, []);

  const postToWeb = useCallback((payload) => {
    const win = iframeRef.current?.contentWindow;
    if (win) win.postMessage(payload, '*');
  }, []);

  const handleBridgeCall = useCallback(
    (method, id) => {
      pulseProcesses(['bridge', 'main']);
      appendLog({
        dir: 'jsNative',
        text: `${platformMeta.send}`,
        detail: JSON.stringify({id, method, params: {}}),
      });

      window.setTimeout(() => {
        const result = NATIVE_HANDLERS[method]?.(platform) ?? {ok: true};
        const response = {id, result, dir: 'native→js'};
        postToWeb(response);
        pulseProcesses(['main', 'bridge', 'render']);
        appendLog({
          dir: 'nativeJs',
          text: platformMeta.recv,
          detail: JSON.stringify(response),
        });
      }, 520);
    },
    [appendLog, platform, platformMeta.recv, platformMeta.send, postToWeb, pulseProcesses],
  );

  const handleNavigate = useCallback(
    (url) => {
      let host = '';
      try {
        host = new URL(url).hostname;
      } catch {
        host = url;
      }
      const allowed = !secureMode || ALLOWED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
      setLastNav({url, allowed, host});
      pulseProcesses(allowed ? ['main', 'network', 'render'] : ['main']);
      appendLog({
        dir: allowed ? 'navOk' : 'navBlock',
        text: allowed ? `Загрузка: ${url}` : `shouldOverrideUrlLoading → блок: ${host}`,
        detail: secureMode ? 'whitelist включён' : 'режим без фильтра',
      });
      if (allowed) {
        postToWeb({dir: 'native→js', navigated: url});
      }
    },
    [appendLog, postToWeb, pulseProcesses, secureMode],
  );

  useEffect(() => {
    const onMessage = (event) => {
      if (event.data?.source !== 'webview') return;
      const payload = event.data.payload;
      if (!payload) return;
      if (payload.dir === 'navigate' && payload.url) {
        handleNavigate(payload.url);
        return;
      }
      if (payload.method) {
        handleBridgeCall(payload.method, payload.id);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [handleBridgeCall, handleNavigate]);

  useEffect(() => {
    setLastNav(null);
    setLog([]);
    postToWeb({dir: 'native→js', reset: true});
  }, [platform, postToWeb]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="WebView: процессы, мост и навигация"
        subtitle="Веб-контент внутри нативной оболочки — сообщения JSON и перехват URL"
      >
        <div className="it-demo__tabs">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx('it-demo__tab', platform === p.id && 'it-demo__tab--active')}
              onClick={() => setPlatform(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className={styles.engine}>{platformMeta.engine}</p>

        <div className={styles.layout}>
          <div className={styles.processCol}>
            <span className="it-demo__label">Процессная модель</span>
            <div className={styles.processStack}>
              {PROCESSES.map((proc) => (
                <div
                  key={proc.id}
                  className={clsx(
                    styles.process,
                    styles[`process_${proc.id}`],
                    activeProcesses.includes(proc.id) && styles.processActive,
                  )}
                  title={proc.desc}
                >
                  {proc.label}
                </div>
              ))}
            </div>
            <label className={styles.secureToggle}>
              <input
                type="checkbox"
                checked={secureMode}
                onChange={(e) => setSecureMode(e.target.checked)}
              />
              Whitelist URL (безопасный режим)
            </label>
            {lastNav && (
              <p className={clsx(styles.navVerdict, lastNav.allowed ? styles.navOk : styles.navBlock)}>
                {lastNav.allowed ? `✓ Разрешено: ${lastNav.host}` : `✕ Заблокировано: ${lastNav.host}`}
              </p>
            )}
          </div>

          <div className={styles.appCol}>
            <div className={styles.nativeShell}>
              <div className={styles.nativeTitle}>
                <span>MyApp</span>
                <span className={styles.nativeBadge}>Native</span>
              </div>
              <div className={styles.webviewChrome}>
                <span className={styles.webviewDot} />
                <span className={styles.webviewUrl}>
                  {lastNav?.allowed ? lastNav.url.replace(/^https:\/\//, '') : 'app.example.com/home'}
                </span>
              </div>
              <iframe
                ref={iframeRef}
                className={styles.webviewFrame}
                title="Содержимое WebView"
                sandbox="allow-scripts allow-same-origin"
                srcDoc={srcDoc}
              />
            </div>
          </div>

          <div className={styles.sideCol}>
            <span className="it-demo__label">Канал Bridge ({platformMeta.label})</span>
            <pre className={styles.apiSnippet}>
              <span className={styles.apiDir}>JS →</span> {platformMeta.send}
              {'\n'}
              <span className={styles.apiDir}>← Native</span> {platformMeta.recv}
            </pre>
            <span className="it-demo__label">Журнал</span>
            <ul className={styles.log}>
              {log.length === 0 ? (
                <li className={styles.logEmpty}>Нажмите кнопку в WebView или ссылку навигации</li>
              ) : (
                log.map((row) => (
                  <li key={row.id} className={clsx(styles.logRow, styles[`log_${row.dir}`])}>
                    <time>{row.time}</time>
                    <strong>{row.text}</strong>
                    <code>{row.detail}</code>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <p className="it-demo__hint" style={{marginTop: '0.75rem', marginBottom: 0}}>
          Сбой в процессе рендеринга не роняет основное приложение; мост изолирует вызовы API устройства. В
          production отключайте произвольную навигацию и <code>allowFileAccess</code>.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default WebViewBridgePlayInner;
