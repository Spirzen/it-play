/** Модель и сценарии для AdoDataAccessPlay — классический ADO и ADO.NET */

export const ROW_COLUMNS = ['id', 'name', 'department'];

export const INITIAL_ROWS = [
  {id: 1, name: 'Alice Chen', department: 'Engineering'},
  {id: 2, name: 'Bob Smith', department: 'Sales'},
  {id: 3, name: 'Carol Diaz', department: 'Support'},
];

export const PARADIGMS = [
  {id: 'classic', label: 'Классический ADO (COM)'},
  {id: 'dotnet', label: 'ADO.NET'},
];

export const STACK_CLASSIC = [
  {id: 'app', label: 'Приложение', short: 'VB / ASP', role: 'VBScript, VBA, классический ASP'},
  {id: 'ado', label: 'ADO', short: 'ADODB', role: 'Connection · Command · Recordset · Field'},
  {id: 'oledb', label: 'OLE DB', short: 'Provider', role: 'Универсальный слой доступа к источнику'},
  {id: 'driver', label: 'Драйвер СУБД', short: 'Native', role: 'SQL Server, Access, Oracle…'},
  {id: 'db', label: 'Источник данных', short: 'СУБД', role: 'Таблица Employees · ACID'},
];

export const STACK_DOTNET = [
  {id: 'app', label: '.NET приложение', short: 'C#', role: 'Сервис, WinForms, ASP.NET'},
  {id: 'adonet', label: 'ADO.NET', short: 'System.Data', role: 'SqlConnection · SqlCommand · DataReader'},
  {id: 'provider', label: 'Data Provider', short: 'SqlClient', role: 'Microsoft.Data.SqlClient'},
  {id: 'db', label: 'SQL Server', short: 'СУБД', role: 'Таблица Employees'},
];

export const ACCESS_LAYERS = [
  {id: 'classic', label: 'ADO (COM)', desc: 'ADODB.Connection, Command, Recordset'},
  {id: 'adonet', label: 'ADO.NET connected', desc: 'SqlConnection, SqlCommand, SqlDataReader'},
  {id: 'dataset', label: 'ADO.NET DataSet', desc: 'DataAdapter.Fill — отключённый режим'},
];

export const CRUD_OPS = [
  {id: 'read', label: 'Read (SELECT)', verb: 'Чтение'},
  {id: 'create', label: 'Create (INSERT)', verb: 'Создание'},
  {id: 'update', label: 'Update (UPDATE)', verb: 'Обновление'},
  {id: 'delete', label: 'Delete (DELETE)', verb: 'Удаление'},
];

export const OBJECT_STEPS_CLASSIC = [
  {
    id: 'conn',
    label: 'Connection.Open',
    detail: 'Строка подключения с Provider=…; Data Source=…',
    active: ['connection'],
    code: 'Set conn = Server.CreateObject("ADODB.Connection")\nconn.Open "Provider=SQLOLEDB;..."',
  },
  {
    id: 'cmd',
    label: 'Command + Parameters',
    detail: 'Command связан с Connection; Parameter отделяет данные от SQL',
    active: ['connection', 'command', 'parameter'],
    code: 'Set cmd = Server.CreateObject("ADODB.Command")\nSet cmd.ActiveConnection = conn\ncmd.CommandText = "SELECT * FROM Employees WHERE id = ?"\ncmd.Parameters.Append cmd.CreateParameter("@id", adInteger, , , 2)',
  },
  {
    id: 'exec',
    label: 'Command.Execute → Recordset',
    detail: 'Результат SELECT — курсор Recordset',
    active: ['command', 'recordset'],
    code: 'Set rs = cmd.Execute\n\' или Set rs = conn.Execute(sql)',
  },
  {
    id: 'nav',
    label: 'Recordset.MoveNext + Field.Value',
    detail: 'Навигация по строкам; чтение столбцов через Field',
    active: ['recordset', 'field'],
    code: 'Do Until rs.EOF\n  WScript.Echo rs.Fields("name").Value\n  rs.MoveNext\nLoop',
  },
  {
    id: 'upd',
    label: 'Update / UpdateBatch',
    detail: 'Изменения в Recordset синхронизируются с источником',
    active: ['recordset', 'connection'],
    code: 'rs.Fields("department").Value = "R&D"\nrs.Update',
  },
  {
    id: 'close',
    label: 'Close Recordset & Connection',
    detail: 'Освобождение COM-объектов и возврат соединения в пул',
    active: ['connection'],
    code: 'rs.Close\nSet rs = Nothing\nconn.Close\nSet conn = Nothing',
  },
];

export const OBJECT_STEPS_DOTNET = [
  {
    id: 'conn',
    label: 'SqlConnection.Open',
    detail: 'Строка из appsettings; using / await using',
    active: ['connection'],
    code: 'await using var conn = new SqlConnection(connectionString);\nawait conn.OpenAsync();',
  },
  {
    id: 'cmd',
    label: 'SqlCommand + параметры',
    detail: 'Parameters.AddWithValue — защита от SQL-инъекций',
    active: ['connection', 'command', 'parameter'],
    code: 'using var cmd = new SqlCommand(sql, conn);\ncmd.Parameters.AddWithValue("@id", 2);',
  },
  {
    id: 'reader',
    label: 'ExecuteReader → SqlDataReader',
    detail: 'Потоковое чтение "только вперёд"; меньше памяти, чем Recordset',
    active: ['command', 'reader'],
    code: 'await using var reader = await cmd.ExecuteReaderAsync();\nwhile (await reader.ReadAsync()) { ... }',
  },
  {
    id: 'scalar',
    label: 'ExecuteNonQuery / ExecuteScalar',
    detail: 'INSERT/UPDATE/DELETE или одно значение COUNT(*)',
    active: ['command'],
    code: 'int rows = await cmd.ExecuteNonQueryAsync();\n// object n = await cmd.ExecuteScalarAsync();',
  },
  {
    id: 'adapter',
    label: 'DataAdapter → DataSet (опционально)',
    detail: 'Fill загружает таблицу в память; не нужно держать соединение открытым',
    active: ['adapter', 'dataset'],
    code: 'var adapter = new SqlDataAdapter(sql, conn);\nvar ds = new DataSet();\nadapter.Fill(ds, "Employees");',
  },
  {
    id: 'close',
    label: 'Dispose',
    detail: 'using закрывает reader, command, connection',
    active: ['connection'],
    code: '} // reader.Dispose(); conn.Dispose();',
  },
];

export const FLOW_SCENARIOS = [
  {
    id: 'classic-select',
    paradigm: 'classic',
    title: 'SELECT в классическом ADO',
    subtitle: 'Connection → Command → Recordset',
    steps: [
      {
        spotlight: ['app'],
        label: 'ASP/VB создаёт ADODB.Connection',
        detail: 'Server.CreateObject("ADODB.Connection")',
        packet: 'down',
        code: 'Set conn = Server.CreateObject("ADODB.Connection")',
      },
      {
        spotlight: ['ado', 'oledb'],
        label: 'Connection.Open',
        detail: 'OLE DB Provider устанавливает сессию с СУБД',
        packet: 'down',
        code: 'conn.Open "Provider=SQLOLEDB;Data Source=..."',
      },
      {
        spotlight: ['ado'],
        label: 'Command с параметром @id',
        detail: 'Command.ActiveConnection = conn',
        packet: 'down',
        code: 'Set cmd = CreateObject("ADODB.Command")\ncmd.CommandText = "SELECT * FROM Employees WHERE id = ?"',
      },
      {
        spotlight: ['db', 'driver'],
        label: 'СУБД выполняет SELECT',
        packet: 'request',
        code: 'SELECT id, name, department FROM Employees WHERE id = 2;',
      },
      {
        spotlight: ['ado'],
        label: 'Recordset с результатом',
        detail: 'rs.EOF, rs.MoveNext, Fields("name").Value',
        packet: 'up',
        code: 'Set rs = cmd.Execute\nDo Until rs.EOF\n  Response.Write rs("name")\n  rs.MoveNext\nLoop',
      },
      {
        spotlight: ['app', 'oledb'],
        label: 'rs.Close, conn.Close',
        packet: 'up',
        code: 'rs.Close : conn.Close',
      },
    ],
  },
  {
    id: 'dotnet-reader',
    paradigm: 'dotnet',
    title: 'SqlDataReader в ADO.NET',
    subtitle: 'Connected mode — потоковое чтение',
    steps: [
      {
        spotlight: ['app'],
        label: 'Сервис запрашивает сотрудника',
        packet: 'down',
        code: 'var employee = await repository.GetByIdAsync(2);',
      },
      {
        spotlight: ['adonet', 'provider'],
        label: 'SqlConnection.OpenAsync',
        packet: 'down',
        code: 'await using var conn = new SqlConnection(cs);\nawait conn.OpenAsync();',
      },
      {
        spotlight: ['adonet'],
        label: 'SqlCommand + ExecuteReader',
        packet: 'down',
        code: 'await using var reader = await cmd.ExecuteReaderAsync();',
      },
      {
        spotlight: ['db'],
        label: 'SQL Server',
        packet: 'request',
        code: 'SELECT id, name, department FROM Employees WHERE id = 2;',
      },
      {
        spotlight: ['adonet', 'app'],
        label: 'ReadAsync → объект',
        packet: 'up',
        code: 'if (await reader.ReadAsync())\n  return new Employee(reader.GetInt32(0), ...);',
      },
    ],
  },
  {
    id: 'dotnet-dataset',
    paradigm: 'dotnet',
    title: 'DataAdapter и DataSet',
    subtitle: 'Disconnected mode — кэш в памяти',
    steps: [
      {
        spotlight: ['app', 'adonet'],
        label: 'DataAdapter.Fill',
        detail: 'Один раз загрузили — работаем без открытого соединения',
        packet: 'down',
        code: 'var adapter = new SqlDataAdapter(sql, conn);\nvar ds = new DataSet();\nadapter.Fill(ds, "Employees");',
      },
      {
        spotlight: ['db'],
        label: 'SELECT всех строк',
        packet: 'request',
        code: 'SELECT id, name, department FROM Employees;',
      },
      {
        spotlight: ['app'],
        label: 'DataTable.Rows в памяти',
        detail: 'Связи, ограничения, офлайн-редактирование',
        packet: 'up',
        code: 'foreach (DataRow row in ds.Tables["Employees"].Rows)\n  Console.WriteLine(row["name"]);',
      },
      {
        spotlight: ['adonet'],
        label: 'adapter.Update(ds) — обратно в БД',
        packet: 'down',
        code: 'adapter.Update(ds, "Employees"); // INSERT/UPDATE/DELETE',
      },
    ],
  },
];

export const LIFECYCLE_CLASSIC = [
  {
    id: 'create',
    label: 'CreateObject ADODB.*',
    detail: 'COM-объекты через Server.CreateObject или New в VB6',
    layers: ['app', 'ado'],
    code: 'Set conn = CreateObject("ADODB.Connection")',
  },
  {
    id: 'open',
    label: 'Connection.Open',
    detail: 'Строка с Provider= и параметрами безопасности',
    layers: ['ado', 'oledb'],
    code: 'conn.Open connectionString',
  },
  {
    id: 'trans',
    label: 'BeginTrans / CommitTrans',
    detail: 'Группировка команд в атомарный блок',
    layers: ['ado', 'oledb'],
    code: 'conn.BeginTrans\n\' ... операции ...\nconn.CommitTrans',
  },
  {
    id: 'execute',
    label: 'Execute → Recordset',
    detail: 'Или RecordsAffected для INSERT/UPDATE/DELETE',
    layers: ['ado', 'db'],
    code: 'Set rs = cmd.Execute',
  },
  {
    id: 'errors',
    label: 'Connection.Errors',
    detail: 'Коллекция ошибок OLE DB после сбоя',
    layers: ['ado'],
    code: 'For Each err In conn.Errors\n  Debug.Print err.Description\nNext',
  },
  {
    id: 'close',
    label: 'Close & Nothing',
    detail: 'Явное освобождение COM-ссылок',
    layers: ['app'],
    code: 'conn.Close\nSet conn = Nothing',
  },
];

export const LIFECYCLE_DOTNET = [
  {
    id: 'config',
    label: 'Connection string',
    detail: 'appsettings.json, User Secrets, Azure Key Vault',
    layers: ['app'],
    code: '"ConnectionStrings": { "Default": "Server=..." }',
  },
  {
    id: 'open',
    label: 'SqlConnection',
    detail: 'Пул соединений на уровне провайдера',
    layers: ['adonet', 'provider'],
    code: 'await using var conn = new SqlConnection(cs);',
  },
  {
    id: 'command',
    label: 'SqlCommand',
    detail: 'Параметры, типы SqlDbType, таймаут',
    layers: ['adonet'],
    code: 'using var cmd = new SqlCommand(sql, conn);',
  },
  {
    id: 'read',
    label: 'DataReader или DataSet',
    detail: 'Connected vs disconnected — выбор по сценарию',
    layers: ['adonet', 'app'],
    code: '// reader — поток\n// DataAdapter.Fill — кэш',
  },
  {
    id: 'async',
    label: 'Async API',
    detail: 'OpenAsync, ExecuteReaderAsync — не блокирует UI',
    layers: ['app'],
    code: 'await cmd.ExecuteReaderAsync();',
  },
  {
    id: 'dispose',
    label: 'using / IAsyncDisposable',
    detail: 'Автоматическое закрытие и возврат в пул',
    layers: ['provider'],
    code: '} // Dispose',
  },
];

export function cloneRows(rows) {
  return rows.map((r) => ({...r}));
}

export function nextRowId(rows) {
  return rows.reduce((max, r) => Math.max(max, r.id), 0) + 1;
}

export function runCrud(rows, op, {id, name, department}) {
  const next = cloneRows(rows);
  const numId = Number(id);

  if (op === 'read') {
    if (numId) {
      const row = next.find((r) => r.id === numId);
      return {rows: next, result: row ? [row] : [], message: row ? null : 'Запись не найдена'};
    }
    return {rows: next, result: next.filter((r) => r.department === 'Engineering'), message: null};
  }

  if (op === 'create') {
    if (!name?.trim() || !department?.trim()) {
      return {rows: next, result: [], message: 'Заполните name и department'};
    }
    const row = {id: nextRowId(next), name: name.trim(), department: department.trim()};
    next.push(row);
    return {rows: next, result: [row], message: null};
  }

  if (op === 'update') {
    const idx = next.findIndex((r) => r.id === numId);
    if (idx < 0) {
      return {rows: next, result: [], message: 'Запись не найдена'};
    }
    next[idx] = {
      ...next[idx],
      name: name?.trim() || next[idx].name,
      department: department?.trim() || next[idx].department,
    };
    return {rows: next, result: [next[idx]], message: null};
  }

  if (op === 'delete') {
    const idx = next.findIndex((r) => r.id === numId);
    if (idx < 0) {
      return {rows: next, result: [], message: 'Запись не найдена'};
    }
    return {rows: next, result: next.splice(idx, 1), message: null};
  }

  return {rows: next, result: [], message: 'Неизвестная операция'};
}

export function sqlForOp(op, params) {
  const id = params.id ?? '?';
  switch (op) {
    case 'read':
      if (params.id) {
        return `SELECT id, name, department\nFROM Employees WHERE id = ${id};`;
      }
      return "SELECT id, name, department\nFROM Employees WHERE department = N'Engineering';";
    case 'create':
      return `INSERT INTO Employees (name, department)\nVALUES (N'${params.name}', N'${params.department}');`;
    case 'update':
      return `UPDATE Employees\nSET name = N'${params.name}', department = N'${params.department}'\nWHERE id = ${id};`;
    case 'delete':
      return `DELETE FROM Employees WHERE id = ${id};`;
    default:
      return '--';
  }
}

export function codeForLayer(layer, op, params) {
  const id = params.id ?? '2';
  const snippets = {
    classic: {
      read: params.id
        ? `Set conn = CreateObject("ADODB.Connection")\nconn.Open connStr\nSet cmd = CreateObject("ADODB.Command")\ncmd.ActiveConnection = conn\ncmd.CommandText = "SELECT * FROM Employees WHERE id = ?"\ncmd.Parameters.Append cmd.CreateParameter("@id", adInteger, , , ${id})\nSet rs = cmd.Execute\nDo Until rs.EOF\n  WScript.Echo rs.Fields("name").Value\n  rs.MoveNext\nLoop`
        : `Set rs = conn.Execute("SELECT * FROM Employees WHERE department = N'Engineering'")`,
      create: `cmd.CommandText = "INSERT INTO Employees (name, department) VALUES (?, ?)"\ncmd.Parameters.Append cmd.CreateParameter("@n", adVarWChar, , 100, "${params.name}")\ncmd.Parameters.Append cmd.CreateParameter("@d", adVarWChar, , 50, "${params.department}")\ncmd.Execute`,
      update: `Set rs = conn.Execute("SELECT * FROM Employees WHERE id = ${id}")\nIf Not rs.EOF Then\n  rs.Fields("department").Value = "${params.department}"\n  rs.Update\nEnd If`,
      delete: `conn.Execute "DELETE FROM Employees WHERE id = ${id}"`,
    },
    adonet: {
      read: params.id
        ? `await using var conn = new SqlConnection(connStr);\nvar sql = "SELECT id, name, department FROM Employees WHERE id = @id";\nusing var cmd = new SqlCommand(sql, conn);\ncmd.Parameters.AddWithValue("@id", ${id});\nawait conn.OpenAsync();\nawait using var reader = await cmd.ExecuteReaderAsync();\nwhile (await reader.ReadAsync()) { ... }`
        : `var sql = "SELECT * FROM Employees WHERE department = @dept";\ncmd.Parameters.AddWithValue("@dept", "Engineering");`,
      create: `var sql = "INSERT INTO Employees (name, department) VALUES (@n, @d)";\ncmd.Parameters.AddWithValue("@n", "${params.name}");\ncmd.Parameters.AddWithValue("@d", "${params.department}");\nawait cmd.ExecuteNonQueryAsync();`,
      update: `var sql = "UPDATE Employees SET name=@n, department=@d WHERE id=@id";\n// ExecuteNonQueryAsync`,
      delete: `var sql = "DELETE FROM Employees WHERE id = @id";\ncmd.Parameters.AddWithValue("@id", ${id});\nawait cmd.ExecuteNonQueryAsync();`,
    },
    dataset: {
      read: `var adapter = new SqlDataAdapter(\n  "SELECT * FROM Employees WHERE id = ${id}", conn);\nvar ds = new DataSet();\nadapter.Fill(ds, "Employees");\nDataTable table = ds.Tables["Employees"];`,
      create: `var adapter = new SqlDataAdapter("SELECT * FROM Employees", conn);\nvar builder = new SqlCommandBuilder(adapter);\nDataRow row = ds.Tables["Employees"].NewRow();\nrow["name"] = "${params.name}";\nrow["department"] = "${params.department}";\nds.Tables["Employees"].Rows.Add(row);\nadapter.Update(ds, "Employees");`,
      update: `DataRow row = ds.Tables["Employees"].Rows.Find(${id});\nrow["department"] = "${params.department}";\nadapter.Update(ds, "Employees");`,
      delete: `DataRow row = ds.Tables["Employees"].Rows.Find(${id});\nrow.Delete();\nadapter.Update(ds, "Employees");`,
    },
  };
  return snippets[layer]?.[op] ?? '// выберите операцию';
}

export function getStack(paradigm) {
  return paradigm === 'classic' ? STACK_CLASSIC : STACK_DOTNET;
}

export function getScenarios(paradigm) {
  return FLOW_SCENARIOS.filter((s) => s.paradigm === paradigm);
}
