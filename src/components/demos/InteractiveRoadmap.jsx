import React, { useState } from 'react';

import DemoShell, {DemoCard} from '@/components/shared/DemoShell';



const roadmapData = [
  {
    id: 'basics',
    title: '1. Основы',
    description: 'Компьютерная грамотность, устройство ПК, данные, программы, карьера, английский язык.',
    children: [
      { id: '1.01', title: 'Давайте познакомимся' },
      { id: '1.02', title: 'Введение' },
      { id: '1.03', title: 'Дорожная карта изучения' },
      { id: '1.04', title: 'Как видят IT обычные люди' },
      { id: '1.05', title: 'Предупреждение' },
      { id: '1.06', title: 'Сленг' },
      { id: '1.07', title: 'Немного о прошлом' },
      { id: '1.08', title: 'Как работает компьютер' },
      { id: '1.09', title: 'Данные и информация' },
      { id: '1.10', title: 'Базовые операции с данными' },
      { id: '1.11', title: 'Софт рядового пользователя' },
      { id: '1.12', title: 'Советы для новичка' },
      { id: '1.13', title: 'Софт продвинутого пользователя' },
      { id: '1.14', title: 'Советы для продвинутого' },
      { id: '1.15', title: 'Текст' },
      { id: '1.16', title: 'Графика' },
      { id: '1.17', title: 'Аудио и видео' },
      { id: '1.18', title: 'Компьютерные игры' },
      { id: '1.19', title: 'Программа' },
      { id: '1.20', title: 'Исполняемые файлы и архивы' },
      { id: '1.21', title: 'Поиск информации' },
      { id: '1.22', title: 'Коммуникация и общение' },
      { id: '1.23', title: 'Фронтенд и бэкенд' },
      { id: '1.24', title: 'Основные языки' },
      { id: '1.25', title: 'Интерфейс' },
      { id: '1.26', title: 'Карьера в IT и мифы' },
      { id: '1.27', title: 'Удаленная работа' },
      { id: '1.28', title: 'Маркетинг и распространение' },
      { id: '1.29', title: 'Государство и бизнес' },
      { id: '1.30', title: 'Английский язык' }
    ]
  },
  {
    id: 'system',
    title: '2. Система и сеть',
    description: 'Операционные системы, сети, интернет, администрирование, безопасность, железо.',
    children: [
      { id: '2.01', title: 'Операционная система' },
      { id: '2.02', title: 'Платформы' },
      { id: '2.03', title: 'Сеть и интернет' },
      { id: '2.04', title: 'Как работают сайты и веб-сайты' },
      { id: '2.05', title: 'Терминал' },
      { id: '2.06', title: 'Системное администрирование' },
      { id: '2.07', title: 'Техническая поддержка' },
      { id: '2.08', title: 'Основы информационной безопасности' },
      { id: '2.09', title: 'Основы интеграционного взаимодействия' },
      { id: '2.10', title: 'Железо' }
    ]
  },
  {
    id: 'data',
    title: '3. Данные и разметка',
    description: 'Типы данных, структуры, базы данных (SQL/NoSQL), XML/JSON, HTML/CSS, анализ данных.',
    children: [
      { id: '3.01', title: 'Продвинутые операции с данными' },
      { id: '3.02', title: 'Структуры данных' },
      { id: '3.03', title: 'Мыслительная база' },
      { id: '3.04', title: 'Конфигурации и данные' },
      { id: '3.05', title: 'Основы баз данных' },
      { id: '3.06', title: 'NoSQL' },
      { id: '3.07', title: 'SQL' },
      { id: '3.08', title: 'Управление РСУБД' },
      { id: '3.09', title: 'HTML' },
      { id: '3.10', title: 'CSS' },
      { id: '3.11', title: 'Анализ данных' }
    ]
  },
  {
    id: 'code',
    title: '4. Код и разработка',
    description: 'Алгоритмы, выполнение кода, фреймворки, асинхронность, ООП, Git, отладка.',
    children: [
      { id: '4.01', title: 'Алгоритмы' },
      { id: '4.02', title: 'Что такое код и как он работает' },
      { id: '4.03', title: 'Выполнение кода' },
      { id: '4.04', title: 'Проект и фреймворки' },
      { id: '4.05', title: 'Асинхронность' },
      { id: '4.06', title: 'Архитектура выполнения' },
      { id: '4.07', title: 'Парадигмы и уровни абстракции' },
      { id: '4.08', title: 'ООП' },
      { id: '4.09', title: 'Зависимости' },
      { id: '4.10', title: 'ORM и работа с данными' },
      { id: '4.11', title: 'Десктопные приложения' },
      { id: '4.12', title: 'Мобильные приложения' },
      { id: '4.13', title: 'Основы работы с Git' },
      { id: '4.14', title: 'Разработка и отладка' },
      { id: '4.15', title: 'Сборка мусора' }
    ]
  },
  {
    id: 'languages',
    title: '5. Языки',
    description: 'JavaScript, Python, Java, C#, C++, PHP, Go, Rust, Swift и другие.',
    children: [
      { id: '5.01', title: 'JavaScript' },
      { id: '5.02', title: 'Python' },
      { id: '5.03', title: 'Java' },
      { id: '5.04', title: 'Платформа .NET' },
      { id: '5.05', title: 'C#' },
      { id: '5.06', title: 'C++' },
      { id: '5.07', title: 'PHP' },
      { id: '5.08', title: 'Smalltalk' },
      { id: '5.09', title: 'Kotlin' },
      { id: '5.10', title: 'Go' },
      { id: '5.11', title: 'Ruby' },
      { id: '5.12', title: 'Groovy' },
      { id: '5.13', title: 'Rust' },
      { id: '5.14', title: 'Swift' },
      { id: '5.15', title: 'Lua и Luau' },
      { id: '5.16', title: 'Старые языки' },
      { id: '5.17', title: 'Haskell' },
      { id: '5.18', title: 'Scala' },
      { id: '5.19', title: 'Elixir' },
      { id: '5.20', title: 'Zig' },
      { id: '5.21', title: 'Nim' },
      { id: '5.22', title: 'Dart' },
      { id: '5.23', title: 'R' },
      { id: '5.24', title: 'Julia' }
    ]
  },
  {
    id: 'ai',
    title: '6. Искусственный интеллект',
    description: 'Введение в ИИ, машинное обучение, нейросети, модели, применение ИИ.',
    children: [
      { id: '6.01', title: 'Введение в ИИ' },
      { id: '6.02', title: 'Машинное обучение' },
      { id: '6.03', title: 'Нейросети' },
      { id: '6.04', title: 'Модели и инструменты' },
      { id: '6.05', title: 'Разработка ИИ' },
      { id: '6.06', title: 'Применение ИИ' }
    ]
  },
  {
    id: 'project',
    title: '7. Проект',
    description: 'Бизнес, управление командой, методология, аналитика, тестирование, архитектура, документация.',
    children: [
      { id: '7.01', title: 'Общее о бизнесе' },
      { id: '7.02', title: 'Команда и управление' },
      { id: '7.03', title: 'Методология и жизненный цикл ПО' },
      { id: '7.04', title: 'Аналитика' },
      { id: '7.05', title: 'Тестирование' },
      { id: '7.06', title: 'Проектирование и архитектура' },
      { id: '7.07', title: 'Интеллектуальные права' },
      { id: '7.08', title: 'Техническое письмо' },
      { id: '7.09', title: 'Базы знаний и задачники' },
      { id: '7.10', title: 'Культура кода' },
      { id: '7.11', title: 'Легаси-код' }
    ]
  },
  {
    id: 'infra',
    title: '8. Инфраструктура и безопасность',
    description: 'Облака, Low-code, защита кода, DevOps, CI/CD, микросервисы, контейнеры, безопасность.',
    children: [
      { id: '8.01', title: 'Облачные технологии' },
      { id: '8.02', title: 'Low-code, No-code' },
      { id: '8.03', title: 'Забота о коде и данных' },
      { id: '8.04', title: 'DevOps, CI-CD' },
      { id: '8.05', title: 'Микросервисы и интеграция' },
      { id: '8.06', title: 'Контейнеризация и оркестрация' },
      { id: '8.07', title: 'Информационная безопасность' }
    ]
  },
  {
    id: 'spinoff',
    title: '9. Спин-офф',
    description: 'Великие люди, смена работы, игровая индустрия, разработка игр, блокчейн, графика, медиа.',
    children: [
      { id: '9.01', title: 'Великие люди' },
      { id: '9.02', title: 'Как понять, что пора менять работу' },
      { id: '9.03', title: 'Игровая индустрия' },
      { id: '9.04', title: 'Разработка игр' },
      { id: '9.05', title: 'Блокчейн, крипта и NFT' },
      { id: '9.06', title: 'Отраслевое ПО' },
      { id: '9.08', title: 'Компьютерная графика' },
      { id: '9.09', title: 'Медиа-контент' },
      { id: '9.10', title: 'Интернет-культура' },
      { id: '9.11', title: 'Для детей' }
    ]
  },
  {
    id: 'tools',
    title: 'Инструменты',
    description: 'Автоматизация, безопасность, данные, документация, игры, мультимедиа, разработка, сеть, система, тестирование.',
    children: [
      { id: 'tools-auto', title: 'Автоматизация' },
      { id: 'tools-sec', title: 'Безопасность' },
      { id: 'tools-data', title: 'Данные' },
      { id: 'tools-doc', title: 'Документация' },
      { id: 'tools-games', title: 'Игры' },
      { id: 'tools-media', title: 'Мультимедиа' },
      { id: 'tools-other', title: 'Прочее' },
      { id: 'tools-dev', title: 'Разработка' },
      { id: 'tools-net', title: 'Сеть' },
      { id: 'tools-sys', title: 'Система' },
      { id: 'tools-test', title: 'Тестирование' }
    ]
  },
  {
    id: 'context',
    title: 'Контекст',
    description: 'IoT, видеоигры, государство, здравоохранение, логистика, наука, образование, производство, торговля, финтех, энергетика.',
    children: [
      { id: 'ctx-iot', title: 'IoT' },
      { id: 'ctx-games', title: 'Видеоигры' },
      { id: 'ctx-state', title: 'Государство' },
      { id: 'ctx-health', title: 'Здравоохранение' },
      { id: 'ctx-logistics', title: 'Логистика' },
      { id: 'ctx-science', title: 'Наука' },
      { id: 'ctx-edu', title: 'Образование' },
      { id: 'ctx-prod', title: 'Производство' },
      { id: 'ctx-ent', title: 'Развлечения' },
      { id: 'ctx-build', title: 'Строительство' },
      { id: 'ctx-trade', title: 'Торговля' },
      { id: 'ctx-fintech', title: 'Финтех' },
      { id: 'ctx-energy', title: 'Энергетика' }
    ]
  },
  {
    id: 'philosophy',
    title: 'Философия',
    description: 'Культура, методология, основы, познание, размышления, этика и ответственность.',
    children: [
      { id: 'philo-cult', title: 'Культура' },
      { id: 'philo-meth', title: 'Методология' },
      { id: 'philo-basics', title: 'Основы' },
      { id: 'philo-know', title: 'Познание' },
      { id: 'philo-think', title: 'Размышления' },
      { id: 'philo-ethic', title: 'Этика и ответственность' }
    ]
  }
];

function InteractiveRoadmapInner() {
        const [expandedId, setExpandedId] = useState(null);
        const [selectedTopic, setSelectedTopic] = useState(null);
        const [savedTopics, setSavedTopics] = useState([]);

        React.useEffect(() => {
          try {
            const saved = localStorage.getItem('it-universe-saved-topics');
            if (saved) {
              setSavedTopics(JSON.parse(saved));
            }
          } catch (e) {
            console.error('Ошибка загрузки сохраненных тем:', e);
            setSavedTopics([]);
          }
        }, []);

        const toggleExpand = (id) => {
          setExpandedId(expandedId === id ? null : id);
        };

        const handleTopicClick = (topic) => {
          setSelectedTopic(topic);
        };

        const toggleSave = (topicId) => {
          let newSaved;
          if (savedTopics.includes(topicId)) {
            newSaved = savedTopics.filter(id => id !== topicId);
          } else {
            newSaved = [...savedTopics, topicId];
          }
          setSavedTopics(newSaved);
          try {
            localStorage.setItem('it-universe-saved-topics', JSON.stringify(newSaved));
          } catch (e) {
            console.error('Ошибка сохранения тем:', e);
          }
        };

        return (
          <DemoShell>
          <DemoCard title="Интерактивная дорожная карта" subtitle="Выберите область знаний и соберите личный план обучения.">
          <div>
            <style>{`
              @media (min-width: 768px) {
                .roadmap-container {
                  padding: 2rem;
                }
              }
            `}</style>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr',
              gap: '1rem'
            }}>
              {roadmapData.map((category) => (
                <div key={category.id} style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
                >
                  <div 
                    style={{ 
                      padding: '0.875rem 1rem', 
                      borderBottom: '1px solid #f1f5f9',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: expandedId === category.id ? '#eff6ff' : 'white',
                      fontWeight: 'bold',
                      color: '#334155',
                      fontSize: '0.95rem'
                    }}
                    onClick={() => toggleExpand(category.id)}
                  >
                    <span style={{ flex: 1 }}>{category.title}</span>
                    <span style={{ 
                      fontSize: '1.2rem', 
                      color: '#64748b',
                      marginLeft: '0.5rem',
                      minWidth: '24px',
                      textAlign: 'center'
                    }}>
                      {expandedId === category.id ? '−' : '+'}
                    </span>
                  </div>

                  {expandedId === category.id && (
                    <div style={{ 
                      padding: '0.75rem', 
                      maxHeight: '400px', 
                      overflowY: 'auto', 
                      backgroundColor: '#ffffff'
                    }}>
                      <p style={{ 
                        fontSize: '0.8rem', 
                        color: '#64748b', 
                        marginBottom: '0.75rem', 
                        fontStyle: 'italic',
                        lineHeight: '1.4'
                      }}>
                        {category.description}
                      </p>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {category.children.map((child) => (
                          <li key={child.id} style={{ marginBottom: '0.5rem' }}>
                            <button 
                              onClick={() => handleTopicClick(child)}
                              style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: '0.5rem 0.625rem',
                                backgroundColor: 'transparent',
                                border: '1px solid #e2e8f0',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                color: '#3b82f6',
                                fontSize: '0.85rem',
                                transition: 'all 0.2s',
                                whiteSpace: 'normal',
                                wordWrap: 'break-word',
                                lineHeight: '1.4'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#eff6ff';
                                e.target.style.borderColor = '#bfdbfe';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.borderColor = '#e2e8f0';
                              }}
                            >
                              {child.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Модальное окно выбора темы */}
            {selectedTopic && (
              <div style={{ 
                position: 'fixed', 
                top: 0, left: 0, right: 0, bottom: 0, 
                backgroundColor: 'rgba(0,0,0,0.5)', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                zIndex: 1000,
                backdropFilter: 'blur(2px)',
                padding: '1rem'
              }}
              onClick={() => setSelectedTopic(null)}
              >
                <div 
                  style={{ 
                    backgroundColor: 'white', 
                    padding: '1.5rem', 
                    borderRadius: '12px', 
                    maxWidth: '500px', 
                    width: '90%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    animation: 'fadeIn 0.3s ease-out'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h4 style={{ 
                    marginTop: 0, 
                    color: '#1e293b', 
                    fontSize: '1.125rem',
                    marginBottom: '0.75rem'
                  }}>Тема: {selectedTopic.title}</h4>
                  <p style={{ 
                    color: '#64748b', 
                    marginBottom: '1.25rem', 
                    lineHeight: '1.5',
                    fontSize: '0.875rem'
                  }}>
                    Нажмите кнопку ниже, чтобы добавить эту тему в ваш личный план обучения. Вы можете вернуться к ней позже через панель внизу страницы.
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: '0.75rem', 
                    justifyContent: 'flex-end',
                    flexDirection: 'row'
                  }}>
                    <button 
                      onClick={() => setSelectedTopic(null)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#e2e8f0'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                    >
                      Отмена
                    </button>
                    <button 
                      onClick={() => {
                        toggleSave(selectedTopic.id);
                        setSelectedTopic(null);
                      }}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: selectedTopic.id.startsWith('5.') || selectedTopic.id.startsWith('4.') ? '#2563eb' : '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        transition: 'opacity 0.2s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                      onMouseLeave={(e) => e.target.style.opacity = '1'}
                    >
                      {savedTopics.includes(selectedTopic.id) ? 'Убрать из плана' : 'Добавить в план'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Панель сохраненных тем */}
            {savedTopics.length > 0 && (
              <div style={{ 
                marginTop: '1.5rem', 
                padding: '1rem', 
                backgroundColor: '#fffbeb', 
                border: '1px solid #fcd34d', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <h4 style={{ 
                    color: '#92400e', 
                    margin: 0, 
                    fontSize: '1rem'
                  }}>Ваш план обучения (Тем: {savedTopics.length})</h4>
                  <button 
                    onClick={() => {
                      if (window.confirm('Вы уверены, что хотите очистить весь план обучения?')) {
                        setSavedTopics([]);
                        localStorage.removeItem('it-universe-saved-topics');
                      }
                    }}
                    style={{
                      padding: '0.4rem 0.8rem',
                      backgroundColor: 'transparent',
                      border: '1px solid #92400e',
                      color: '#92400e',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#fef3c7';
                      e.target.style.color = '#b45309';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#92400e';
                    }}
                  >
                    Очистить план
                  </button>
                </div>
                
                <div style={{ 
                  maxHeight: '200px', 
                  overflowY: 'auto', 
                  paddingRight: '0.5rem'
                }}>
                  <ul style={{ 
                    paddingLeft: '1.25rem', 
                    color: '#78350f', 
                    margin: 0, 
                    lineHeight: '1.6',
                    fontSize: '0.875rem'
                  }}>
                    {savedTopics.map(id => {
                      const topic = roadmapData.flatMap(c => c.children).find(t => t.id === id);
                      return (
                        <li key={id} style={{ marginBottom: '0.25rem' }}>
                          {topic?.title || id}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}

            <style global>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
              
              @media (max-width: 640px) {
                .custom-scroll::-webkit-scrollbar {
                  width: 4px;
                }
              }
            `}</style>
          </div>
          </DemoCard>
          </DemoShell>
        );
}

export default InteractiveRoadmapInner;