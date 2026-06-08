/** Учебная БД тренажёра: shop_data + legacy users */

import {INITIAL_USERS, JOIN_CITIES, JOIN_USERS} from './sqlEngine';

export const SHOP_TABLES = ['customers', 'products', 'orders', 'order_items', 'cities'];

export const TABLE_META = {
  users: {
    label: 'users',
    description: 'Сотрудники (классический пример)',
    columns: ['id', 'name', 'age', 'city', 'salary'],
    pk: 'id',
  },
  customers: {
    label: 'customers',
    description: 'Клиенты магазина',
    columns: ['customer_id', 'full_name', 'email', 'city', 'created_at'],
    pk: 'customer_id',
  },
  products: {
    label: 'products',
    description: 'Каталог товаров',
    columns: ['product_id', 'name', 'price', 'category', 'stock_qty'],
    pk: 'product_id',
  },
  orders: {
    label: 'orders',
    description: 'Заказы',
    columns: ['order_id', 'customer_id', 'order_date', 'status'],
    pk: 'order_id',
  },
  order_items: {
    label: 'order_items',
    description: 'Позиции заказа',
    columns: ['order_item_id', 'order_id', 'product_id', 'quantity', 'unit_price'],
    pk: 'order_item_id',
  },
  cities: {
    label: 'cities',
    description: 'Справочник городов (для JOIN с users)',
    columns: ['id', 'name', 'population', 'region'],
    pk: 'id',
  },
};

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

export function createShopDatabase() {
  const customers = [
    {
      customer_id: 1,
      full_name: 'Анна Иванова',
      email: 'anna@example.com',
      city: 'Москва',
      created_at: '2024-01-10',
    },
    {
      customer_id: 2,
      full_name: 'Борис Петров',
      email: 'boris@example.com',
      city: 'Санкт-Петербург',
      created_at: '2024-02-05',
    },
    {
      customer_id: 3,
      full_name: 'Елена Смирнова',
      email: 'elena@example.com',
      city: 'Москва',
      created_at: '2024-03-12',
    },
    {
      customer_id: 4,
      full_name: 'Дмитрий Козлов',
      email: null,
      city: 'Екатеринбург',
      created_at: '2024-04-01',
    },
  ];

  const products = [
    {product_id: 1, name: 'Алгоритмы', price: 799, category: 'Книги', stock_qty: 15},
    {product_id: 2, name: 'SQL для профессионалов', price: 1299, category: 'Книги', stock_qty: 0},
    {product_id: 3, name: 'USB-кабель', price: 299, category: 'Аксессуары', stock_qty: 42},
    {product_id: 4, name: 'Power bank', price: 1499, category: 'Аксессуары', stock_qty: 8},
    {product_id: 5, name: 'Блокнот', price: 99, category: 'Канцелярия', stock_qty: 120},
  ];

  const orders = [
    {order_id: 1, customer_id: 1, order_date: '2024-05-01', status: 'completed'},
    {order_id: 2, customer_id: 1, order_date: '2024-05-10', status: 'new'},
    {order_id: 3, customer_id: 2, order_date: '2024-05-12', status: 'processing'},
    {order_id: 4, customer_id: 3, order_date: '2024-05-15', status: 'completed'},
  ];

  const order_items = [
    {order_item_id: 1, order_id: 1, product_id: 1, quantity: 1, unit_price: 799},
    {order_item_id: 2, order_id: 1, product_id: 3, quantity: 2, unit_price: 299},
    {order_item_id: 3, order_id: 2, product_id: 2, quantity: 1, unit_price: 1299},
    {order_item_id: 4, order_id: 3, product_id: 4, quantity: 1, unit_price: 1499},
    {order_item_id: 5, order_id: 4, product_id: 5, quantity: 3, unit_price: 99},
  ];

  return {
    users: clone(JOIN_USERS),
    cities: clone(JOIN_CITIES),
    customers,
    products,
    orders,
    order_items,
    _seq: {
      users: 8,
      cities: 6,
      customers: 5,
      products: 6,
      orders: 5,
      order_items: 6,
    },
  };
}

export function getTableRows(db, tableName) {
  const key = tableName.toLowerCase();
  if (!db[key] || !Array.isArray(db[key])) {
    return null;
  }
  return db[key];
}

export function listTables(db) {
  return Object.keys(TABLE_META).filter((t) => Array.isArray(db[t]));
}
