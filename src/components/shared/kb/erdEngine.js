/** Данные сценариев для ERDDemo — сущности, связи, Mermaid и SQL. */

export const SCENARIOS = [
  {
    id: 'shop',
    label: 'Магазин',
    title: 'Покупатель и заказ',
    cardinality: '1:N',
    cardinalityDesc:
      'Один покупатель может разместить множество заказов; каждый заказ принадлежит одному покупателю. Внешний ключ CustomerId — на стороне "многих".',
    relationVerb: 'размещает',
    mermaid: `erDiagram
    CUSTOMER ||--o{ ORDER : размещает
    CUSTOMER {
        int Id PK
        string Name
        string Email
    }
    ORDER {
        int Id PK
        date OrderDate
        string Status
        int CustomerId FK
    }`,
    sql: `CREATE TABLE Customer (
    Id INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150)
);

CREATE TABLE Order (
    Id INT PRIMARY KEY,
    OrderDate DATE NOT NULL,
    Status VARCHAR(20) NOT NULL,
    CustomerId INT NOT NULL,
    FOREIGN KEY (CustomerId) REFERENCES Customer(Id)
);`,
    entities: [
      {
        id: 'customer',
        name: 'CUSTOMER',
        title: 'Покупатель',
        fields: [
          {name: 'Id', type: 'int', pk: true},
          {name: 'Name', type: 'string'},
          {name: 'Email', type: 'string'},
        ],
      },
      {
        id: 'order',
        name: 'ORDER',
        title: 'Заказ',
        fields: [
          {name: 'Id', type: 'int', pk: true},
          {name: 'OrderDate', type: 'date'},
          {name: 'Status', type: 'string'},
          {name: 'CustomerId', type: 'int', fk: true, ref: 'customer', refField: 'Id'},
        ],
      },
    ],
    relation: {from: 'customer', to: 'order', fromCard: '1', toCard: 'N', verb: 'размещает', fkEntity: 'order', fkField: 'CustomerId'},
  },
  {
    id: 'library',
    label: 'Библиотека',
    title: 'Автор и книга',
    cardinality: '1:N',
    cardinalityDesc:
      'Один автор может написать множество книг; у каждой книги в упрощённой модели один автор. Поле AuthorId в Book — внешний ключ.',
    relationVerb: 'пишет',
    mermaid: `erDiagram
    AUTHOR ||--o{ BOOK : пишет
    AUTHOR {
        int Id PK
        string FirstName
        string LastName
        date BirthDate
    }
    BOOK {
        int Id PK
        string Title
        int PublicationYear
        int AuthorId FK
    }`,
    sql: `CREATE TABLE Author (
    Id INT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    BirthDate DATE
);

CREATE TABLE Book (
    Id INT PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    PublicationYear INT,
    AuthorId INT NOT NULL,
    FOREIGN KEY (AuthorId) REFERENCES Author(Id)
);`,
    entities: [
      {
        id: 'author',
        name: 'AUTHOR',
        title: 'Автор',
        fields: [
          {name: 'Id', type: 'int', pk: true},
          {name: 'FirstName', type: 'string'},
          {name: 'LastName', type: 'string'},
          {name: 'BirthDate', type: 'date'},
        ],
      },
      {
        id: 'book',
        name: 'BOOK',
        title: 'Книга',
        fields: [
          {name: 'Id', type: 'int', pk: true},
          {name: 'Title', type: 'string'},
          {name: 'PublicationYear', type: 'int'},
          {name: 'AuthorId', type: 'int', fk: true, ref: 'author', refField: 'Id'},
        ],
      },
    ],
    relation: {from: 'author', to: 'book', fromCard: '1', toCard: 'N', verb: 'пишет', fkEntity: 'book', fkField: 'AuthorId'},
  },
  {
    id: 'enrollment',
    label: 'Учёба',
    title: 'Студент и курс (M:N)',
    cardinality: 'M:N',
    cardinalityDesc:
      'Многие студенты записываются на многие курсы. Связь реализуется промежуточной таблицей Enrollment с составным первичным ключом и дополнительными атрибутами связи.',
    relationVerb: 'записан на',
    mermaid: `erDiagram
    STUDENT }o--o{ COURSE : записан
    STUDENT {
        int Id PK
        string FullName
    }
    COURSE {
        int Id PK
        string Title
    }
    ENROLLMENT {
        int StudentId PK,FK
        int CourseId PK,FK
        date EnrolledAt
        string Grade
    }
    STUDENT ||--o{ ENROLLMENT : имеет
    COURSE ||--o{ ENROLLMENT : включает`,
    sql: `CREATE TABLE Student (
    Id INT PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL
);

CREATE TABLE Course (
    Id INT PRIMARY KEY,
    Title VARCHAR(200) NOT NULL
);

CREATE TABLE Enrollment (
    StudentId INT,
    CourseId INT,
    EnrolledAt DATE,
    Grade VARCHAR(5),
    PRIMARY KEY (StudentId, CourseId),
    FOREIGN KEY (StudentId) REFERENCES Student(Id),
    FOREIGN KEY (CourseId) REFERENCES Course(Id)
);`,
    entities: [
      {
        id: 'student',
        name: 'STUDENT',
        title: 'Студент',
        fields: [
          {name: 'Id', type: 'int', pk: true},
          {name: 'FullName', type: 'string'},
        ],
      },
      {
        id: 'enrollment',
        name: 'ENROLLMENT',
        title: 'Зачисление',
        junction: true,
        fields: [
          {name: 'StudentId', type: 'int', pk: true, fk: true, ref: 'student', refField: 'Id'},
          {name: 'CourseId', type: 'int', pk: true, fk: true, ref: 'course', refField: 'Id'},
          {name: 'EnrolledAt', type: 'date'},
          {name: 'Grade', type: 'string'},
        ],
      },
      {
        id: 'course',
        name: 'COURSE',
        title: 'Курс',
        fields: [
          {name: 'Id', type: 'int', pk: true},
          {name: 'Title', type: 'string'},
        ],
      },
    ],
    relations: [
      {from: 'student', to: 'enrollment', fromCard: '1', toCard: 'N', verb: 'имеет', fkEntity: 'enrollment', fkField: 'StudentId'},
      {from: 'course', to: 'enrollment', fromCard: '1', toCard: 'N', verb: 'включает', fkEntity: 'enrollment', fkField: 'CourseId'},
    ],
  },
];

export function getScenario(id) {
  return SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];
}

export function getEntity(scenario, entityId) {
  return scenario.entities.find((e) => e.id === entityId);
}
