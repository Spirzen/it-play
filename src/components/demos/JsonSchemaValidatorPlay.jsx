import React, {useMemo, useState} from 'react';
import {PlayRoot, toolStyles} from '@/components/shared/dataMarkupPlayKit';

const SCHEMA = `{
  "type": "object",
  "required": ["email", "age"],
  "properties": {
    "email": { "type": "string", "format": "email" },
    "age": { "type": "integer", "minimum": 0 }
  }
}`;

function validate(data) {
  const errors = [];
  if (typeof data.email !== 'string' || !data.email.includes('@')) errors.push('/email: invalid email');
  if (typeof data.age !== 'number' || !Number.isInteger(data.age)) errors.push('/age: must be integer');
  else if (data.age < 0) errors.push('/age: minimum 0');
  if (data.email == null) errors.push('/email: required');
  if (data.age == null) errors.push('/age: required');
  return errors;
}

export default function JsonSchemaValidatorPlay() {
  const [doc, setDoc] = useState('{\n  "email": "user@",\n  "age": -1\n}');
  const result = useMemo(() => {
    try {
      const data = JSON.parse(doc);
      const errors = validate(data);
      return {ok: errors.length === 0, errors};
    } catch (e) {
      return {ok: false, errors: [e.message]};
    }
  }, [doc]);

  return (
    <PlayRoot title="JSON Schema" subtitle="Упрощённая валидация required + типы">
      <label className="it-demo__label">Schema</label>
      <pre className="it-demo__output">{SCHEMA}</pre>
      <label className="it-demo__label">Document</label>
      <textarea className={toolStyles.textareaMono} rows={6} value={doc} onChange={(e) => setDoc(e.target.value)} spellCheck={false} />
      <p className={result.ok ? 'it-demo__hint' : undefined} style={result.ok ? {color: '#2ecc71'} : {color: '#e5534b'}}>
        {result.ok ? 'Valid ✓' : result.errors.join('; ')}
      </p>
    </PlayRoot>
  );
}
