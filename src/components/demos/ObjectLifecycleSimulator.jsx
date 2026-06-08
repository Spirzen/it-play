import React, { useState, useEffect } from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';

const ObjectLifecycleSimulator = () => {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const [stackFrame, setStackFrame] = useState({ variableName: '', type: '', value: null });
  const [heapObjects, setHeapObjects] = useState([]);
  const [gcPhase, setGcPhase] = useState('idle');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const lifecycleSteps = [
    { id: 0, title: "Инициализация", desc: "Готовность среды выполнения." },
    { id: 1, title: "Проектирование сущности", desc: "Определение концепции, атрибутов и связей." },
    { id: 2, title: "Определение шаблона (класса)", desc: "Написание кода класса. Память не выделяется." },
    { id: 3, title: "Компиляция / Трансляция", desc: "Преобразование в байт-код или машинный код. Сохранение метаданных." },
    { id: 4, title: "Загрузка класса", desc: "Класс загружается в среду выполнения (JVM/CLR). Инициализация статических полей." },
    { id: 5, title: "Объявление переменной", desc: "Создание ссылки в стеке. Объект ещё не создан." },
    { id: 6, title: "Выделение памяти (куча)", desc: "Запрос памяти у ОС. Выделяется блок под объект." },
    { id: 7, title: "Инициализация объекта", desc: "Установка значений по умолчанию, вызов конструктора." },
    { id: 8, title: "Присваивание ссылки", desc: "Ссылка в стеке получает адрес объекта в куче." },
    { id: 9, title: "Запись в стек вызовов", desc: "Фрейм стека фиксирует ссылку для текущего метода." },
    { id: 10, title: "Обращение к полям", desc: "Доступ к данным через смещение адреса." },
    { id: 11, title: "Чтение из памяти", desc: "Загрузка данных из ОЗУ в кэш процессора." },
    { id: 12, title: "Битовая обработка", desc: "Манипуляции с битами на уровне процессора." },
    { id: 13, title: "Запись данных", desc: "Сохранение новых значений в память." },
    { id: 14, title: "Кэширование", desc: "Данные хранятся в быстрых регистрах CPU." },
    { id: 15, title: "Фрагментация кучи", desc: "Появление свободных \"дыр\" между объектами." },
    { id: 16, title: "Вызов методов", desc: "Переход по адресу, создание нового фрейма стека." },
    { id: 17, title: "Логика выполнения", desc: "ALU-операции, ветвления, циклы." },
    { id: 18, title: "Построение модели", desc: "Связывание объектов в граф." },
    { id: 19, title: "Использование объекта", desc: "Передача параметров, сериализация." },
    { id: 20, title: "Поиск объекта", desc: "Обход графа ссылок, хэширование." },
    { id: 21, title: "Сериализация", desc: "Преобразование в поток байтов." },
    { id: 22, title: "Десериализация", desc: "Восстановление объекта из потока." },
    { id: 23, title: "Проверка достижимости", desc: "GC проверяет связь с корнями." },
    { id: 24, title: "Фаза помечания (Mark)", desc: "Живые объекты помечаются зеленым." },
    { id: 25, title: "Фаза сборки (Sweep)", desc: "Мертвые объекты удаляются." },
    { id: 26, title: "Очистка ресурсов", desc: "Вызов деструктора/финализатора." },
    { id: 27, title: "Освобождение памяти", desc: "Возврат блока в пул свободной памяти." },
    { id: 28, title: "Удаление ссылки", desc: "Стек очищается при выходе из метода." },
    { id: 29, title: "Обнуление данных", desc: "Очистка памяти или оставление как есть." },
    { id: 30, title: "Профилирование", desc: "Анализ использования памяти." },
    { id: 31, title: "JIT-оптимизация", desc: "Компиляция часто используемого кода." },
    { id: 32, title: "Управление жизненным циклом", desc: "Финализация процесса." }
  ];

  const addLog = (text) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`]);
  };

  const handleNext = () => {
    if (isAnimating) return;
    
    let currentId = step + 1;
    if (currentId > 32) {
      resetSimulation();
      return;
    }

    setIsAnimating(true);
    const nextStep = lifecycleSteps.find(s => s.id === currentId);

    switch (nextStep.id) {
      case 5:
        setStackFrame({ variableName: 'obj', type: 'MyClass', value: 'null' });
        addLog("Объявлена ссылка 'obj' в стеке. Значение: null.");
        break;
      case 6:
        setHeapObjects(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), status: 'allocating', address: '0x' + Math.floor(Math.random()*10000).toString(16) }]);
        addLog("Выделен блок памяти в куче (Heap).");
        break;
      case 7:
        setHeapObjects(prev => prev.map(obj => obj.status === 'allocating' ? { ...obj, status: 'initialized', fields: { count: 0, name: 'default' } } : obj));
        addLog("Конструктор выполнен. Поля инициализированы.");
        break;
      case 8:
        setStackFrame(prev => ({ ...prev, value: heapObjects[heapObjects.length - 1]?.address || 'addr_0x...' }));
        addLog("Ссылка указывает на адрес объекта в куче.");
        break;
      case 23:
        setGcPhase('marking');
        addLog("GC начинает обход графа ссылок...");
        break;
      case 24:
        setHeapObjects(prev => prev.map(obj => ({ ...obj, marked: true })));
        addLog("Все живые объекты помечены.");
        break;
      case 25:
        setHeapObjects(prev => prev.filter(obj => obj.marked));
        setGcPhase('sweeping');
        addLog("Недостигаемые объекты удалены. Куча сжата.");
        break;
      case 28:
        setStackFrame({ variableName: '', type: '', value: null });
        addLog("Метод завершен. Ссылка удалена из стека.");
        break;
      default:
        addLog(nextStep.desc);
    }

    setTimeout(() => {
      setStep(currentId);
      setIsAnimating(false);
    }, 600);
  };

  const resetSimulation = () => {
    setStep(0);
    setStackFrame({ variableName: '', type: '', value: null });
    setHeapObjects([]);
    setGcPhase('idle');
    setLogs(["Симуляция сброшена."]);
  };

  const getResponsiveStyles = () => ({
    container: {
      fontFamily: 'Segoe UI, Tahoma, sans-serif',
      border: '1px solid #dcdcdc',
      borderRadius: '8px',
      padding: isMobile ? '12px' : '20px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      margin: isMobile ? '10px 0' : '20px 0',
      maxWidth: '100%',
      overflowX: 'hidden',
      position: 'relative'
    },
    header: {
      textAlign: 'center',
      marginBottom: isMobile ? '12px' : '20px',
      color: '#333',
      fontSize: isMobile ? '18px' : '24px',
      fontWeight: '600'
    },
    stageArea: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      minHeight: isMobile ? 'auto' : '300px',
      marginBottom: isMobile ? '12px' : '20px',
      gap: isMobile ? '12px' : '20px'
    },
    memoryBlock: {
      flex: 1,
      border: '2px dashed #ccc',
      borderRadius: '8px',
      padding: isMobile ? '10px' : '15px',
      backgroundColor: '#fff',
      position: 'relative',
      transition: 'all 0.3s ease',
      width: isMobile ? '100%' : 'auto',
      boxSizing: 'border-box'
    },
    stackBlock: {
      borderColor: '#2196F3',
      backgroundColor: '#e3f2fd'
    },
    heapBlock: {
      borderColor: '#FF9800',
      backgroundColor: '#fff3e0'
    },
    blockTitle: {
      fontWeight: 'bold',
      marginBottom: '8px',
      fontSize: isMobile ? '12px' : '14px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    objectCard: {
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: isMobile ? '6px' : '8px',
      marginBottom: isMobile ? '6px' : '8px',
      backgroundColor: '#fff',
      fontSize: isMobile ? '10px' : '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      wordBreak: 'break-word'
    },
    controls: {
      display: 'flex',
      justifyContent: 'center',
      gap: isMobile ? '8px' : '10px',
      marginBottom: isMobile ? '15px' : '20px',
      flexWrap: 'wrap'
    },
    button: {
      padding: isMobile ? '8px 16px' : '10px 20px',
      fontSize: isMobile ? '12px' : '14px',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#2196F3',
      color: 'white',
      fontWeight: 'bold',
      transition: 'background 0.2s',
      flex: isMobile ? '1' : 'auto',
      minWidth: isMobile ? '100px' : 'auto'
    },
    resetButton: {
      backgroundColor: '#f44336'
    },
    logArea: {
      height: isMobile ? '120px' : '150px',
      overflowY: 'auto',
      backgroundColor: '#263238',
      color: '#aed581',
      padding: '8px',
      borderRadius: '4px',
      fontFamily: 'Consolas, monospace',
      fontSize: isMobile ? '10px' : '12px',
      border: '1px solid #546e7a',
      wordBreak: 'break-word'
    },
    progressLine: {
      height: '4px',
      backgroundColor: '#eee',
      borderRadius: '2px',
      marginTop: '8px',
      overflow: 'hidden'
    },
    progressBar: {
      height: '100%',
      backgroundColor: '#4CAF50',
      transition: 'width 0.3s ease'
    },
    badge: {
      display: 'inline-block',
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: 'bold',
      marginRight: '4px'
    },
    gcBadge: {
      backgroundColor: '#FFEB3B',
      color: '#333',
      fontSize: isMobile ? '8px' : '10px',
      padding: isMobile ? '1px 4px' : '2px 6px'
    },
    descriptionBlock: {
      background: '#fff', 
      padding: isMobile ? '12px' : '15px', 
      borderRadius: '4px', 
      border: '1px solid #e0e0e0',
      marginBottom: isMobile ? '15px' : '20px'
    },
    heapContent: {
      height: isMobile ? '150px' : '180px', 
      overflowY: 'auto',
      maxHeight: isMobile ? '150px' : '180px'
    },
    stepInfo: {
      textAlign: 'right', 
      fontSize: isMobile ? '10px' : '12px', 
      color: '#666', 
      marginTop: '4px'
    }
  });

  const renderHeapObjects = () => {
    const styles = getResponsiveStyles();
    
    if (heapObjects.length === 0 && gcPhase === 'idle') {
      return <div style={{textAlign: 'center', color: '#999', marginTop: isMobile ? '50px' : '100px', fontSize: isMobile ? '12px' : '14px'}}>Куча пуста</div>;
    }
    
    return heapObjects.map((obj, index) => (
      <div 
        key={index} 
        style={{
          ...styles.objectCard,
          opacity: obj.marked ? 1 : 0.4,
          backgroundColor: obj.marked ? '#fff' : '#ffebee',
          borderLeft: obj.marked ? '4px solid #4CAF50' : '4px solid #f44336'
        }}
      >
        <div style={{display:'flex', justifyContent:'space-between', flexWrap: 'wrap', gap: '4px'}}>
          <strong>Obj #{index + 1}</strong>
          <span style={{color: '#666', fontSize: isMobile ? '9px' : '11px'}}>{obj.address}</span>
        </div>
        <div style={{marginTop: '4px', fontSize: isMobile ? '9px' : '11px', color: '#555'}}>
          <div>Адрес: <code>{obj.address}</code></div>
          <div>Статус: {obj.marked ? <span style={styles.gcBadge}>Живой</span> : <span style={{color:'#f44336'}}>Мертвый</span>}</div>
        </div>
        {obj.fields && (
          <div style={{marginTop: '4px', fontSize: isMobile ? '9px' : '10px', color: '#777'}}>
            Поля: {JSON.stringify(obj.fields)}
          </div>
        )}
      </div>
    ));
  };

  const currentStepData = lifecycleSteps.find(s => s.id === step) || lifecycleSteps[0];
  const responsiveStyles = getResponsiveStyles();

  return (
        <DemoShell>
        <DemoCard title="Жизненный цикл объекта" subtitle="От объявления ссылки в стеке до сборки мусора в куче.">
        <div style={responsiveStyles.container}>
          
          <div style={responsiveStyles.progressLine}>
            <div style={{...responsiveStyles.progressBar, width: `${(step / 32) * 100}%`}}></div>
          </div>
          <div style={responsiveStyles.stepInfo}>
            Шаг {step} из 32
          </div>

          <div style={responsiveStyles.stageArea}>
            <div style={{...responsiveStyles.memoryBlock, ...responsiveStyles.stackBlock}}>
              <div style={responsiveStyles.blockTitle}>Стек (Stack)</div>
              <div style={{fontSize: isMobile ? '10px' : '12px', color: '#555'}}>
                Хранит ссылки и локальные переменные.
              </div>
              <hr style={{border: '0', borderTop: '1px solid #bbdefb', margin: '8px 0'}} />
              
              {stackFrame.variableName ? (
                <div style={{
                  background: '#fff', 
                  padding: isMobile ? '6px' : '8px', 
                  borderRadius: '4px', 
                  border: '1px solid #2196F3',
                  boxShadow: '0 2px 4px rgba(33,150,243,0.2)'
                }}>
                  <div style={{fontWeight: 'bold', color: '#1565C0', fontSize: isMobile ? '12px' : '14px'}}>{stackFrame.variableName}</div>
                  <div style={{fontSize: isMobile ? '9px' : '11px', color: '#555'}}>Тип: {stackFrame.type}</div>
                  <div style={{fontSize: isMobile ? '9px' : '11px', color: '#555'}}>Значение: <code>{stackFrame.value}</code></div>
                </div>
              ) : (
                <div style={{color: '#90caf9', fontStyle: 'italic', fontSize: isMobile ? '10px' : '12px'}}>Ссылка не объявлена</div>
              )}
            </div>

            <div style={{...responsiveStyles.memoryBlock, ...responsiveStyles.heapBlock}}>
              <div style={responsiveStyles.blockTitle}>Куча (Heap)</div>
              <div style={{fontSize: isMobile ? '10px' : '12px', color: '#555'}}>
                Хранит сами объекты. Управление сборщиком мусора.
              </div>
              <hr style={{border: '0', borderTop: '1px solid #ffe0b2', margin: '8px 0'}} />
              
              <div style={responsiveStyles.heapContent}>
                {renderHeapObjects()}
              </div>
              
              {gcPhase !== 'idle' && (
                <div style={{
                  marginTop: '8px', 
                  padding: isMobile ? '4px' : '5px', 
                  background: '#fff8e1', 
                  borderRadius: '4px', 
                  fontSize: isMobile ? '9px' : '11px',
                  color: '#f57f17',
                  textAlign: 'center',
                  border: '1px solid #ffe0b2'
                }}>
                  ⚙️ GC работает: {gcPhase === 'marking' ? 'Пометка живых' : 'Очистка мертвых'}
                </div>
              )}
            </div>
          </div>

          <div style={responsiveStyles.controls}>
            <button 
              style={responsiveStyles.button} 
              onClick={handleNext} 
              disabled={step >= 32 || isAnimating}
            >
              {step >= 32 ? 'Завершено' : 'Следующий этап'}
            </button>
            
            <button 
              style={{...responsiveStyles.button, ...responsiveStyles.resetButton}} 
              onClick={resetSimulation}
              disabled={isAnimating}
            >
              Сброс
            </button>
          </div>

          <div style={responsiveStyles.descriptionBlock}>
            <strong style={{color: '#333', fontSize: isMobile ? '14px' : '16px'}}>{currentStepData.title}</strong>
            <p style={{margin: '5px 0 0 0', color: '#666', lineHeight: '1.5', fontSize: isMobile ? '12px' : '14px'}}>
              {currentStepData.desc}
            </p>
          </div>

          <div style={responsiveStyles.logArea}>
            {logs.map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          </div>
          
          <div style={{fontSize: isMobile ? '9px' : '11px', color: '#999', textAlign: 'center', marginTop: '10px'}}>
            Нажмите "Следующий этап", чтобы пройти путь от проектирования до очистки памяти.
          </div>
        </div>
        </DemoCard>
        </DemoShell>
  );
};

export default ObjectLifecycleSimulator;