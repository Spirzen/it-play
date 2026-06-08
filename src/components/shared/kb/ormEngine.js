export const ENTITY_KEYS = ['user', 'post', 'role'];

export const ENTITIES = {
  user: {
    name: 'User',
    table: 'users',
    fields: [
      {name: 'id', type: 'BIGINT', pk: true, auto: true, ormType: 'number', column: 'id'},
      {name: 'username', type: 'VARCHAR(50)', nullable: false, ormType: 'string', column: 'username'},
      {name: 'email', type: 'VARCHAR(100)', nullable: false, unique: true, ormType: 'string', column: 'email'},
      {
        name: 'created_at',
        type: 'TIMESTAMP',
        default: 'CURRENT_TIMESTAMP',
        ormType: 'Date',
        column: 'createdAt',
      },
    ],
    relations: [
      {type: 'OneToMany', target: 'Post', mappedBy: 'author'},
      {type: 'ManyToMany', target: 'Role', joinTable: 'user_roles'},
    ],
  },
  post: {
    name: 'Post',
    table: 'posts',
    fields: [
      {name: 'id', type: 'BIGINT', pk: true, auto: true, ormType: 'number', column: 'id'},
      {name: 'title', type: 'VARCHAR(200)', nullable: false, ormType: 'string', column: 'title'},
      {name: 'content', type: 'TEXT', ormType: 'string', column: 'content'},
      {name: 'author_id', type: 'BIGINT', fk: true, ormType: 'User', column: 'author'},
    ],
    relations: [{type: 'ManyToOne', target: 'User', field: 'author', joinColumn: 'author_id'}],
  },
  role: {
    name: 'Role',
    table: 'roles',
    fields: [
      {name: 'id', type: 'BIGINT', pk: true, auto: true, ormType: 'number', column: 'id'},
      {name: 'name', type: 'VARCHAR(50)', nullable: false, ormType: 'string', column: 'name'},
    ],
    relations: [{type: 'ManyToMany', target: 'User', mappedBy: 'roles'}],
  },
};

export const ORM_QUERIES = {
  user: {
    find: `const user = await userRepository.findOne({
  where: { id: 1 },
  relations: ['posts', 'roles'],
});`,
    create: `const user = userRepository.create({
  username: 'john_doe',
  email: 'john@example.com',
});
await userRepository.save(user);`,
    update: `await userRepository.update(
  { id: 1 },
  { email: 'newemail@example.com' },
);`,
  },
  post: {
    find: `const posts = await postRepository.find({
  where: { author: { id: 1 } },
  relations: ['author'],
});`,
    create: `const post = postRepository.create({
  title: 'ORM Tutorial',
  content: 'Content…',
  author: user,
});
await postRepository.save(post);`,
    update: `await postRepository.update(
  { id: 1 },
  { title: 'Updated Title' },
);`,
  },
  role: {
    find: `const user = await userRepository.findOne({
  where: { id: 1 },
  relations: ['roles'],
});`,
    create: `const role = roleRepository.create({ name: 'ADMIN' });
await roleRepository.save(role);`,
    update: `user.roles = [...user.roles, adminRole];
await userRepository.save(user);`,
  },
};

export const QUERY_OPS = [
  {id: 'find', label: 'Find', icon: '🔍'},
  {id: 'create', label: 'Create', icon: '➕'},
  {id: 'update', label: 'Update', icon: '✏️'},
];

export const QUERY_RESULTS = {
  find: {success: true, rows: 3, message: 'Найдено 3 записи'},
  create: {success: true, rows: 1, message: 'Создана запись (ID: 42)'},
  update: {success: true, rows: 1, message: 'Обновлена 1 запись'},
};

export const RELATIONS_CODE = `// User ↔ Post (OneToMany / ManyToOne)
@OneToMany(() => Post, (post) => post.author)
posts: Post[];

@ManyToOne(() => User, (user) => user.posts)
@JoinColumn({ name: 'author_id' })
author: User;

// User ↔ Role (ManyToMany)
@ManyToMany(() => Role)
@JoinTable({ name: 'user_roles' })
roles: Role[];`;

export function buildEntityClassCode(entityKey) {
  const e = ENTITIES[entityKey];
  const lines = [`@Entity('${e.table}')`, `export class ${e.name} {`];

  for (const f of e.fields) {
    if (f.pk) {
      lines.push('  @PrimaryGeneratedColumn()', `  ${f.column}: ${f.ormType};`, '');
    } else if (f.fk) {
      lines.push(`  @ManyToOne(() => ${f.ormType})`, `  ${f.column}: ${f.ormType};`, '');
    } else {
      const opts = [];
      if (f.unique) opts.push('unique: true');
      if (f.nullable === false) opts.push('nullable: false');
      const colLine = opts.length ? `  @Column({ ${opts.join(', ')} })` : '  @Column()';
      lines.push(colLine, `  ${f.column}: ${f.ormType};`, '');
    }
  }

  for (const r of e.relations) {
    if (r.type === 'OneToMany') {
      lines.push(
        `  @OneToMany(() => ${r.target}, (${r.target.toLowerCase()}) => ${r.target.toLowerCase()}.${r.mappedBy})`,
        `  ${r.target.toLowerCase()}s: ${r.target}[];`,
        '',
      );
    } else if (r.type === 'ManyToOne') {
      lines.push(
        `  @ManyToOne(() => ${r.target})`,
        `  @JoinColumn({ name: '${r.joinColumn}' })`,
        `  ${r.field}: ${r.target};`,
        '',
      );
    } else if (r.type === 'ManyToMany') {
      const prop = r.mappedBy ? `${r.target.toLowerCase()}s` : 'roles';
      const jt = r.joinTable ? `\n  @JoinTable({ name: '${r.joinTable}' })` : '';
      const mapped = r.mappedBy ? `\n  @ManyToMany(() => ${r.target}, (${r.target.toLowerCase()}) => ${r.target.toLowerCase()}.${r.mappedBy})` : `\n  @ManyToMany(() => ${r.target})${jt}`;
      lines.push(mapped, `  ${prop}: ${r.target}[];`, '');
    }
  }

  lines.push('}');
  return lines.join('\n');
}

export function simulateQuery(op) {
  return QUERY_RESULTS[op] ?? QUERY_RESULTS.find;
}

export const ER_NODES = [
  {
    id: 'users',
    label: 'users',
    fields: 'id (PK) · username · email',
    badges: ['↓ OneToMany → posts', '↔ ManyToMany → roles'],
    tone: 'primary',
  },
  {
    id: 'posts',
    label: 'posts',
    fields: 'id (PK) · title · author_id (FK)',
    badges: ['↑ ManyToOne → users'],
    tone: 'success',
    indent: true,
  },
  {
    id: 'roles',
    label: 'roles',
    fields: 'id (PK) · name',
    badges: ['↔ ManyToMany → users (user_roles)'],
    tone: 'warning',
  },
];
