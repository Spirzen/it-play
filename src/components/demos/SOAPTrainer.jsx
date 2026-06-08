import React, {useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import useCopyToClipboard from '@/components/shared/kb/useCopyToClipboard';
import styles from '@/components/shared/kb/toolDemo.module.css';

const TABS = [
  {id: 'envelope', label: 'Envelope', tag: 'soap:Envelope'},
  {id: 'header', label: 'Header', tag: 'soap:Header'},
  {id: 'body', label: 'Body', tag: 'soap:Body'},
  {id: 'fault', label: 'Fault', tag: 'soap:Fault', faultOnly: true},
];

const EXPLANATIONS = {
  envelope:
    'Корневой элемент XML-документа SOAP. Определяет границы сообщения и пространство имён протокола.',
  header:
    'Метаданные: авторизация, маршрутизация, идентификаторы транзакций — обрабатываются до тела.',
  body: 'Полезная нагрузка: вызов метода сервиса или ответ с данными бизнес-логики.',
  fault:
    'Структура ошибки: Code, Reason, Node, Role и Detail — возвращается вместо обычного тела при сбое.',
};

const SOAP_NORMAL = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
  <soap:Header>
    <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
      <wsse:UsernameToken>
        <wsse:Username>admin</wsse:Username>
        <wsse:Password Type="...">secret123</wsse:Password>
      </wsse:UsernameToken>
    </wsse:Security>
  </soap:Header>
  <soap:Body>
    <GetUser xmlns="http://example.com/api">
      <UserId>12345</UserId>
    </GetUser>
  </soap:Body>
</soap:Envelope>`;

const SOAP_FAULT = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
  <soap:Header>
    <wsse:Security xmlns:wsse="..."/>
  </soap:Header>
  <soap:Body>
    <soap:Fault>
      <soap:Code>
        <soap:Value>soap:Receiver</soap:Value>
        <soap:Subcode>
          <soap:Value>soap:InvalidMessageName</soap:Value>
        </soap:Subcode>
      </soap:Code>
      <soap:Reason>
        <soap:Text xml:lang="en">Ошибка обработки сообщения</soap:Text>
      </soap:Reason>
      <soap:Node>https://example.com/service</soap:Node>
      <soap:Role>soap:Receiver</soap:Role>
      <soap:Detail>
        <error xmlns="">Неверный формат входных данных</error>
      </soap:Detail>
    </soap:Fault>
  </soap:Body>
</soap:Envelope>`;

function isLineActive(line, activeTag) {
  if (!activeTag) {
    return false;
  }
  const trimmed = line.trim();
  return (
    trimmed.includes(`<${activeTag}`) ||
    trimmed.includes(`</${activeTag}`) ||
    (activeTag === 'soap:Fault' && trimmed.includes('soap:Fault'))
  );
}

function SoapCodeView({code, activeTab}) {
  const activeTag = TABS.find((t) => t.id === activeTab)?.tag;

  return (
    <pre className="it-demo__terminal">
      {code.split('\n').map((line, index) => {
        const isActive = isLineActive(line, activeTag);
        return (
          <code
            key={index}
            className={clsx(styles.soapLine, isActive && styles.soapLineActive)}
          >
            {line}
          </code>
        );
      })}
    </pre>
  );
}

function SOAPTrainerInner() {
  const [activeTab, setActiveTab] = useState('envelope');
  const [isFaultMode, setIsFaultMode] = useState(false);
  const {copy, isCopied} = useCopyToClipboard();

  const code = isFaultMode ? SOAP_FAULT : SOAP_NORMAL;

  const visibleTabs = useMemo(
    () => TABS.filter((t) => !t.faultOnly || isFaultMode),
    [isFaultMode],
  );

  return (
    <DemoShell>
      <DemoCard
        title="Структура SOAP-сообщения"
        subtitle="Переключайте части Envelope и режим Fault — подсветка покажет активный блок в XML."
      >
        <label className={clsx('it-demo__panel', styles.toolbar)} style={{cursor: 'pointer'}}>
          <input
            type="checkbox"
            checked={isFaultMode}
            onChange={(e) => {
              setIsFaultMode(e.target.checked);
              if (!e.target.checked && activeTab === 'fault') {
                setActiveTab('body');
              }
            }}
          />
          <span style={{fontWeight: 600}}>Режим демонстрации ошибки (Fault)</span>
        </label>

        <div className="it-demo__tabs" role="tablist">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={clsx('it-demo__tab', activeTab === tab.id && 'it-demo__tab--active')}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <SoapCodeView code={code} activeTab={activeTab} />

        <div className={styles.toolbar}>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={() => copy(code, 'xml')}>
            {isCopied('xml') ? 'Скопировано' : 'Копировать XML'}
          </button>
        </div>

        <div className="it-demo__panel">
          <strong>Описание: {visibleTabs.find((t) => t.id === activeTab)?.label}</strong>
          <p style={{margin: '0.5rem 0 0', lineHeight: 1.55}}>{EXPLANATIONS[activeTab]}</p>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default SOAPTrainerInner;
