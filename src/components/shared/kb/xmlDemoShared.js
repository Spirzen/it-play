/** Утилиты для демо XSD / XSLT (упрощённая проверка и преобразование в браузере). */

export const CATALOG_XSD = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="catalog">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="book" maxOccurs="unbounded">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="title" type="xs:string"/>
              <xs:element name="author" type="xs:string"/>
            </xs:sequence>
            <xs:attribute name="id" type="xs:string" use="required"/>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>`;

export const CATALOG_XML_VALID = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="101">
    <title>Основы XML</title>
    <author>Иван Петров</author>
  </book>
  <book id="102">
    <title>Современные форматы данных</title>
    <author>Анна Смирнова</author>
  </book>
</catalog>`;

export const CATALOG_XML_NO_ID = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book>
    <title>Основы XML</title>
    <author>Иван Петров</author>
  </book>
</catalog>`;

export const CATALOG_XML_WRONG_ROOT = `<?xml version="1.0" encoding="UTF-8"?>
<library>
  <book id="1">
    <title>Война и мир</title>
    <author>Лев Толстой</author>
  </book>
</library>`;

export const CATALOG_XML_MALFORMED = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="101">
    <title>Основы XML</title>
    <author>Иван Петров
  </book>
</catalog>`;

export const LIBRARY_XML = `<?xml version="1.0" encoding="UTF-8"?>
<library>
  <book id="1">
    <title>Война и мир</title>
    <author>Лев Толстой</author>
  </book>
  <book id="2">
    <title>Мастер и Маргарита</title>
    <author>Михаил Булгаков</author>
  </book>
</library>`;

export const LIBRARY_XSLT = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:template match="/">
    <html>
      <body>
        <h1>Список книг</h1>
        <ul>
          <xsl:for-each select="library/book">
            <li>
              <xsl:value-of select="title"/> (<xsl:value-of select="author"/>)
            </li>
          </xsl:for-each>
        </ul>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;

export function parseXml(xmlString) {
  if (typeof DOMParser === 'undefined') {
    return {doc: null, error: null};
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    const text = parseError.textContent?.trim() || 'Некорректный XML';
    return {doc: null, error: text.replace(/\s+/g, ' ')};
  }
  return {doc, error: null};
}

/**
 * Упрощённая валидация по схеме catalog (как в статье).
 * В реальных системах используется XSD-процессор (libxml, Saxon и т.д.).
 */
export function validateCatalogXsd(doc) {
  if (!doc) {
    return {valid: false, issues: []};
  }
  const issues = [];
  const root = doc.documentElement;

  if (!root) {
    issues.push({rule: 'well-formed', ok: false, message: 'Документ пуст или не содержит корневого элемента.'});
    return {valid: false, issues};
  }

  const rootOk = root.localName === 'catalog';
  issues.push({
    rule: 'xs:element name="catalog"',
    ok: rootOk,
    message: rootOk
      ? 'Корневой элемент — catalog.'
      : `Ожидался <catalog>, получен <${root.localName}>.`,
  });

  const books = [...root.children].filter((n) => n.nodeType === Node.ELEMENT_NODE);
  const nonBook = books.find((el) => el.localName !== 'book');
  if (nonBook) {
    issues.push({
      rule: 'xs:element name="book"',
      ok: false,
      message: `Недопустимый дочерний элемент <${nonBook.localName}> внутри catalog.`,
    });
  } else if (books.length === 0) {
    issues.push({
      rule: 'xs:element name="book"',
      ok: false,
      message: 'В catalog должен быть хотя бы один элемент book.',
    });
  } else {
    issues.push({
      rule: 'xs:element name="book"',
      ok: true,
      message: `Найдено записей book: ${books.length}.`,
    });
  }

  books.forEach((book, index) => {
    const label = `book[${index + 1}]`;
    const id = book.getAttribute('id');
    const idOk = id != null && id.trim() !== '';
    issues.push({
      rule: 'xs:attribute name="id" use="required"',
      ok: idOk,
      message: idOk ? `${label}: атрибут id="${id}".` : `${label}: отсутствует обязательный атрибут id.`,
    });

    const children = [...book.children].filter((n) => n.nodeType === Node.ELEMENT_NODE);
    const title = children.find((el) => el.localName === 'title');
    const author = children.find((el) => el.localName === 'author');
    const extra = children.find((el) => el.localName !== 'title' && el.localName !== 'author');

    issues.push({
      rule: 'xs:element name="title"',
      ok: Boolean(title),
      message: title
        ? `${label}: элемент <title> присутствует.`
        : `${label}: отсутствует обязательный элемент <title>.`,
    });
    issues.push({
      rule: 'xs:element name="author"',
      ok: Boolean(author),
      message: author
        ? `${label}: элемент <author> присутствует.`
        : `${label}: отсутствует обязательный элемент <author>.`,
    });
    if (extra) {
      issues.push({
        rule: 'xs:sequence',
        ok: false,
        message: `${label}: недопустимый элемент <${extra.localName}> — схема допускает только title и author.`,
      });
    }
  });

  const valid = issues.every((i) => i.ok);
  return {valid, issues};
}

/** Преобразование library → HTML по шаблону из статьи (аналог XSLT 1.0). */
export function transformLibraryToHtml(doc) {
  const root = doc.documentElement;
  if (!root || root.localName !== 'library') {
    throw new Error('Ожидается корневой элемент <library>.');
  }

  const books = [...root.querySelectorAll(':scope > book')];
  const items = books
    .map((book) => {
      const title = book.querySelector(':scope > title')?.textContent?.trim() ?? '';
      const author = book.querySelector(':scope > author')?.textContent?.trim() ?? '';
      return `<li>${escapeHtml(title)} (${escapeHtml(author)})</li>`;
    })
    .join('\n      ');

  return `<html>
  <body>
    <h1>Список книг</h1>
    <ul>
      ${items}
    </ul>
  </body>
</html>`;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const XPATH_PRESETS = [
  {
    id: 'all-books',
    label: 'Все книги',
    query: '/library/book',
    hint: 'Прямые потомки library — элементы book.',
  },
  {
    id: 'first-title',
    label: 'Заголовок 1-й книги',
    query: '/library/book[1]/title',
    hint: 'Первый book в документе, затем дочерний title.',
  },
  {
    id: 'book-by-id',
    label: 'Книга id=2',
    query: "/library/book[@id='2']",
    hint: 'Фильтр по атрибуту id.',
  },
  {
    id: 'all-authors',
    label: 'Все авторы',
    query: '//author',
    hint: 'author на любом уровне вложенности.',
  },
  {
    id: 'tolstoy',
    label: 'Толстой',
    query: "//book[author = 'Лев Толстой']/title",
    hint: 'Предикат по тексту дочернего author.',
  },
];

/** Выполнение XPath 1.0 через DOM API (поддерживается в современных браузерах). */
export function evaluateXPath(doc, expression) {
  if (!doc?.documentElement) {
    return {nodes: [], error: 'Документ пуст или не разобран.'};
  }
  try {
    const snapshot = doc.evaluate(
      expression,
      doc,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null,
    );
    const nodes = [];
    for (let i = 0; i < snapshot.snapshotLength; i += 1) {
      nodes.push(snapshot.snapshotItem(i));
    }
    return {nodes, error: null};
  } catch (err) {
    return {nodes: [], error: err.message || 'Некорректное XPath-выражение.'};
  }
}

export function formatXPathNode(node) {
  if (!node) {
    return '';
  }
  if (node.nodeType === Node.ATTRIBUTE_NODE) {
    return `@${node.name}="${node.value}"`;
  }
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent?.trim() ?? '';
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const attrs = [...node.attributes]
      .map((a) => `@${a.name}="${a.value}"`)
      .join(' ');
    const attrPart = attrs ? ` ${attrs}` : '';
    const text = [...node.childNodes]
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent?.trim())
      .filter(Boolean)
      .join(' ');
    if (text && node.children.length === 0) {
      return `<${node.localName}${attrPart}>${text}</${node.localName}>`;
    }
    return `<${node.localName}${attrPart}>`;
  }
  return node.nodeName ?? String(node);
}
