import React from 'react';
import { useEntity } from '../hooks/useEntity';

const EntityBadge = ({ slug }) => {
  const { entity, loading } = useEntity(slug);
  if (loading || !entity) return null;
  return (
    <div className="text-xs text-gray-500" data-kangqore-vis-entity={slug}>
      <span className="font-medium text-gray-700 dark:text-gray-300">{entity.name}</span>
      {entity.category ? <span className="ml-2">· {entity.category}</span> : null}
    </div>
  );
};

export default EntityBadge;
