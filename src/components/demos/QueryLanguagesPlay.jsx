import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from './searchPlays.module.css';

const INTENT =
  'Найти друзей друзей пользователя "Тимур" и посчитать, сколько общих друзей у каждого.';

const LANGUAGES = [
  {
    id: 'sql',
    name: 'SQL',
    model: 'Реляционные таблицы',
    code: `SELECT fof.name, COUNT(*) AS common_friends
FROM users u
JOIN friendships f1 ON f1.user_id = u.id
JOIN users friend ON friend.id = f1.friend_id
JOIN friendships f2 ON f2.user_id = friend.id
JOIN users fof ON fof.id = f2.friend_id
WHERE u.name = 'Тимур'
GROUP BY fof.name
ORDER BY common_friends DESC;`,
    note: 'Явные JOIN по внешним ключам; схема должна быть нормализована заранее.',
  },
  {
    id: 'lucene',
    name: 'Lucene Query',
    model: 'Полнотекстовый индекс',
    code: `friend_name:Тимур AND type:FRIEND
(title:"друзья друзей" OR body:fof)
^2.0`,
    note: 'Строковый синтаксис: поля, фразы, boost. Под капотом — инвертированный индекс.',
  },
  {
    id: 'es',
    name: 'Elasticsearch DSL',
    model: 'JSON-запрос к Lucene',
    code: `{
  "query": {
    "bool": {
      "must": [
        { "term": { "user.name.keyword": "Тимур" } },
        { "match": { "relation": "FRIEND" } }
      ]
    }
  },
  "aggs": {
    "fof": { "terms": { "field": "fof.name.keyword" } }
  }
}`,
    note: 'filter не влияет на score; aggs — аналитика поверх поиска.',
  },
  {
    id: 'cypher',
    name: 'Cypher',
    model: 'Граф (Neo4j)',
    code: `MATCH (u:User {name: "Тимур"})-[:FRIEND]->(friend)-[:FRIEND]->(fof)
RETURN fof.name, COUNT(*) AS common_friends
ORDER BY common_friends DESC`,
    note: 'Паттерн пути — базовая единица; связи именованы и направлены.',
  },
  {
    id: 'sparql',
    name: 'SPARQL',
    model: 'RDF-триплеты',
    code: `SELECT ?person ?name (COUNT(?mutual) AS ?cnt)
WHERE {
  ?person <знать> <Человек_Тимур> .
  ?person <имя> ?name .
  ?mutual <знать> ?person .
}
GROUP BY ?person ?name
ORDER BY DESC(?cnt)`,
    note: 'Шаблон графа знаний; стандарт W3C для семантической паутины.',
  },
];

function QueryLanguagesPlayInner() {
  const [langId, setLangId] = useState('cypher');
  const lang = LANGUAGES.find((l) => l.id === langId) ?? LANGUAGES[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Один запрос — разные языки"
        subtitle="Как модель данных определяет синтаксис: SQL, Lucene, Elasticsearch, Cypher, SPARQL"
      >
        <div className={styles.intent}>
          <strong>Намерение:</strong> {INTENT}
        </div>

        <div className={styles.langTabs}>
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              type="button"
              className={clsx(styles.tab, langId === l.id && styles.tabActive)}
              onClick={() => setLangId(l.id)}
            >
              {l.name}
            </button>
          ))}
        </div>

        <p className={styles.hint}>
          Модель: <strong>{lang.model}</strong>
        </p>
        <div className={styles.codeBlock}>
          <pre className={styles.mono}>{lang.code}</pre>
        </div>
        <p className={styles.hint}>{lang.note}</p>

        <div className={styles.panel}>
          <span className={styles.panelTitle}>Конвейер обработки (любой язык)</span>
          <p style={{margin: 0, fontSize: '0.85rem', lineHeight: 1.5}}>
            Парсинг → валидация → оптимизация плана → выполнение на движке → сериализация
            результата (таблица, JSON, поток). Язык задаёт <em>что</em>, движок — <em>как</em>.
          </p>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default QueryLanguagesPlayInner;
