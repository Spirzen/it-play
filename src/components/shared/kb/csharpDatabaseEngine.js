/** In-memory модель и сценарии для CsharpDatabasePlay */

export const PRODUCT_COLUMNS = ['id', 'name', 'price'];

export const INITIAL_PRODUCTS = [
  {id: 1, name: 'Laptop', price: 1200},
  {id: 2, name: 'Mouse', price: 25},
  {id: 3, name: 'Keyboard', price: 89},
];

export const STACK_LAYERS = [
  {id: 'app', label: 'C# приложение', short: 'Код', role: 'Сервис, DTO, сущности Product'},
  {id: 'ef', label: 'EF Core', short: 'ORM', role: 'DbContext · DbSet · Change Tracking'},
  {id: 'ado', label: 'ADO.NET', short: 'System.Data', role: 'SqlConnection · SqlCommand · SqlDataReader'},
  {id: 'provider', label: 'Провайдер', short: 'SqlClient', role: 'Microsoft.Data.SqlClient'},
  {id: 'db', label: 'SQL Server', short: 'СУБД', role: 'Таблица Products · ACID · миграции'},
];

export const ACCESS_LAYERS = [
  {id: 'ado', label: 'ADO.NET', desc: 'Прямой SQL, SqlCommand, полный контроль'},
  {id: 'ef', label: 'EF Core', desc: 'DbContext, LINQ, SaveChanges, миграции'},
  {id: 'linq2db', label: 'LINQ to DB', desc: 'DataConnection, ITable, высокая скорость'},
];

export const CRUD_OPS = [
  {id: 'read', label: 'Read (SELECT)', verb: 'Чтение'},
  {id: 'create', label: 'Create (INSERT)', verb: 'Создание'},
  {id: 'update', label: 'Update (UPDATE)', verb: 'Обновление'},
  {id: 'delete', label: 'Delete (DELETE)', verb: 'Удаление'},
];

export const LIFECYCLE_STEPS = [
  {
    id: 'config',
    label: 'Строка подключения',
    detail: 'appsettings.json → ConnectionStrings:DefaultConnection; внедрение через DI.',
    layers: ['app'],
    code: '// appsettings.json\n"ConnectionStrings": {\n  "Default": "Server=...;Database=MyDB;..."\n}',
  },
  {
    id: 'open',
    label: 'SqlConnection.Open',
    detail: 'using гарантирует Dispose; в EF соединение открывается лениво при первом запросе.',
    layers: ['ado', 'provider'],
    code: 'using var connection = new SqlConnection(connectionString);\nawait connection.OpenAsync();',
  },
  {
    id: 'command',
    label: 'SqlCommand + параметры',
    detail: 'Parameters.AddWithValue защищает от SQL-инъекций.',
    layers: ['ado'],
    code: 'var command = new SqlCommand(sql, connection);\ncommand.Parameters.AddWithValue("@id", productId);',
  },
  {
    id: 'execute',
    label: 'ExecuteReader / ExecuteNonQuery',
    detail: 'SELECT → SqlDataReader; INSERT/UPDATE/DELETE → число строк.',
    layers: ['ado', 'db'],
    code: 'using var reader = await command.ExecuteReaderAsync();\n// или int n = command.ExecuteNonQuery();',
  },
  {
    id: 'read',
    label: 'Чтение SqlDataReader',
    detail: 'reader.Read() — следующая строка; GetInt32 / GetString по имени или индексу.',
    layers: ['ado'],
    code: 'while (reader.Read()) {\n  var id = reader.GetInt32("id");\n  var name = reader.GetString("name");\n}',
  },
  {
    id: 'ef',
    label: 'Альтернатива: EF Core',
    detail: 'LINQ транслируется в SQL; SaveChanges() — пакет INSERT/UPDATE/DELETE.',
    layers: ['ef', 'app'],
    code: 'var list = db.Products.Where(p => p.Price > 100).ToList();\ndb.Products.Add(product);\nawait db.SaveChangesAsync();',
  },
  {
    id: 'close',
    label: 'Закрытие и пул',
    detail: 'using закрывает reader и connection; ADO.NET возвращает TCP в пул.',
    layers: ['provider'],
    code: '} // reader.Dispose(); connection.Dispose();',
  },
];

export const FLOW_SCENARIOS = [
  {
    id: 'select',
    title: 'SELECT через ADO.NET',
    subtitle: 'SqlDataReader и маппинг в Product',
    steps: [
      {
        spotlight: ['app'],
        label: 'Сервис запрашивает товар',
        detail: 'GetProductById(2) — бизнес-логика без SQL в контроллере',
        packet: 'down',
        code: 'var product = await repository.GetByIdAsync(2);',
      },
      {
        spotlight: ['ado', 'provider'],
        label: 'Открытие SqlConnection',
        detail: 'Строка из IConfiguration; пул соединений на уровне провайдера',
        packet: 'down',
        code: 'await using var conn = new SqlConnection(_connectionString);\nawait conn.OpenAsync();',
      },
      {
        spotlight: ['ado'],
        label: 'SqlCommand с параметром @id',
        detail: 'PreparedStatement-аналог в .NET',
        packet: 'down',
        code: 'var cmd = new SqlCommand(\n  "SELECT id, name, price FROM Products WHERE id = @id", conn);\ncmd.Parameters.AddWithValue("@id", 2);',
      },
      {
        spotlight: ['db', 'provider'],
        label: 'SQL Server выполняет SELECT',
        detail: 'Поиск по первичному ключу, возврат одной строки',
        packet: 'request',
        code: 'SELECT id, name, price FROM Products WHERE id = 2;',
      },
      {
        spotlight: ['ado'],
        label: 'SqlDataReader → Product',
        detail: 'while (reader.Read()) — материализация объекта',
        packet: 'up',
        code: 'if (await reader.ReadAsync())\n  return new Product {\n    Id = reader.GetInt32(0),\n    Name = reader.GetString(1),\n    Price = reader.GetDecimal(2)\n  };',
      },
      {
        spotlight: ['app', 'provider'],
        label: 'Соединение в пул',
        detail: 'await using закрывает reader и connection',
        packet: 'up',
        code: '} // Dispose → соединение возвращается в пул',
      },
    ],
  },
  {
    id: 'ef-crud',
    title: 'CRUD через EF Core',
    subtitle: 'DbContext, отслеживание изменений, SaveChanges',
    steps: [
      {
        spotlight: ['app', 'ef'],
        label: 'DbContext и DbSet<Product>',
        detail: 'AppDbContext регистрируется в DI (AddDbContext)',
        packet: 'down',
        code: 'await using var db = new AppDbContext();\nvar product = new Product { Name = "Monitor", Price = 350 };',
      },
      {
        spotlight: ['ef'],
        label: 'Add и отслеживание',
        detail: 'Сущность в состоянии Added; SQL ещё не отправлен',
        packet: 'down',
        code: 'db.Products.Add(product);',
      },
      {
        spotlight: ['ef', 'ado'],
        label: 'SaveChanges → INSERT',
        detail: 'EF генерирует SQL и выполняет через ADO.NET',
        packet: 'down',
        code: 'await db.SaveChangesAsync();\n// INSERT INTO Products (Name, Price) VALUES (...)',
      },
      {
        spotlight: ['db'],
        label: 'Строка в таблице',
        detail: 'IDENTITY назначает Id; __EFMigrationsHistory для схемы',
        packet: 'request',
        code: '-- product.Id = 4',
      },
      {
        spotlight: ['app', 'ef'],
        label: 'LINQ-запрос на чтение',
        detail: 'Where транслируется в SQL на сервере',
        packet: 'up',
        code: 'var expensive = db.Products\n  .Where(p => p.Price > 1000)\n  .ToList();',
      },
    ],
  },
  {
    id: 'linq',
    title: 'LINQ → SQL',
    subtitle: 'Декларативный запрос без ручного SQL',
    steps: [
      {
        spotlight: ['app'],
        label: 'LINQ в C# коде',
        detail: 'Запрос строится как цепочка методов',
        packet: 'down',
        code: 'var query = db.Products\n  .Where(p => p.Price > 100)\n  .OrderBy(p => p.Name);',
      },
      {
        spotlight: ['ef'],
        label: 'Построитель выражений',
        detail: 'IQueryable не выполняется, пока нет ToList/First',
        packet: 'down',
        code: '// Expression Tree → SQL-текст провайдером',
      },
      {
        spotlight: ['ado', 'db'],
        label: 'Выполнение на СУБД',
        detail: 'Фильтрация и сортировка на сервере, не в памяти',
        packet: 'request',
        code: 'SELECT [p].[Id], [p].[Name], [p].[Price]\nFROM [Products] AS [p]\nWHERE [p].[Price] > 100\nORDER BY [p].[Name];',
      },
      {
        spotlight: ['app'],
        label: 'Материализация List<Product>',
        detail: 'ToList() загружает результат в коллекцию',
        packet: 'up',
        code: 'List<Product> products = query.ToList();',
      },
    ],
  },
];

export function cloneProducts(products) {
  return products.map((p) => ({...p}));
}

export function nextProductId(products) {
  return products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
}

export function runCrud(products, op, {id, name, price}) {
  const next = cloneProducts(products);
  const numId = Number(id);

  if (op === 'read') {
    if (numId) {
      const row = next.find((p) => p.id === numId);
      return {products: next, rows: row ? [row] : [], message: row ? null : 'Товар не найден'};
    }
    return {products: next, rows: next.filter((p) => p.price > 100), message: null};
  }

  if (op === 'create') {
    if (!name?.trim()) {
      return {products: next, rows: [], message: 'Укажите name'};
    }
    const numPrice = Number(price);
    if (Number.isNaN(numPrice) || numPrice < 0) {
      return {products: next, rows: [], message: 'Некорректная price'};
    }
    const row = {id: nextProductId(next), name: name.trim(), price: numPrice};
    next.push(row);
    return {products: next, rows: [row], message: null};
  }

  if (op === 'update') {
    const idx = next.findIndex((p) => p.id === numId);
    if (idx < 0) {
      return {products: next, rows: [], message: 'Товар не найден'};
    }
    const numPrice = Number(price);
    next[idx] = {
      ...next[idx],
      name: name?.trim() || next[idx].name,
      price: !Number.isNaN(numPrice) ? numPrice : next[idx].price,
    };
    return {products: next, rows: [next[idx]], message: null};
  }

  if (op === 'delete') {
    const idx = next.findIndex((p) => p.id === numId);
    if (idx < 0) {
      return {products: next, rows: [], message: 'Товар не найден'};
    }
    const removed = next.splice(idx, 1);
    return {products: next, rows: removed, message: null};
  }

  return {products: next, rows: [], message: 'Неизвестная операция'};
}

export function sqlForOp(op, params) {
  const id = params.id ?? '?';
  switch (op) {
    case 'read':
      if (params.id) {
        return `SELECT id, name, price\nFROM Products WHERE id = ${id};`;
      }
      return 'SELECT id, name, price\nFROM Products WHERE price > 100;';
    case 'create':
      return `INSERT INTO Products (name, price)\nVALUES (N'${params.name}', ${params.price});\nSELECT SCOPE_IDENTITY();`;
    case 'update':
      return `UPDATE Products\nSET name = N'${params.name}', price = ${params.price}\nWHERE id = ${id};`;
    case 'delete':
      return `DELETE FROM Products WHERE id = ${id};`;
    default:
      return '--';
  }
}

export function csharpCodeForLayer(layer, op, params) {
  const id = params.id ?? '2';
  const snippets = {
    ado: {
      read: params.id
        ? `await using var connection = new SqlConnection(connectionString);\nvar query = "SELECT id, name, price FROM Products WHERE id = @id";\nusing var command = new SqlCommand(query, connection);\ncommand.Parameters.AddWithValue("@id", ${id});\nawait connection.OpenAsync();\nusing var reader = await command.ExecuteReaderAsync();\nif (await reader.ReadAsync()) {\n  return new Product {\n    Id = reader.GetInt32(0),\n    Name = reader.GetString(1),\n    Price = reader.GetDecimal(2)\n  };\n}`
        : `var query = "SELECT id, name, price FROM Products WHERE price > 100";\n// SqlDataReader в цикле while (reader.Read())`,
      create: `var query = @"INSERT INTO Products (name, price)\n  VALUES (@name, @price)";\nusing var command = new SqlCommand(query, connection);\ncommand.Parameters.AddWithValue("@name", "${params.name}");\ncommand.Parameters.AddWithValue("@price", ${params.price});\nint rows = await command.ExecuteNonQueryAsync();`,
      update: `var query = "UPDATE Products SET name = @name, price = @price WHERE id = @id";\ncommand.Parameters.AddWithValue("@name", "${params.name}");\ncommand.Parameters.AddWithValue("@price", ${params.price});\ncommand.Parameters.AddWithValue("@id", ${id});`,
      delete: `var query = "DELETE FROM Products WHERE id = @id";\ncommand.Parameters.AddWithValue("@id", ${id});\nawait command.ExecuteNonQueryAsync();`,
    },
    ef: {
      read: params.id
        ? `await using var db = new AppDbContext();\nvar product = await db.Products.FindAsync(${id});`
        : `var products = await db.Products\n  .Where(p => p.Price > 100)\n  .ToListAsync();`,
      create: `var product = new Product { Name = "${params.name}", Price = ${params.price}m };\ndb.Products.Add(product);\nawait db.SaveChangesAsync();\n// product.Id заполнен после SaveChanges`,
      update: `var product = await db.Products.FindAsync(${id});\nproduct.Price = ${params.price}m;\nawait db.SaveChangesAsync(); // UPDATE по отслеживанию`,
      delete: `var product = await db.Products.FindAsync(${id});\ndb.Products.Remove(product);\nawait db.SaveChangesAsync();`,
    },
    linq2db: {
      read: params.id
        ? `await using var db = new MyDb();\nvar product = await db.Products\n  .FirstOrDefaultAsync(p => p.Id == ${id});`
        : `var list = await db.Products\n  .Where(p => p.Price > 100)\n  .ToListAsync();`,
      create: `await db.Products.InsertAsync(() => new Product {\n  Name = "${params.name}", Price = ${params.price}m\n});`,
      update: `await db.Products\n  .Where(p => p.Id == ${id})\n  .Set(p => p.Price, ${params.price}m)\n  .UpdateAsync();`,
      delete: `await db.Products.DeleteAsync(p => p.Id == ${id});`,
    },
  };
  return snippets[layer]?.[op] ?? '// выберите операцию';
}
