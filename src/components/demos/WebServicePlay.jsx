import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/shared/kb/testingDemo.module.css';

const STYLES = [
  {
    id: 'rest',
    label: 'REST',
    request: 'GET /v1/forecast?city=Moscow',
    response: '{\n  "city": "Moscow",\n  "temp": -5,\n  "condition": "облачно"\n}',
    status: 200,
  },
  {
    id: 'graphql',
    label: 'GraphQL',
    request: 'POST /graphql\n{ forecast(city: "Moscow") { temp condition } }',
    response: '{\n  "data": {\n    "forecast": { "temp": -5, "condition": "облачно" }\n  }\n}',
    status: 200,
  },
  {
    id: 'grpc',
    label: 'gRPC',
    request: 'WeatherService.GetForecast\n city: "Moscow" (protobuf)',
    response: 'бинарный фрейм HTTP/2\n temp=-5, condition=CLOUDY',
    status: 0,
  },
  {
    id: 'soap',
    label: 'SOAP',
    request: '<soap:GetForecast><city>Moscow</city></soap:GetForecast>',
    response: '<soap:Envelope>…<temp>-5</temp>…</soap:Envelope>',
    status: 200,
  },
];

function WebServicePlayInner() {
  const [styleId, setStyleId] = useState('rest');
  const [sent, setSent] = useState(false);
  const style = useMemo(() => STYLES.find((s) => s.id === styleId) ?? STYLES[0], [styleId]);

  const call = () => setSent(true);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Вызов веб-сервиса"
        subtitle="Клиент отправляет запрос — сервер возвращает данные без UI для человека"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.75rem'}}>
          {STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(toolStyles.chip, styleId === s.id && toolStyles.chipActive)}
              onClick={() => {
                setStyleId(s.id);
                setSent(false);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className={styles.lane}>
          <div className={styles.host}>
            <strong>Приложение</strong>
            <span>клиент</span>
          </div>
          <div className={styles.track}>
            <div className={styles.pipeline}>
              <span className={styles.pipeNode}>HTTP</span>
              <span className={styles.pipeArrow}>→</span>
              <span className={styles.pipeNode}>Веб-сервис</span>
            </div>
          </div>
          <div className={styles.host}>
            <strong>JSON / XML</strong>
            <span>ответ</span>
          </div>
        </div>

        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={call}>
          Отправить запрос
        </button>

        {sent && (
          <div className={styles.detailBox}>
            {style.status > 0 && (
              <span className={styles.badgeOk}>{style.status}</span>
            )}{' '}
            <strong>Запрос ({style.label})</strong>
            <pre className={styles.codeBlock} style={{marginTop: '0.35rem'}}>
              {style.request}
            </pre>
            <strong>Ответ</strong>
            <pre className={styles.codeBlock} style={{marginTop: '0.35rem'}}>
              {style.response}
            </pre>
          </div>
        )}
        {!sent && (
          <p className={styles.cardHint}>
            Веб-сервис — "невидимый" автомат: магазин, бот и мобильное приложение вызывают его по контракту (OpenAPI,
            .proto, WSDL).
          </p>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default WebServicePlayInner;
