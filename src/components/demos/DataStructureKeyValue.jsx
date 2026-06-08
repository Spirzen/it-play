import React, {useState, useMemo} from 'react';
import clsx from 'clsx';
import {
  DataStructureLayout,
  LangTabs,
  TypeChips,
  CodeBlock,
  VizSection,
  InfoNote,
  resolveDataLang,
  useCopyToClipboard,
} from '@/components/shared/kb/dataStructureDemo';
import styles from '@/components/shared/kb/dataStructureDemo.module.css';

const DATA = [
  {key: 'user_101', value: "{ name: 'Алексей', role: 'Dev' }"},
  {key: 'user_102', value: "{ name: 'Мария', role: 'QA' }"},
  {key: 'user_103', value: "{ name: 'Дмитрий', role: 'Manager' }"},
  {key: 'session_A', value: "{ token: 'xyz…', expires: '1h' }"},
  {key: 'config_v1', value: "{ debug: true, version: '1.0' }"},
];

const CODE = {
  js: {
    dictionary: `const userDB = {
  "user_101": { name: "Алексей", role: "Dev" },
  "user_102": { name: "Мария", role: "QA" }
};
const user = userDB["user_101"]; // O(1)`,
    hash: `function hash(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++)
    h = ((h << 5) - h) + key.charCodeAt(i);
  return Math.abs(h) % 8;
}
// ключ → индекс bucket`,
  },
  py: {
    dictionary: `users = {"user_101": {"name": "Алексей"}}
print(users["user_101"])`,
    hash: `def bucket_index(key, size=8):
    return sum(ord(c) for c in key) % size`,
  },
  java: {
    dictionary: `Map<String, Map<String, String>> userDB = Map.of(
    "user_101", Map.of("name", "Алексей", "role", "Dev")
);
var user = userDB.get("user_101"); // O(1) в среднем`,
    hash: `int bucketIndex(String key, int size) {
    return Math.floorMod(key.hashCode(), size);
}`,
  },
  cs: {
    dictionary: `var userDB = new Dictionary<string, object> {
  ["user_101"] = new { Name = "Алексей" }
};`,
    hash: `int index = Math.Abs(key.GetHashCode()) % 8;`,
  },
  dart: {
    dictionary: `final userDB = <String, Map<String, String>>{
  'user_101': {'name': 'Алексей', 'role': 'Dev'},
  'user_102': {'name': 'Мария', 'role': 'QA'},
};
final user = userDB['user_101']; // O(1)`,
    hash: `int bucketIndex(String key, int size) =>
    key.hashCode.abs() % size;`,
  },
  r: {
    dictionary: `users <- list(
  user_101 = list(name = "Алексей", role = "Dev"),
  user_102 = list(name = "Мария", role = "QA")
)
users$user_101  # O(1) по имени`,
    hash: `# именованный список / environment;
# хеш-таблица — внутренняя реализация`,
  },
  lua: {
    dictionary: `local userDB = {
  user_101 = {name = "Алексей", role = "Dev"},
  user_102 = {name = "Мария", role = "QA"},
}
local user = userDB["user_101"] -- O(1)`,
    hash: `local function bucket(key, size)
  local h = 0
  for i = 1, #key do h = h + string.byte(key, i) end
  return h % size + 1
end`,
  },
  groovy: {
    dictionary: `def userDB = [
  user_101: [name: 'Алексей', role: 'Dev'],
  user_102: [name: 'Мария', role: 'QA'],
]
def user = userDB.user_101 // O(1)`,
    hash: `int bucket = Math.abs(key.hashCode()) % 8`,
  },
  fortran: {
    dictionary: `! ассоциативный массив (Fortran 2003+)
type :: User
  character(len=32) :: name
  character(len=16) :: role
end type
! или параллельные массивы ключей и записей`,
    hash: `! хеш-индекс задаётся вручную или через библиотеку`,
  },
  bsl: {
    dictionary: `Пользователи = Новый Соответствие;
Пользователи.Вставить("user_101",
  Новый Структура("Имя, Роль", "Алексей", "Dev"));
Пользователь = Пользователи["user_101"]; // O(1)`,
    hash: `// внутри Соответствие — хеш-таблица платформы`,
  },
};

const STORE_OPTIONS = [
  {id: 'dictionary', label: 'Словарь (логика)'},
  {id: 'hash', label: 'Хеш-таблица (физика)'},
];

function hashIndex(key, size = 8) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = ((h << 5) - h) + key.charCodeAt(i);
  return Math.abs(h) % size;
}

function KeyValueLogic({defaultLang = 'js'}) {
  const [activeTab, setActiveTab] = useState(() => resolveDataLang(defaultLang, CODE));
  const [storeType, setStoreType] = useState('dictionary');
  const [selected, setSelected] = useState(null);
  const {copied, copy} = useCopyToClipboard();

  const buckets = useMemo(() => {
    const size = 8;
    const slots = Array.from({length: size}, (_, i) => ({index: i, keys: []}));
    DATA.forEach((item) => {
      const idx = hashIndex(item.key, size);
      slots[idx].keys.push(item.key);
    });
    return slots;
  }, []);

  const selectedIdx = selected != null ? hashIndex(DATA[selected].key) : null;

  return (
    <DataStructureLayout
      title="Структура &quot;Ключ–значение&quot;"
      subtitle="Каждый элемент доступен по уникальному ключу без перебора всей коллекции. Основа словарей, хеш-таблиц, NoSQL и кэшей."
    >
      <TypeChips options={STORE_OPTIONS} value={storeType} onChange={setStoreType} />
      <LangTabs active={activeTab} onChange={setActiveTab} />
      <CodeBlock
        code={(CODE[activeTab] ?? CODE.js)[storeType]}
        copied={copied}
        onCopy={copy}
      />

      <VizSection label={storeType === 'dictionary' ? 'Пары ключ → значение' : 'Buckets хеш-таблицы'}>
        {storeType === 'dictionary' ? (
          <div className={styles.kvGrid}>
            {DATA.map((item, index) => (
              <button
                key={item.key}
                type="button"
                className={clsx(styles.kvCard, selected === index && styles.kvCardSelected)}
                onClick={() => setSelected(index)}
              >
                <div className={styles.kvKey}>Ключ</div>
                <div className={styles.kvKeyText}>&quot;{item.key}&quot;</div>
                <div className={styles.kvKey}>Значение</div>
                <div className={styles.kvValue}>{item.value}</div>
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.hashBuckets}>
            {buckets.map((slot) => (
              <div
                key={slot.index}
                className={clsx(styles.hashSlot, selectedIdx === slot.index && styles.hashSlotHit)}
              >
                <div>#{slot.index}</div>
                {slot.keys.length ? (
                  <div style={{fontSize: '0.7rem', marginTop: 4}}>{slot.keys.join(', ')}</div>
                ) : (
                  <div style={{opacity: 0.5}}>∅</div>
                )}
              </div>
            ))}
          </div>
        )}
        {selected != null && storeType === 'dictionary' && (
          <p className={styles.coordHint}>
            lookup(&quot;{DATA[selected].key}&quot;) → {DATA[selected].value}
          </p>
        )}
      </VizSection>

      <InfoNote title="Сложность (в среднем):">
        Доступ, вставка и удаление — O(1). Ключ преобразуется в индекс (хеш), по которому сразу находят ячейку.
      </InfoNote>
    </DataStructureLayout>
  );
}

export default function DataStructureKeyValue({defaultLang = 'js'}) {
  return <KeyValueLogic/>;
}
