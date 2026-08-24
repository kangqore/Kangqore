import React from 'react';
import UniversalServicePage from '../../../components/services/shared/UniversalServicePage';
import { servicesData } from '../../../data/servicesData';
import { departmentsData } from '../../../data/departmentsData';

const EmbeddedDesignSystems = () => {
  return (
    <UniversalServicePage 
      service={servicesData['embedded-design-systems']} 
      department={departmentsData.foundry} 
    />
  );
};

export default EmbeddedDesignSystems;
