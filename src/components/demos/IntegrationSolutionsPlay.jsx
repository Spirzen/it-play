import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const STYLES = [
  {
    id: 'rest',
    label: 'REST / HTTP',
    transport: 'HTTP/1.1 или HTTP/2',
    format: 'JSON (часто XML)',
    contract: 'OpenAPI / неформальная документация',
    example: `GET /users/42 HTTP/1.1
Accept: application/json

{"id":42,"name":"Анна"}`,
    flow: ['Клиент', 'HTTP GET', 'API Gateway', 'Сервис', 'JSON-ответ'],
    pros: 'Простота, кэш, широкая поддержка',
    cons: 'Нет строгого контракта без OpenAPI',
  },
  {
    id: 'soap',
    label: 'SOAP / WCF',
    transport: 'HTTP, TCP, MSMQ',
    format: 'XML + WSDL',
    contract: 'WSDL, XSD, строгие контракты',
    example: `<soap:Envelope>
  <soap:Body>
    <SayHello><name>Анна</name></SayHello>
  </soap:Body>
</soap:Envelope>`,
    flow: ['Клиент', 'SOAP/XML', 'WCF Host', 'OperationContract', 'XML-ответ'],
    pros: 'Корпоративные стандарты, транзакции, WS-*',
    cons: 'Тяжеловесность, сложность настройки',
  },
  {
    id: 'rpc',
    label: 'gRPC / Thrift',
    transport: 'HTTP/2 (gRPC) или TCP',
    format: 'Protobuf / Thrift binary',
    contract: '.proto / .thrift IDL',
    example: `service UserService {
  rpc GetUser(UserId) returns (User);
}
// бинарный фрейм HTTP/2`,
    flow: ['Клиент', 'IDL stub', 'HTTP/2', 'Сервер', 'бинарный ответ'],
    pros: 'Скорость, строгие типы, стриминг',
    cons: 'Сложнее отладка в браузере',
  },
];

function IntegrationSolutionsPlayInner() {
  const [styleId, setStyleId] = useState('rest');
  const [step, setStep] = useState(0);
  const style = useMemo(() => STYLES.find((s) => s.id === styleId) ?? STYLES[0], [styleId]);

  return (
    <DemoShell>
      <DemoCard
        title="Стили интеграционных решений"
        subtitle="Сравните REST, SOAP/WCF и бинарный RPC по транспорту, формату и контракту."
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.75rem'}}>
          {STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(toolStyles.chip, styleId === s.id && toolStyles.chipActive)}
              onClick={() => {
                setStyleId(s.id);
                setStep(0);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="it-demo__grid it-demo__grid--2" style={{marginBottom: '1rem'}}>
          <div>
            <p className="it-demo__label">Транспорт</p>
            <p style={{margin: 0}}>{style.transport}</p>
            <p className="it-demo__label" style={{marginTop: '0.75rem'}}>
              Формат данных
            </p>
            <p style={{margin: 0}}>{style.format}</p>
            <p className="it-demo__label" style={{marginTop: '0.75rem'}}>
              Контракт
            </p>
            <p style={{margin: 0}}>{style.contract}</p>
          </div>
          <div>
            <p className="it-demo__label">Пример обмена</p>
            <pre
              className="it-demo__code"
              style={{margin: 0, fontSize: '0.78rem', maxHeight: '11rem', overflow: 'auto'}}
            >
              {style.example}
            </pre>
          </div>
        </div>

        <p className="it-demo__label">Цепочка вызова</p>
        <div className={toolStyles.chips}>
          {style.flow.map((label, i) => (
            <button
              key={label}
              type="button"
              className={clsx(toolStyles.chip, step === i && toolStyles.chipActive)}
              onClick={() => setStep(i)}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>
        <p style={{margin: '0.75rem 0 0', fontSize: '0.88rem'}}>
          Шаг {step + 1}: <strong>{style.flow[step]}</strong>
        </p>

        <div
          className="it-demo__grid it-demo__grid--2"
          style={{marginTop: '1rem', fontSize: '0.88rem'}}
        >
          <div>
            <span className="it-demo__label">Плюсы</span>
            <p style={{margin: 0}}>{style.pros}</p>
          </div>
          <div>
            <span className="it-demo__label">Минусы</span>
            <p style={{margin: 0}}>{style.cons}</p>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default IntegrationSolutionsPlayInner;
