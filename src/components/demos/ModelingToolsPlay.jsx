import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import dataStyles from './dataToolsPlays.module.css';

const FAMILIES = [
  {
    id: 'art3d',
    label: '3D-художественное',
    tag: 'Меш · скульпт · анимация',
    examples: ['Blender', 'Maya', 'Cinema 4D', 'ZBrush'],
    fit: 'Персонажи, окружение, VFX, игровые ассеты, рендер.',
    formats: 'OBJ, FBX, glTF, USD',
    avoid: 'Точные допуски деталей без CAD — лучше FreeCAD/Fusion.',
  },
  {
    id: 'cad',
    label: 'CAD / САПР',
    tag: 'Параметрика · чертёж',
    examples: ['FreeCAD', 'Fusion 360', 'SolidWorks', 'OpenSCAD'],
    fit: 'Детали, узлы, чертежи, CAM, 3D-печать (STL/STEP).',
    formats: 'STEP, IGES, DXF, STL',
    avoid: 'Органические скульптуры — Blender/ZBrush быстрее.',
  },
  {
    id: 'bim',
    label: 'Архитектура / BIM',
    tag: 'Здания · IFC',
    examples: ['Revit', 'SketchUp', 'BlenderBIM', 'FreeCAD Arch'],
    fit: 'Планы, объёмы, спецификации, координация разделов.',
    formats: 'IFC, DWG (через конвертеры)',
    avoid: 'Игровые low-poly сцены — избыточная модель данных.',
  },
  {
    id: 'proc',
    label: 'Процедурное',
    tag: 'Ноды · HDA',
    examples: ['Houdini', 'Sverchok', 'Grasshopper', 'Geometry Nodes'],
    fit: 'Генерация городов, симуляции, параметрический дизайн.',
    formats: 'Alembic, VDB, собственные кэши',
    avoid: 'Разовая простая модель — overhead обучения.',
  },
  {
    id: 'science',
    label: 'Научное / симуляция',
    tag: 'Физика · агенты',
    examples: ['Gazebo', 'Simulink', 'AnyLogic', 'NetLogo'],
    fit: 'Роботы, системная динамика, очереди, агентные модели.',
    formats: 'URDF, SDF, собственные схемы',
    avoid: 'Маркетинговые ролики — видеоредакторы уместнее.',
  },
];

function ModelingToolsPlayInner() {
  const [active, setActive] = useState('art3d');
  const f = FAMILIES.find((x) => x.id === active) ?? FAMILIES[0];

  return (
    <DemoShell>
      <DemoCard
        title="Карта моделирования"
        subtitle="Выберите тип задачи — увидите типичные инструменты и форматы обмена"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.75rem', flexWrap: 'wrap'}}>
          {FAMILIES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(toolStyles.chip, active === item.id && toolStyles.chipActive)}
              onClick={() => setActive(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className={dataStyles.lead}>
          <strong>{f.label}</strong> · {f.tag}
        </p>
        <div className={dataStyles.exampleRow}>
          {f.examples.map((name) => (
            <span key={name} className={dataStyles.pill}>
              {name}
            </span>
          ))}
        </div>
        <div className={dataStyles.twoCol}>
          <div className={dataStyles.noteGood}>
            <strong>Когда уместно</strong>
            <p>{f.fit}</p>
            <p style={{marginTop: '0.35rem', fontSize: '0.78rem'}}>
              <strong>Форматы:</strong> {f.formats}
            </p>
          </div>
          <div className={dataStyles.noteWarn}>
            <strong>Осторожно</strong>
            <p>{f.avoid}</p>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ModelingToolsPlayInner;
