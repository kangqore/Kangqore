import React from 'react';
import UniversalServicePage from '../../../components/services/shared/UniversalServicePage';
import { servicesData } from '../../../data/servicesData';
import { departmentsData } from '../../../data/departmentsData';

const APIMicroservicesEngineering = () => {
  return (
    <UniversalServicePage 
      service={servicesData['api-microservices-engineering']} 
      department={departmentsData.foundry} 
    />
  );
};

export default APIMicroservicesEngineering;
