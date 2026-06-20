import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  LpChip,
  LpChipRow,
  LpCode,
  LpSection,
  LpStack,
  LpTableWrap,
  LpToggleRow,
} from './languagePlayUi';
import styles from './languageAdvancedPlays.module.css';

const FIELDS = [
  {id: 'name', label: 'Наименование'},
  {id: 'price', label: 'Цена'},
  {id: 'qty', label: 'Количество'},
  {id: 'warehouse', label: 'Склад'},
];

const SAMPLE = [
  {name: 'Кабель USB-C', price: 890, qty: 12, warehouse: 'Основной'},
  {name: 'Мышь Logitech', price: 2100, qty: 5, warehouse: 'Основной'},
  {name: 'Клавиатура', price: 4500, qty: 0, warehouse: 'Склад-2'},
];

function OneCQueryBuilderPlayInner() {
  const [selected, setSelected] = useState(['name', 'price']);
  const [filterStock, setFilterStock] = useState(true);

  const query = useMemo(() => {
    const fields = selected.map((id) => FIELDS.find((f) => f.id === id)?.label ?? id).join(',\n    ');
    return `ВЫБРАТЬ
    ${fields || '—'}
ИЗ
    Справочник.Номенклатура КАК Nomenclature
        ЛЕВОЕ СОЕДИНЕНИЕ РегистрНакопления.Остатки КАК Stock
        ПО Nomenclature.Ссылка = Stock.Номенклатура
ГДЕ
    ${filterStock ? 'Stock.Количество > 0' : 'ИСТИНА'}`;
  }, [selected, filterStock]);

  const rows = useMemo(() => {
    return SAMPLE.filter((r) => (filterStock ? r.qty > 0 : true)).map((r) => {
      const row = {};
      selected.forEach((id) => {
        row[id] = r[id];
      });
      return row;
    });
  }, [selected, filterStock]);

  const toggle = (id) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Конструктор запроса 1С"
        subtitle="Выберите поля — текст запроса и результат обновятся"
      >
        <LpStack>
          <LpSection label="Поля">
            <LpChipRow>
              {FIELDS.map((f) => (
                <LpChip key={f.id} active={selected.includes(f.id)} onClick={() => toggle(f.id)}>
                  {f.label}
                </LpChip>
              ))}
            </LpChipRow>
          </LpSection>

          <LpToggleRow>
            <input type="checkbox" checked={filterStock} onChange={(e) => setFilterStock(e.target.checked)} />
            <span>Только позиции с остатком &gt; 0</span>
          </LpToggleRow>

          <LpSection label="Текст запроса">
            <LpCode>{query}</LpCode>
          </LpSection>

          <LpSection label="Результат">
            <LpTableWrap>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {selected.length === 0 ? (
                      <th>—</th>
                    ) : (
                      selected.map((id) => (
                        <th key={id}>{FIELDS.find((f) => f.id === id)?.label}</th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 || selected.length === 0 ? (
                    <tr>
                      <td colSpan={Math.max(selected.length, 1)}>Нет данных</td>
                    </tr>
                  ) : (
                    rows.map((row, i) => (
                      <tr key={i}>
                        {selected.map((id) => (
                          <td key={id}>{row[id]}</td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </LpTableWrap>
          </LpSection>
        </LpStack>
      </DemoCard>
    </DemoShell>
  );
}

export default OneCQueryBuilderPlayInner;
