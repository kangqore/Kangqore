import React from 'react';
import { Helmet } from 'react-helmet';

function safeSerialize(schema) {
  try {
    return JSON.stringify(schema);
  } catch {
    return JSON.stringify(schema, (_key, value) => {
      if (value && typeof value === 'object') {
        if (value.$$typeof || value._owner || value.Provider) return undefined;
      }
      return value;
    });
  }
}

const SchemaInjector = ({ schemas = [] }) => {
  const list = (Array.isArray(schemas) ? schemas : [schemas]).filter(Boolean);
  if (list.length === 0) return null;
  return (
    <Helmet>
      {list.map((schema, idx) => (
        <script type="application/ld+json" key={`kangqore-vis-schema-${idx}`}>
          {safeSerialize(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SchemaInjector;
