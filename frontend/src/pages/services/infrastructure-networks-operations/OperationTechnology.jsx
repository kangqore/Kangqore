import React from 'react';
import UniversalServicePage from '../../../components/services/shared/UniversalServicePage';
import { servicesData } from '../../../data/servicesData';
import { departmentsData } from '../../../data/departmentsData';

const OperationTechnology = () => {
  return (
    <UniversalServicePage 
      service={servicesData['operation-technology']} 
      department={departmentsData.foundry} 
    />
  );
};

export default OperationTechnology;
