import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OntologyStudio from './OntologyStudio';
import ObjectDesigner from './ObjectDesigner';

export const OntologyStudioModule: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<OntologyStudio />} />
      <Route path="/:name" element={<ObjectDesigner />} />
    </Routes>
  );
};

export default OntologyStudioModule;
