import React, { useState, useEffect } from 'react';

import DemoShell, {DemoCard} from '@/components/shared/DemoShell';



function ScalingDemoInner() {
        const [activeTab, setActiveTab] = useState('demo');
        const [scalingType, setScalingType] = useState('vertical');
        const [load, setLoad] = useState(30);
        const [autoScaling, setAutoScaling] = useState(false);
        
        const [verticalResources, setVerticalResources] = useState({
          cpu: 2,
          ram: 4,
          storage: 100
        });
        
        const [horizontalInstances, setHorizontalInstances] = useState(2);
        const [loadBalancer, setLoadBalancer] = useState({
          algorithm: 'round-robin',
          healthChecks: true,
          activeConnections: 0
        });
        
        const [metrics, setMetrics] = useState({
          responseTime: 120,
          throughput: 500,
          errorRate: 0.5,
          cpuUsage: 45,
          ramUsage: 60,
          availability: 99.9
        });
        
        const [metricsHistory, setMetricsHistory] = useState([]);
        
        const [requests, setRequests] = useState([]);
        const [simulationRunning, setSimulationRunning] = useState(false);
        
        const addRequest = () => {
          const newRequest = {
            id: Date.now(),
            timestamp: new Date(),
            duration: Math.random() * (metrics.responseTime * 2),
            status: Math.random() > (metrics.errorRate / 100) ? 200 : 500
          };
          setRequests(prev => [newRequest, ...prev].slice(0, 50));
        };
        
        const calculateThroughput = () => {
          let baseThroughput = 500;
          
          if (scalingType === 'vertical') {
            const cpuFactor = verticalResources.cpu / 2;
            const ramFactor = verticalResources.ram / 4;
            baseThroughput = 500 * (cpuFactor * 0.6 + ramFactor * 0.4);
          } else {
            baseThroughput = 500 * Math.log2(horizontalInstances + 1);
          }
          
          const loadFactor = Math.max(0.3, Math.min(1.5, 1 - (load / 200)));
          return Math.round(baseThroughput * loadFactor);
        };
        
        const calculateResponseTime = () => {
          let baseTime = 120;
          
          if (scalingType === 'vertical') {
            const cpuFactor = 2 / verticalResources.cpu;
            const ramFactor = 4 / verticalResources.ram;
            baseTime = 120 * (cpuFactor * 0.5 + ramFactor * 0.5);
          } else {
            baseTime = 120 / Math.sqrt(horizontalInstances);
          }
          
          const loadFactor = 1 + (load / 100);
          return Math.min(1000, Math.round(baseTime * loadFactor));
        };
        
        const calculateAvailability = () => {
          if (scalingType === 'vertical') {
            return 99.5 - (load / 100);
          } else {
            const faultTolerance = 1 - Math.pow(0.1, horizontalInstances);
            return Math.min(99.999, 99 + faultTolerance);
          }
        };
        
        useEffect(() => {
          if (!autoScaling) return;
          
          const interval = setInterval(() => {
            if (scalingType === 'vertical') {
              if (load > 70 && verticalResources.cpu < 16) {
                setVerticalResources(prev => ({
                  cpu: Math.min(16, prev.cpu + 1),
                  ram: Math.min(32, prev.ram + 2),
                  storage: prev.storage
                }));
              } else if (load < 30 && verticalResources.cpu > 2) {
                setVerticalResources(prev => ({
                  cpu: Math.max(1, prev.cpu - 1),
                  ram: Math.max(2, prev.ram - 1),
                  storage: prev.storage
                }));
              }
            } else {
              if (load > 70 && horizontalInstances < 20) {
                setHorizontalInstances(prev => Math.min(20, prev + 1));
              } else if (load < 20 && horizontalInstances > 2) {
                setHorizontalInstances(prev => Math.max(1, prev - 1));
              }
            }
          }, 3000);
          
          return () => clearInterval(interval);
        }, [autoScaling, load, scalingType, verticalResources.cpu, horizontalInstances]);
        
        useEffect(() => {
          const newMetrics = {
            responseTime: calculateResponseTime(),
            throughput: calculateThroughput(),
            errorRate: Math.min(10, Math.max(0.01, (load / 20) * (scalingType === 'vertical' ? 1 : 0.5))),
            cpuUsage: scalingType === 'vertical' 
              ? Math.min(100, (load / 100) * 100 * (2 / verticalResources.cpu))
              : Math.min(100, 30 + (load / 2)),
            ramUsage: scalingType === 'vertical'
              ? Math.min(100, (load / 100) * 80 * (4 / verticalResources.ram))
              : 40 + (load / 3),
            availability: calculateAvailability()
          };
          
          setMetrics(newMetrics);
          
          setMetricsHistory(prev => [...prev, {
            timestamp: Date.now(),
            ...newMetrics,
            instances: scalingType === 'vertical' ? 1 : horizontalInstances,
            resources: scalingType === 'vertical' ? verticalResources.cpu : horizontalInstances
          }].slice(-50));
          
        }, [verticalResources, horizontalInstances, load, scalingType]);
        
        useEffect(() => {
          if (!simulationRunning) return;
          
          const interval = setInterval(() => {
            addRequest();
            setLoad(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 5)));
          }, 1000);
          
          return () => clearInterval(interval);
        }, [simulationRunning]);
        
        const handleLoadChange = (newLoad) => {
          setLoad(newLoad);
          if (newLoad > 80 && !autoScaling) {
          }
        };
        
        const getResourceCost = () => {
          if (scalingType === 'vertical') {
            const cpuCost = verticalResources.cpu * 10;
            const ramCost = verticalResources.ram * 5;
            return cpuCost + ramCost;
          } else {
            return horizontalInstances * 25;
          }
        };
        
        const styles = {
          container: {
            maxWidth: '1400px',
            margin: '20px auto',
            padding: '0 15px',
            fontFamily: 'Arial, sans-serif',
            boxSizing: 'border-box'
          },
          header: {
            textAlign: 'center',
            marginBottom: '30px'
          },
          title: {
            color: '#2c3e50',
            fontSize: '28px',
            marginBottom: '10px',
            lineHeight: '1.2'
          },
          subtitle: {
            color: '#7f8c8d',
            fontSize: '16px'
          },
          tabs: {
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            borderBottom: '2px solid #ecf0f1',
            flexWrap: 'wrap',
            justifyContent: 'center'
          },
          tab: {
            padding: '10px 20px',
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            borderRadius: '4px'
          },
          activeTab: {
            color: '#3498db',
            borderBottom: '2px solid #3498db'
          },
          scalingSelector: {
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap'
          },
          scalingCard: {
            padding: '15px 30px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            textAlign: 'center',
            border: '2px solid #ddd',
            minWidth: '150px'
          },
          scalingCardActive: {
            borderColor: '#3498db',
            backgroundColor: '#ecf0f1'
          },
          mainGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '20px'
          },
          panel: {
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          },
          panelTitle: {
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#2c3e50',
            borderBottom: '2px solid #ecf0f1',
            paddingBottom: '8px'
          },
          resourceControl: {
            marginBottom: '20px'
          },
          resourceSlider: {
            width: '100%',
            margin: '10px 0'
          },
          resourceLabel: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '5px',
            fontSize: '14px'
          },
          instanceList: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginTop: '15px'
          },
          instance: {
            padding: '10px',
            backgroundColor: 'white',
            borderRadius: '6px',
            textAlign: 'center',
            minWidth: '80px',
            border: '1px solid #ddd',
            flex: '1 1 100px'
          },
          instanceActive: {
            backgroundColor: '#d4edda',
            borderColor: '#27ae60'
          },
          loadBalanceInfo: {
            marginTop: '15px',
            padding: '10px',
            backgroundColor: 'white',
            borderRadius: '6px'
          },
          metricsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            marginTop: '15px'
          },
          metricCard: {
            padding: '10px',
            backgroundColor: 'white',
            borderRadius: '6px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          },
          metricValue: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#3498db'
          },
          metricLabel: {
            fontSize: '12px',
            color: '#7f8c8d',
            marginTop: '5px'
          },
          performanceIndicator: {
            marginTop: '15px',
            padding: '10px',
            borderRadius: '6px',
            fontSize: '14px'
          },
          good: {
            backgroundColor: '#d4edda',
            color: '#155724'
          },
          warning: {
            backgroundColor: '#fff3cd',
            color: '#856404'
          },
          critical: {
            backgroundColor: '#f8d7da',
            color: '#721c24'
          },
          button: {
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            marginRight: '10px',
            whiteSpace: 'nowrap'
          },
          buttonSuccess: {
            backgroundColor: '#27ae60'
          },
          buttonDanger: {
            backgroundColor: '#e74c3c'
          },
          buttonWarning: {
            backgroundColor: '#f39c12'
          },
          loadControl: {
            marginTop: '20px',
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '8px'
          },
          requestList: {
            maxHeight: '200px',
            overflowY: 'auto',
            marginTop: '10px',
            fontSize: '12px'
          },
          requestItem: {
            padding: '5px',
            borderBottom: '1px solid #ddd',
            display: 'flex',
            justifyContent: 'space-between'
          },
          requestSuccess: {
            color: '#27ae60',
            fontWeight: 'bold'
          },
          requestError: {
            color: '#e74c3c',
            fontWeight: 'bold'
          },
          infoBox: {
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#e8f4f8',
            borderRadius: '8px',
            borderLeft: '4px solid #3498db',
            lineHeight: '1.5'
          },
          comparisonTable: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '15px',
            fontSize: '14px'
          },
          comparisonCell: {
            padding: '10px',
            border: '1px solid #ddd',
            textAlign: 'left'
          },
          codeBlock: {
            backgroundColor: '#f4f4f4',
            padding: '15px',
            borderRadius: '6px',
            fontFamily: 'monospace',
            fontSize: '12px',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap'
          },
          tableWrapper: {
            overflowX: 'auto',
            marginTop: '15px'
          }
        };

        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

        const responsiveStyles = {
          mainGrid: {
            ...styles.mainGrid,
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr'
          },
          metricsGrid: {
            ...styles.metricsGrid,
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)'
          },
          tabs: {
            ...styles.tabs,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center'
          },
          scalingSelector: {
            ...styles.scalingSelector,
            flexDirection: isMobile ? 'column' : 'row'
          },
          loadControl: {
            ...styles.loadControl,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'flex-start'
          },
          buttonGroup: {
            marginTop: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }
        };

        return (
          <DemoShell>
          <DemoCard
            title="Масштабирование систем"
            subtitle="Вертикальное и горизонтальное масштабирование под нагрузкой"
          >
          <div style={{maxWidth: '100%'}}>
            <div style={styles.tabs}>
              <button
                style={{ ...styles.tab, ...(activeTab === 'demo' ? styles.activeTab : {}) }}
                onClick={() => setActiveTab('demo')}
              >
                Интерактивная демонстрация
              </button>
              <button
                style={{ ...styles.tab, ...(activeTab === 'comparison' ? styles.activeTab : {}) }}
                onClick={() => setActiveTab('comparison')}
              >
                Сравнение и анализ
              </button>
              <button
                style={{ ...styles.tab, ...(activeTab === 'guide' ? styles.activeTab : {}) }}
                onClick={() => setActiveTab('guide')}
              >
                Руководство
              </button>
            </div>
            
            {activeTab === 'demo' && (
              <>
                <div style={styles.scalingSelector}>
                  <div
                    style={{
                      ...styles.scalingCard,
                      ...(scalingType === 'vertical' ? styles.scalingCardActive : {})
                    }}
                    onClick={() => setScalingType('vertical')}
                  >
                    <div style={{ fontSize: '32px' }}>📈</div>
                    <div><strong>Вертикальное</strong></div>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Scale Up</div>
                  </div>
                  <div
                    style={{
                      ...styles.scalingCard,
                      ...(scalingType === 'horizontal' ? styles.scalingCardActive : {})
                    }}
                    onClick={() => setScalingType('horizontal')}
                  >
                    <div style={{ fontSize: '32px' }}>📊</div>
                    <div><strong>Горизонтальное</strong></div>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Scale Out</div>
                  </div>
                </div>
                
                <div style={responsiveStyles.mainGrid}>
                  <div style={styles.panel}>
                    <div style={styles.panelTitle}>
                      {scalingType === 'vertical' ? 'Конфигурация сервера' : 'Кластер серверов'}
                    </div>
                    
                    {scalingType === 'vertical' ? (
                      <>
                        <div style={styles.resourceControl}>
                          <div style={styles.resourceLabel}>
                            <span>CPU ядра: {verticalResources.cpu}</span>
                            <span>{Math.round((verticalResources.cpu / 16) * 100)}% от макс</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="16"
                            step="1"
                            value={verticalResources.cpu}
                            onChange={(e) => setVerticalResources({...verticalResources, cpu: parseInt(e.target.value)})}
                            style={styles.resourceSlider}
                          />
                        </div>
                        
                        <div style={styles.resourceControl}>
                          <div style={styles.resourceLabel}>
                            <span>RAM память: {verticalResources.ram} GB</span>
                            <span>{Math.round((verticalResources.ram / 32) * 100)}% от макс</span>
                          </div>
                          <input
                            type="range"
                            min="2"
                            max="32"
                            step="2"
                            value={verticalResources.ram}
                            onChange={(e) => setVerticalResources({...verticalResources, ram: parseInt(e.target.value)})}
                            style={styles.resourceSlider}
                          />
                        </div>
                        
                        <div style={styles.resourceControl}>
                          <div style={styles.resourceLabel}>
                            <span>Storage: {verticalResources.storage} GB</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="1000"
                            step="50"
                            value={verticalResources.storage}
                            onChange={(e) => setVerticalResources({...verticalResources, storage: parseInt(e.target.value)})}
                            style={styles.resourceSlider}
                          />
                        </div>
                        
                        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#ecf0f1', borderRadius: '6px' }}>
                          <strong>Стоимость:</strong> ${getResourceCost()}/мес
                          <div style={{ fontSize: '12px', marginTop: '5px' }}>
                            ⚠️ Вертикальное масштабирование имеет лимиты и высокую стоимость на максимуме
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={styles.resourceControl}>
                          <div style={styles.resourceLabel}>
                            <span>Количество инстансов: {horizontalInstances}</span>
                            <span>Версия: v2.1.0</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="20"
                            step="1"
                            value={horizontalInstances}
                            onChange={(e) => setHorizontalInstances(parseInt(e.target.value))}
                            style={styles.resourceSlider}
                          />
                        </div>
                        
                        <div style={styles.instanceList}>
                          {[...Array(Math.min(horizontalInstances, 8))].map((_, i) => (
                            <div key={i} style={{...styles.instance, ...styles.instanceActive}}>
                              <div>🖥️</div>
                              <div style={{ fontSize: '11px' }}>Node {i+1}</div>
                              <div style={{ fontSize: '10px', color: '#27ae60' }}>🟢 Online</div>
                            </div>
                          ))}
                          {horizontalInstances > 8 && (
                            <div style={styles.instance}>
                              <div>➕</div>
                              <div>+{horizontalInstances - 8}</div>
                            </div>
                          )}
                        </div>
                        
                        <div style={styles.loadBalanceInfo}>
                          <strong>Балансировщик нагрузки</strong>
                          <div>Алгоритм: {loadBalancer.algorithm}</div>
                          <div>Health checks: {loadBalancer.healthChecks ? '✅ Включены' : '❌ Отключены'}</div>
                          <div>Активные соединения: {Math.round(load * horizontalInstances * 1.5)}</div>
                        </div>
                        
                        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#ecf0f1', borderRadius: '6px' }}>
                          <strong>Стоимость:</strong> ${getResourceCost()}/мес
                          <div style={{ fontSize: '12px', marginTop: '5px' }}>
                            Горизонтальное масштабирование более экономично на больших нагрузках
                          </div>
                        </div>
                      </>
                    )}
                    
                    <div style={styles.loadControl}>
                      <div style={styles.resourceLabel}>
                        <span>Текущая нагрузка: {Math.round(load)}%</span>
                        <span>{load < 40 ? '🟢 Низкая' : load < 70 ? '🟡 Средняя' : '🔴 Высокая'}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={load}
                        onChange={(e) => handleLoadChange(parseInt(e.target.value))}
                        style={styles.resourceSlider}
                      />
                      
                      <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          style={{ ...styles.button, ...styles.buttonSuccess }}
                          onClick={() => setSimulationRunning(!simulationRunning)}
                        >
                          {simulationRunning ? '⏸️ Остановить' : '▶️ Запустить'} симуляцию
                        </button>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}>
                          <input
                            type="checkbox"
                            checked={autoScaling}
                            onChange={(e) => setAutoScaling(e.target.checked)}
                          />
                          Автоматическое масштабирование
                        </label>
                      </div>
                    </div>
                    
                    <div style={styles.requestList}>
                      <div><strong>Последние запросы:</strong></div>
                      {requests.map(req => (
                        <div key={req.id} style={styles.requestItem}>
                          <span style={req.status === 200 ? styles.requestSuccess : styles.requestError}>
                            [{req.status}] 
                          </span>
                          <span>{new Date(req.timestamp).toLocaleTimeString()} - {req.duration.toFixed(0)}ms</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div style={styles.panel}>
                    <div style={styles.panelTitle}>Метрики производительности</div>
                    
                    <div style={responsiveStyles.metricsGrid}>
                      <div style={styles.metricCard}>
                        <div style={styles.metricValue}>{metrics.responseTime} ms</div>
                        <div style={styles.metricLabel}>Время ответа</div>
                        <div style={{ fontSize: '11px' }}>
                          {metrics.responseTime < 200 ? 'Отлично' : metrics.responseTime < 500 ? 'Нормально' : 'Медленно'}
                        </div>
                      </div>
                      
                      <div style={styles.metricCard}>
                        <div style={styles.metricValue}>{metrics.throughput} req/s</div>
                        <div style={styles.metricLabel}>Пропускная способность</div>
                      </div>
                      
                      <div style={styles.metricCard}>
                        <div style={styles.metricValue}>{metrics.errorRate.toFixed(1)}%</div>
                        <div style={styles.metricLabel}>Ошибки</div>
                      </div>
                      
                      <div style={styles.metricCard}>
                        <div style={styles.metricValue}>{metrics.availability.toFixed(2)}%</div>
                        <div style={styles.metricLabel}>Доступность</div>
                      </div>
                      
                      <div style={styles.metricCard}>
                        <div style={styles.metricValue}>{Math.round(metrics.cpuUsage)}%</div>
                        <div style={styles.metricLabel}>CPU</div>
                      </div>
                      
                      <div style={styles.metricCard}>
                        <div style={styles.metricValue}>{Math.round(metrics.ramUsage)}%</div>
                        <div style={styles.metricLabel}>RAM</div>
                      </div>
                    </div>
                    
                    <div style={{
                      ...styles.performanceIndicator,
                      ...(metrics.responseTime < 300 ? styles.good : 
                         metrics.responseTime < 600 ? styles.warning : styles.critical)
                    }}>
                      <strong>Статус системы: </strong>
                      {metrics.responseTime < 300 ? '✅Отличная производительность' :
                       metrics.responseTime < 600 ? '⚠️ Требуется оптимизация' : 
                       '🔴 Система перегружена! Рекомендуется масштабирование'}
                    </div>
                    
                    <div style={{ marginTop: '20px' }}>
                      <strong>🎯 Рекомендации:</strong>
                      <ul style={{ marginTop: '10px', fontSize: '13px', paddingLeft: '20px' }}>
                        {metrics.responseTime > 500 && (
                          <li>• Высокое время ответа - {scalingType === 'vertical' ? 
                            'увеличьте ресурсы сервера' : 'добавьте новые инстансы'}</li>
                        )}
                        {metrics.errorRate > 2 && (
                          <li>• Высокий процент ошибок - проверьте логи и добавьте реплики</li>
                        )}
                        {load > 80 && (
                          <li>• Высокая нагрузка - {autoScaling ? 'автомасштабирование активировано' : 
                            `включите автоматическое масштабирование для оптимизации`}</li>
                        )}
                        {scalingType === 'vertical' && horizontalInstances === 1 && load > 70 && (
                          <li>• Рассмотрите переход на горизонтальное масштабирование для лучшей отказоустойчивости</li>
                        )}
                        {!loadBalancer.healthChecks && scalingType === 'horizontal' && (
                          <li>• Включите health checks для надежной работы балансировщика</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div style={styles.infoBox}>
                  <strong>Текущая стратегия: {scalingType === 'vertical' ? 'Вертикальное масштабирование' : 'Горизонтальное масштабирование'}</strong><br/>
                  {scalingType === 'vertical' ? (
                    <>
                      • Увеличивается мощность одного сервера (больше CPU/RAM)<br/>
                      • Есть физические лимиты (максимум 16 ядер, 32GB RAM)<br/>
                      • Высокая стоимость на максимуме ($800+/мес)<br/>
                      • Единая точка отказа - при падении сервера система недоступна
                    </>
                  ) : (
                    <>
                      • Добавляются новые серверы в кластер ({horizontalInstances} шт)<br/>
                      • Практически неограниченное масштабирование (до 1000+ узлов)<br/>
                      • Линейный рост стоимости ($25/инстанс)<br/>
                      • Высокая отказоустойчивость - отказ одного сервера не влияет на доступность
                    </>
                  )}
                </div>
              </>
            )}
            
            {activeTab === 'comparison' && (
              <>
                <div style={responsiveStyles.mainGrid}>
                  <div style={styles.panel}>
                    <div style={styles.panelTitle}>Вертикальное масштабирование</div>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <div style={{ fontSize: '48px' }}>🖥️ → 💪 → 🏋️</div>
                      <div>Увеличение мощности одного сервера</div>
                    </div>
                    
                    <table style={styles.comparisonTable}>
                      <tbody>
                        <tr><td style={styles.comparisonCell}><strong>Преимущества</strong></td></tr>
                        <tr><td style={styles.comparisonCell}>• Простота реализации - не требует изменения архитектуры</td></tr>
                        <tr><td style={styles.comparisonCell}>• Нет необходимости в балансировщике нагрузки</td></tr>
                        <tr><td style={styles.comparisonCell}>• Меньше проблем с согласованностью данных</td></tr>
                        <tr><td style={styles.comparisonCell}>• Подходит для монолитных приложений</td></tr>
                        
                        <tr><td style={styles.comparisonCell}><strong>Недостатки</strong></td></tr>
                        <tr><td style={styles.comparisonCell}>• Аппаратные ограничения (максимальная мощность)</td></tr>
                        <tr><td style={styles.comparisonCell}>• Единая точка отказа</td></tr>
                        <tr><td style={styles.comparisonCell}>• Дорогое масштабирование на максимуме</td></tr>
                        <tr><td style={styles.comparisonCell}>• Время простоя при апгрейде</td></tr>
                        
                        <tr><td style={styles.comparisonCell}><strong>Когда использовать</strong></td></tr>
                        <tr><td style={styles.comparisonCell}>• Небольшие и средние проекты</td></tr>
                        <tr><td style={styles.comparisonCell}>• Когда важна простота поддержки</td></tr>
                        <tr><td style={styles.comparisonCell}>• Бюджетные ограничения на начальном этапе</td></tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div style={styles.panel}>
                    <div style={styles.panelTitle}>Горизонтальное масштабирование</div>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <div style={{ fontSize: '48px' }}>🖥️+🖥️+🖥️ → 🌐</div>
                      <div>Добавление новых серверов в кластер</div>
                    </div>
                    
                    <table style={styles.comparisonTable}>
                      <tbody>
                        <tr><td style={styles.comparisonCell}><strong>Преимущества</strong></td></tr>
                        <tr><td style={styles.comparisonCell}>• Практически безлимитное масштабирование</td></tr>
                        <tr><td style={styles.comparisonCell}>• Высокая отказоустойчивость</td></tr>
                        <tr><td style={styles.comparisonCell}>• Более экономично на больших нагрузках</td></tr>
                        <tr><td style={styles.comparisonCell}>• Гибкое распределение нагрузки</td></tr>
                        
                        <tr><td style={styles.comparisonCell}><strong>Недостатки</strong></td></tr>
                        <tr><td style={styles.comparisonCell}>• Сложность настройки (балансировщик, синхронизация)</td></tr>
                        <tr><td style={styles.comparisonCell}>• Проблемы с состоянием сессий</td></tr>
                        <tr><td style={styles.comparisonCell}>• Сложность управления БД в кластере</td></tr>
                        <tr><td style={styles.comparisonCell}>• Затраты на инфраструктуру</td></tr>
                        
                        <tr><td style={styles.comparisonCell}><strong>Когда использовать</strong></td></tr>
                        <tr><td style={styles.comparisonCell}>• Высоконагруженные системы (миллионы пользователей)</td></tr>
                        <tr><td style={styles.comparisonCell}>• Когда критична доступность (24/7)</td></tr>
                        <tr><td style={styles.comparisonCell}>• Микросервисная архитектура</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div style={styles.panel}>
                  <div style={styles.panelTitle}>Сравнительный анализ по ключевым метрикам</div>
                  <div style={styles.tableWrapper}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr><th style={styles.comparisonCell}>Характеристика</th>
                          <th style={styles.comparisonCell}>Вертикальное</th>
                          <th style={styles.comparisonCell}>Горизонтальное</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td style={styles.comparisonCell}>Макс. масштаб</td><td style={styles.comparisonCell}>~32 ядра, 512GB RAM</td><td style={styles.comparisonCell}>1000+ узлов</td></tr>
                        <tr><td style={styles.comparisonCell}>Отказоустойчивость</td><td style={styles.comparisonCell}>Низкая (1 сервер)</td><td style={styles.comparisonCell}>Высокая (N серверов)</td></tr>
                        <tr><td style={styles.comparisonCell}>Стоимость за 1000 req/s</td><td style={styles.comparisonCell}>~$500/мес</td><td style={styles.comparisonCell}>~$200/мес</td></tr>
                        <tr><td style={styles.comparisonCell}>Время апгрейда</td><td style={styles.comparisonCell}>Часы (reboot)</td><td style={styles.comparisonCell}>Минуты (zero-downtime)</td></tr>
                        <tr><td style={styles.comparisonCell}>Сложность реализации</td><td style={styles.comparisonCell}>Низкая</td><td style={styles.comparisonCell}>Высокая</td></tr>
                        <tr><td style={styles.comparisonCell}>Требования к архитектуре</td><td style={styles.comparisonCell}>Монолит</td><td style={styles.comparisonCell}>Микросервисы/SOA</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === 'guide' && (
              <>
                <div style={responsiveStyles.mainGrid}>
                  <div style={styles.panel}>
                    <div style={styles.panelTitle}>Что такое масштабирование?</div>
                    <p><strong>Масштабирование системы</strong> — способность системы увеличивать производительность пропорционально добавленным ресурсам.</p>
                    
                    <div style={{ marginTop: '20px' }}>
                      <strong>Вертикальное (Scale Up)</strong>
                      <p>Добавление мощности существующему серверу: больше CPU, RAM, дискового пространства.</p>
                      
                      <strong>Горизонтальное (Scale Out)</strong>
                      <p>Добавление новых серверов/узлов в систему с распределением нагрузки.</p>
                    </div>
                    
                    <div style={{ marginTop: '20px' }}>
                      <strong>Закон Амдала</strong>
                      <p>Максимальное ускорение системы ограничено той частью кода, которая не может быть распараллелена.</p>
                      <div style={styles.codeBlock}>
                        S = 1 / ((1 - P) + P/N)<br/>
                        где P - параллельная часть, N - количество процессоров
                      </div>
                    </div>
                  </div>
                  
                  <div style={styles.panel}>
                    <div style={styles.panelTitle}>Практические стратегии</div>
                    <ul>
                      <li><strong>Database scaling</strong>
                        <ul>
                          <li>Read replicas для SELECT запросов</li>
                          <li>Sharding/партиционирование</li>
                          <li>Кэширование (Redis, Memcached)</li>
                        </ul>
                      </li>
                      <li><strong>Application scaling</strong>
                        <ul>
                          <li>Stateless приложения</li>
                          <li>Очереди сообщений (RabbitMQ, Kafka)</li>
                          <li>Микросервисная архитектура</li>
                        </ul>
                      </li>
                      <li><strong>Load Balancing стратегии</strong>
                        <ul>
                          <li>Round Robin - циклическое распределение</li>
                          <li>Least Connections - наименьшее соединений</li>
                          <li>IP Hash - привязка к клиенту</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div style={styles.panel}>
                  <div style={styles.panelTitle}>Пример реализации на Node.js</div>
                  <div style={styles.codeBlock}>
                    {`// Горизонтальное масштабирование с использованием Cluster
const cluster = require('cluster');
const http = require('http');
const os = require('os');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(\`Master \${process.pid} is running\`);
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker) => {
    console.log(\`Worker \${worker.process.pid} died\`);
    cluster.fork();
  });
} else {
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello from worker ' + process.pid);
  }).listen(8000);
  
  console.log(\`Worker \${process.pid} started\`);
}

const dockerCompose = \`
version: '3'
services:
  app:
    image: myapp:latest
    deploy:
      replicas: 5
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    networks:
      - webnet
        
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    networks:
      - webnet

networks:
  webnet:
\`;

console.log(dockerCompose);`}
                  </div>
                </div>
                
                <div style={styles.infoBox}>
                  <strong>Реальный кейс: Netflix</strong><br/>
                  • Использует <strong>горизонтальное масштабирование</strong> с тысячами микросервисов<br/>
                  • Автоматическое масштабирование на основе трафика (до 1000% пиковые нагрузки)<br/>
                  • Chaos Monkey - намеренное отключение серверов для проверки отказоустойчивости<br/>
                  • 99.99% доступность при 200+ миллионах подписчиков<br/>
                  <br/>
                  <strong>Вывод:</strong> Современные высоконагруженные системы всегда используют горизонтальное масштабирование, часто с элементами вертикального для оптимального соотношения цена/производительность.
                </div>
              </>
            )}
          </div>
          </DemoCard>
          </DemoShell>
        );
}

export default ScalingDemoInner;
