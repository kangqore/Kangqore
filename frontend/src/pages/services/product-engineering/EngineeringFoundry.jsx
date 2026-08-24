import React from 'react';
import UniversalServicePage from '../../../components/services/shared/UniversalServicePage';
import { servicesData } from '../../../data/servicesData';
import { departmentsData } from '../../../data/departmentsData';

const EngineeringFoundry = () => {
  return (
    <UniversalServicePage 
      service={servicesData['engineering-foundry']} 
      department={departmentsData.foundry} 
    />
  );
};

export default EngineeringFoundry;
