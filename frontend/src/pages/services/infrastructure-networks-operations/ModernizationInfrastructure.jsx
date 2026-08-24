import React from 'react';
import UniversalServicePage from '../../../components/services/shared/UniversalServicePage';
import { servicesData } from '../../../data/servicesData';
import { departmentsData } from '../../../data/departmentsData';

const ModernizationInfrastructure = () => {
  return (
    <UniversalServicePage 
      service={servicesData['modernization-infrastructure']} 
      department={departmentsData.foundry} 
    />
  );
};

export default ModernizationInfrastructure;
