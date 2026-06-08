import React, { useState, useEffect } from 'react';

import DemoShell, {DemoCard} from '@/components/shared/DemoShell';



const BackupDemoContent = () => {
  const [activeTab, setActiveTab] = useState('backup');
  const [backupHistory, setBackupHistory] = useState([]);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const [appData, setAppData] = useState({
    projects: [
      { id: 1, name: 'Сайт портфолио', status: 'active', lastEdited: '2024-01-15' },
      { id: 2, name: 'Интернет-магазин', status: 'draft', lastEdited: '2024-01-20' },
      { id: 3, name: 'Мобильное приложение', status: 'completed', lastEdited: '2024-01-10' }
    ],
    settings: {
      theme: 'dark',
      notifications: true,
      language: 'ru',
      autoSave: true
    },
    userPreferences: {
      favoriteColor: '#3498db',
      fontSize: 'medium',
      layout: 'grid'
    },
    notes: [
      'Изучить React hooks',
      'Сделать резервное копирование',
      'Оптимизировать производительность'
    ]
  });

  const [editForm, setEditForm] = useState({
    projectName: '',
    settingKey: '',
    settingValue: '',
    newNote: ''
  });

  const calculateBackupSize = (data) => {
    const jsonStr = JSON.stringify(data);
    const sizeInBytes = new Blob([jsonStr]).size;
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const createBackup = async (description = '') => {
    setIsBackingUp(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const backup = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleString('ru-RU'),
      description: description || `Автоматический бэкап от ${new Date().toLocaleString('ru-RU')}`,
      data: JSON.parse(JSON.stringify(appData)),
      size: calculateBackupSize(appData),
      version: `v${backupHistory.length + 1}`,
      type: description ? 'manual' : 'auto'
    };
    
    setBackupHistory(prev => [backup, ...prev]);
    setNotification({
      type: 'success',
      message: `Бэкап создан! Размер: ${backup.size}, Версия: ${backup.version}`
    });
    
    setTimeout(() => setNotification(null), 3000);
    setIsBackingUp(false);
  };

  const restoreFromBackup = async (backup) => {
    if (!window.confirm(`Восстановить данные из бэкапа от ${backup.date}? Текущие данные будут потеряны!`)) {
      return;
    }
    
    setIsRestoring(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAppData(JSON.parse(JSON.stringify(backup.data)));
    setNotification({
      type: 'success',
      message: `Данные восстановлены из бэкапа от ${backup.date}`
    });
    
    setTimeout(() => setNotification(null), 3000);
    setIsRestoring(false);
    setActiveTab('data');
  };

  const compareWithBackup = (backup) => {
    const currentStr = JSON.stringify(appData);
    const backupStr = JSON.stringify(backup.data);
    
    if (currentStr === backupStr) {
      setNotification({
        type: 'info',
        message: 'Данные совпадают с выбранным бэкапом. Изменений нет.'
      });
    } else {
      setNotification({
        type: 'warning',
        message: 'Текущие данные отличаются от бэкапа. Вы можете восстановить бэкап для отката изменений.'
      });
    }
    
    setTimeout(() => setNotification(null), 3000);
  };

  const deleteBackup = (id) => {
    if (window.confirm('Удалить этот бэкап?')) {
      setBackupHistory(prev => prev.filter(b => b.id !== id));
      setNotification({
        type: 'info',
        message: 'Бэкап удален'
      });
      setTimeout(() => setNotification(null), 2000);
    }
  };

  const exportBackup = (backup) => {
    const dataStr = JSON.stringify(backup, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `backup_${new Date(backup.id).toISOString().slice(0,19)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setNotification({
      type: 'success',
      message: 'Бэкап экспортирован в файл'
    });
    setTimeout(() => setNotification(null), 2000);
  };

  const importBackup = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedBackup = JSON.parse(e.target.result);
        if (importedBackup.data && importedBackup.timestamp) {
          setBackupHistory(prev => [importedBackup, ...prev]);
          setNotification({
            type: 'success',
            message: 'Бэкап импортирован из файла'
          });
        } else {
          throw new Error('Неверный формат бэкапа');
        }
      } catch (error) {
        setNotification({
          type: 'error',
          message: '❌ Ошибка импорта: неверный формат файла'
        });
      }
      setTimeout(() => setNotification(null), 3000);
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const addProject = () => {
    if (editForm.projectName) {
      const newProject = {
        id: Date.now(),
        name: editForm.projectName,
        status: 'draft',
        lastEdited: new Date().toISOString().slice(0,10)
      };
      setAppData(prev => ({
        ...prev,
        projects: [...prev.projects, newProject]
      }));
      setEditForm({ ...editForm, projectName: '' });
      setNotification({
        type: 'success',
        message: 'Проект добавлен! Не забудьте создать бэкап.'
      });
      setTimeout(() => setNotification(null), 2000);
    }
  };

  const updateSetting = () => {
    if (editForm.settingKey && editForm.settingValue) {
      setAppData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [editForm.settingKey]: editForm.settingValue === 'true' ? true : 
                                 editForm.settingValue === 'false' ? false : 
                                 editForm.settingValue
        }
      }));
      setEditForm({ ...editForm, settingKey: '', settingValue: '' });
      setNotification({
        type: 'success',
        message: 'Настройка обновлена!'
      });
      setTimeout(() => setNotification(null), 2000);
    }
  };

  const addNote = () => {
    if (editForm.newNote) {
      setAppData(prev => ({
        ...prev,
        notes: [...prev.notes, editForm.newNote]
      }));
      setEditForm({ ...editForm, newNote: '' });
      setNotification({
        type: 'success',
        message: 'Заметка добавлена!'
      });
      setTimeout(() => setNotification(null), 2000);
    }
  };

  useEffect(() => {
    const autoBackupInterval = setInterval(() => {
      if (appData && backupHistory.length > 0) {
        createBackup('Автоматический бэкап');
      }
    }, 30000);
    
    return () => clearInterval(autoBackupInterval);
  }, [appData]);

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '20px auto',
      fontFamily: 'Arial, sans-serif',
      padding: '0 15px',
      boxSizing: 'border-box'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    title: {
      color: '#2c3e50',
      fontSize: 'clamp(24px, 5vw, 28px)',
      marginBottom: '10px'
    },
    subtitle: {
      color: '#7f8c8d',
      fontSize: 'clamp(14px, 3vw, 16px)'
    },
    stats: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: '15px',
      marginBottom: '20px',
      padding: '15px',
      backgroundColor: '#ecf0f1',
      borderRadius: '8px'
    },
    statCard: {
      flex: '1 1 calc(50% - 15px)',
      textAlign: 'center',
      minWidth: '150px'
    },
    statValue: {
      fontSize: 'clamp(20px, 4vw, 24px)',
      fontWeight: 'bold',
      color: '#3498db'
    },
    statLabel: {
      fontSize: 'clamp(10px, 2vw, 12px)',
      color: '#7f8c8d',
      marginTop: '5px'
    },
    tabsContainer: {
      position: 'relative',
      marginBottom: '20px',
      borderBottom: '2px solid #ecf0f1'
    },
    tabs: {
      display: 'flex',
      gap: '10px',
      overflowX: 'auto',
      paddingBottom: '2px',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    },
    tab: {
      padding: '10px 20px',
      cursor: 'pointer',
      border: 'none',
      background: 'none',
      fontSize: 'clamp(14px, 3vw, 16px)',
      fontWeight: 'bold',
      transition: 'all 0.3s',
      whiteSpace: 'nowrap',
      color: '#7f8c8d'
    },
    activeTab: {
      color: '#3498db',
      borderBottom: '2px solid #3498db',
      paddingBottom: '8px'
    },
    notification: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '15px 20px',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 1000,
      animation: 'slideIn 0.3s ease-out',
      maxWidth: '90%',
      wordBreak: 'break-word'
    },
    notificationSuccess: { borderLeft: '4px solid #27ae60' },
    notificationError: { borderLeft: '4px solid #e74c3c' },
    notificationWarning: { borderLeft: '4px solid #f39c12' },
    notificationInfo: { borderLeft: '4px solid #3498db' },
    dataPanel: {
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px'
    },
    section: {
      marginBottom: '25px',
      padding: '15px',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #ddd'
    },
    sectionTitle: {
      fontSize: 'clamp(16px, 3vw, 18px)',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: '#2c3e50',
      borderBottom: '2px solid #ecf0f1',
      paddingBottom: '8px'
    },
    projectList: { listStyle: 'none', padding: 0 },
    projectItem: {
      padding: '10px',
      marginBottom: '10px',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '8px'
    },
    statusBadge: {
      padding: '3px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      alignSelf: 'flex-start'
    },
    statusActive: { backgroundColor: '#d4edda', color: '#155724' },
    statusDraft: { backgroundColor: '#fff3cd', color: '#856404' },
    statusCompleted: { backgroundColor: '#cce5ff', color: '#004085' },
    settingsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '10px'
    },
    settingItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px',
      fontSize: '14px'
    },
    notesList: { listStyle: 'none', padding: 0 },
    noteItem: {
      padding: '8px',
      marginBottom: '8px',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px',
      borderLeft: '3px solid #3498db'
    },
    inputGroup: {
      display: 'flex',
      gap: '10px',
      marginTop: '10px',
      flexWrap: 'wrap'
    },
    input: {
      flex: '1 1 200px',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px'
    },
    button: {
      padding: '8px 15px',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background 0.2s',
      whiteSpace: 'nowrap'
    },
    buttonDanger: { backgroundColor: '#e74c3c' },
    buttonSuccess: { backgroundColor: '#27ae60' },
    buttonWarning: { backgroundColor: '#f39c12' },
    buttonSecondary: { backgroundColor: '#95a5a6' },
    backupList: {
      maxHeight: '500px',
      overflowY: 'auto'
    },
    backupItem: {
      backgroundColor: 'white',
      padding: '15px',
      marginBottom: '10px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      transition: 'transform 0.2s'
    },
    backupHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
      flexWrap: 'wrap',
      gap: '5px'
    },
    backupDate: { fontWeight: 'bold', color: '#2c3e50' },
    backupVersion: { color: '#3498db', fontWeight: 'bold' },
    backupMeta: { fontSize: '12px', color: '#7f8c8d', marginBottom: '10px' },
    backupDescription: { fontSize: '14px', marginBottom: '10px', color: '#555' },
    backupActions: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      marginTop: '10px'
    },
    smallButton: {
      padding: '6px 10px',
      fontSize: '12px',
      flex: '1 1 auto',
      whiteSpace: 'nowrap'
    },
    warningBox: {
      backgroundColor: '#fff3cd',
      border: '1px solid #ffeaa7',
      borderRadius: '8px',
      padding: '15px',
      marginTop: '20px',
      fontSize: '14px'
    },
    loadingOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999
    },
    spinner: {
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #3498db',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 1s linear infinite'
    }
  };

  return (
    <DemoShell>
    <DemoCard title="Резервное копирование и восстановление" subtitle="Создайте снимок данных приложения и откатитесь при ошибке.">
    <div style={styles.container}>
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          /* Убираем скроллбар для Chrome/Safari */
          .tabs::-webkit-scrollbar { display: none; }
        `}
      </style>

      <div style={styles.header}>
        <h1 style={styles.title}>Система резервного копирования</h1>
        <p style={styles.subtitle}>Создание, управление и восстановление бэкапов</p>
      </div>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{backupHistory.length}</div>
          <div style={styles.statLabel}>Всего бэкапов</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {backupHistory.length > 0 
              ? (backupHistory.reduce((acc, b) => acc + parseFloat(b.size), 0).toFixed(2) + ' KB')
              : '0 KB'}
          </div>
          <div style={styles.statLabel}>Общий размер</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {backupHistory.filter(b => b.type === 'manual').length}
          </div>
          <div style={styles.statLabel}>Ручных бэкапов</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {new Date().toLocaleTimeString()}
          </div>
          <div style={styles.statLabel}>Последнее обновление</div>
        </div>
      </div>

      <div style={styles.tabsContainer}>
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(activeTab === 'data' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('data')}
          >
            Текущие данные
          </button>
          <button
            style={{ ...styles.tab, ...(activeTab === 'backup' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('backup')}
          >
            Управление бэкапами
          </button>
          <button
            style={{ ...styles.tab, ...(activeTab === 'guide' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('guide')}
          >
            Руководство
          </button>
        </div>
      </div>

      {activeTab === 'data' && (
        <div style={styles.dataPanel}>
          <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button
              style={{ ...styles.button, ...styles.buttonSuccess }}
              onClick={() => createBackup('Ручной бэкап перед изменениями')}
              disabled={isBackingUp}
            >
              {isBackingUp ? 'Создание...' : 'Создать бэкап сейчас'}
            </button>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>Проекты</div>
            <ul style={styles.projectList}>
              {appData.projects.map(project => (
                <li key={project.id} style={styles.projectItem}>
                  <span>
                    <strong>{project.name}</strong>
                    <span style={{ fontSize: '12px', marginLeft: '10px', color: '#7f8c8d' }}>
                      Изменен: {project.lastEdited}
                    </span>
                  </span>
                  <span style={{
                    ...styles.statusBadge,
                    ...(project.status === 'active' ? styles.statusActive :
                       project.status === 'draft' ? styles.statusDraft : styles.statusCompleted)
                  }}>
                    {project.status === 'active' ? 'Активен' :
                     project.status === 'draft' ? 'Черновик' : 'Завершен'}
                  </span>
                </li>
              ))}
            </ul>
            <div style={styles.inputGroup}>
              <input
                style={styles.input}
                placeholder="Название нового проекта"
                value={editForm.projectName}
                onChange={(e) => setEditForm({ ...editForm, projectName: e.target.value })}
              />
              <button style={styles.button} onClick={addProject}>➕ Добавить проект</button>
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>Настройки</div>
            <div style={styles.settingsGrid}>
              {Object.entries(appData.settings).map(([key, value]) => (
                <div key={key} style={styles.settingItem}>
                  <span>{key}:</span>
                  <span style={{ fontWeight: 'bold' }}>{String(value)}</span>
                </div>
              ))}
            </div>
            <div style={styles.inputGroup}>
              <input
                style={styles.input}
                placeholder="Ключ настройки"
                value={editForm.settingKey}
                onChange={(e) => setEditForm({ ...editForm, settingKey: e.target.value })}
              />
              <input
                style={styles.input}
                placeholder="Значение"
                value={editForm.settingValue}
                onChange={(e) => setEditForm({ ...editForm, settingValue: e.target.value })}
              />
              <button style={styles.button} onClick={updateSetting}>⚙️ Обновить</button>
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>Заметки</div>
            <ul style={styles.notesList}>
              {appData.notes.map((note, index) => (
                <li key={index} style={styles.noteItem}>{note}</li>
              ))}
            </ul>
            <div style={styles.inputGroup}>
              <input
                style={styles.input}
                placeholder="Новая заметка"
                value={editForm.newNote}
                onChange={(e) => setEditForm({ ...editForm, newNote: e.target.value })}
              />
              <button style={styles.button} onClick={addNote}>Добавить заметку</button>
            </div>
          </div>

          <div style={styles.warningBox}>
            <strong>Внимание:</strong> Все изменения сохраняются только в текущей сессии.
            Создавайте бэкапы для сохранения важных состояний!
          </div>
        </div>
      )}

      {activeTab === 'backup' && (
        <div style={styles.dataPanel}>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              style={{ ...styles.button, ...styles.buttonSuccess }}
              onClick={() => createBackup('Ручной бэкап')}
              disabled={isBackingUp}
            >
              {isBackingUp ? 'Создание...' : 'Создать новый бэкап'}
            </button>
            <label style={{ ...styles.button, ...styles.buttonSecondary, cursor: 'pointer' }}>
              Импорт бэкапа
              <input
                type="file"
                accept=".json"
                onChange={importBackup}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div style={styles.backupList}>
            {backupHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
                Нет созданных бэкапов. Нажмите "Создать новый бэкап"
              </div>
            ) : (
              backupHistory.map(backup => (
                <div key={backup.id} style={styles.backupItem}>
                  <div style={styles.backupHeader}>
                    <div>
                      <span style={styles.backupDate}>{backup.date}</span>
                      <span style={{ ...styles.backupVersion, marginLeft: '10px' }}>{backup.version}</span>
                    </div>
                    <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: '#ecf0f1', borderRadius: '4px' }}>
                      {backup.type === 'manual' ? 'Ручной' : 'Автоматический'}
                    </span>
                  </div>
                  <div style={styles.backupMeta}>
                    Размер: {backup.size} | ID: {backup.id}
                  </div>
                  <div style={styles.backupDescription}>
                    {backup.description}
                  </div>
                  <div style={styles.backupActions}>
                    <button
                      style={{ ...styles.smallButton, ...styles.buttonSuccess }}
                      onClick={() => restoreFromBackup(backup)}
                      disabled={isRestoring}
                    >
                      Восстановить
                    </button>
                    <button
                      style={{ ...styles.smallButton, ...styles.button }}
                      onClick={() => compareWithBackup(backup)}
                    >
                      Сравнить
                    </button>
                    <button
                      style={{ ...styles.smallButton, ...styles.buttonSecondary }}
                      onClick={() => exportBackup(backup)}
                    >
                      Экспорт
                    </button>
                    <button
                      style={{ ...styles.smallButton, ...styles.buttonDanger }}
                      onClick={() => deleteBackup(backup.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {backupHistory.length > 0 && (
            <div style={styles.warningBox}>
              <strong>💡 Совет:</strong> Регулярное создание бэкапов защитит ваши данные от потери.
              Храните важные бэкапы в надежном месте!
            </div>
          )}
        </div>
      )}

      {activeTab === 'guide' && (
        <div style={styles.dataPanel}>
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Что такое резервное копирование?</div>
            <p>Резервное копирование (бэкап) — это процесс создания копии данных для их восстановления в случае повреждения или потери.</p>
            <p><strong>Основные принципы:</strong></p>
            <ul>
              <li><strong>3-2-1 правило</strong>: 3 копии данных, 2 разных носителя, 1 оффлайн-копия</li>
              <li><strong>Регулярность</strong>: Создавайте бэкапы по расписанию</li>
              <li><strong>Шифрование</strong>: Защищайте важные бэкапы</li>
              <li><strong>Проверка</strong>: Регулярно тестируйте восстановление</li>
            </ul>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>Типы бэкапов</div>
            <ul>
              <li><strong>Полный бэкап</strong> — копия всех данных (занимает много места, но быстро восстанавливается)</li>
              <li><strong>Дифференциальный</strong> — копия изменений с момента последнего полного бэкапа</li>
              <li><strong>Инкрементальный</strong> — копия изменений с момента последнего любого бэкапа</li>
              <li><strong>Снимки (Snapshots)</strong> — моментальные копии состояния системы</li>
            </ul>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>Лучшие практики</div>
            <ol>
              <li><strong>Автоматизация</strong> — настройте автоматическое создание бэкапов</li>
              <li><strong>Хранение</strong> — держите бэкапы в разных местах (локально + облако)</li>
              <li><strong>Версионирование</strong> — сохраняйте несколько версий для возможности отката</li>
              <li><strong>Мониторинг</strong> — проверяйте успешность создания бэкапов</li>
              <li><strong>Шифрование</strong> — защищайте чувствительные данные</li>
            </ol>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>Инструменты для бэкапа</div>
            <ul>
              <li><strong>Git</strong> — для кода и конфигураций</li>
              <li><strong>rsync</strong> — синхронизация файлов</li>
              <li><strong>Duplicity</strong> — шифрованные бэкапы</li>
              <li><strong>BorgBackup</strong> — дедупликация и сжатие</li>
              <li><strong>Облачные сервисы</strong> — Google Drive, Dropbox, AWS S3</li>
            </ul>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>Пример кода (Node.js)</div>
            <pre style={{ backgroundColor: '#f4f4f4', padding: '15px', borderRadius: '8px', overflowX: 'auto', fontSize: '14px' }}>
{`const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Создание бэкапа
async function createBackup(sourceDir, backupDir) {
  const timestamp = new Date().toISOString().slice(0,19);
  const backupPath = path.join(backupDir, \`backup_\${timestamp}.zip\`);
  
  const output = fs.createWriteStream(backupPath);
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  archive.pipe(output);
  archive.directory(sourceDir, false);
  await archive.finalize();
  
  console.log(\`Бэкап создан: \${backupPath}\`);
  return backupPath;
}

// Восстановление из бэкапа
async function restoreBackup(backupFile, targetDir) {
  const extract = require('extract-zip');
  await extract(backupFile, { dir: targetDir });
  console.log(\`Восстановление завершено в \${targetDir}\`);
}`}
            </pre>
          </div>

          <div style={styles.warningBox}>
            <strong>⚠️ Важно:</strong> Регулярно проверяйте возможность восстановления из бэкапов!
            Бесполезный бэкап хуже, чем его отсутствие.
          </div>
        </div>
      )}

      {notification && (
        <div style={{
          ...styles.notification,
          ...(notification.type === 'success' ? styles.notificationSuccess :
             notification.type === 'error' ? styles.notificationError :
             notification.type === 'warning' ? styles.notificationWarning :
             styles.notificationInfo)
        }}>
          {notification.message}
        </div>
      )}

      {(isBackingUp || isRestoring) && (
        <div style={styles.loadingOverlay}>
          <div>
            <div style={styles.spinner}></div>
            <p style={{ color: 'white', marginTop: '10px' }}>
              {isBackingUp ? 'Создание бэкапа...' : 'Восстановление из бэкапа...'}
            </p>
          </div>
        </div>
      )}
    </div>
    </DemoCard>
    </DemoShell>
  );
};

const BackupDemo = () => {
  return <BackupDemoContent />;
};

export default BackupDemo;