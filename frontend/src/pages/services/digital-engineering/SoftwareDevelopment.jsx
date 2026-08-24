import React from 'react';
import UniversalServicePage from '../../../components/services/shared/UniversalServicePage';
import { servicesData } from '../../../data/servicesData';
import { departmentsData } from '../../../data/departmentsData';

const SoftwareDevelopment = () => {
  return (
    <UniversalServicePage 
      service={servicesData['software-development']} 
      department={departmentsData.foundry} 
    />
  );
};

export default SoftwareDevelopment;
