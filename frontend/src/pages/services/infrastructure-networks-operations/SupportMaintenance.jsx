import React from 'react';
import UniversalServicePage from '../../../components/services/shared/UniversalServicePage';
import { servicesData } from '../../../data/servicesData';
import { departmentsData } from '../../../data/departmentsData';

const SupportMaintenance = () => {
  return (
    <UniversalServicePage 
      service={servicesData['support-maintenance']} 
      department={departmentsData.foundry} 
    />
  );
};

export default SupportMaintenance;
