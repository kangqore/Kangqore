import React from 'react';
import UniversalServicePage from '../../../components/services/shared/UniversalServicePage';
import { servicesData } from '../../../data/servicesData';
import { departmentsData } from '../../../data/departmentsData';

const EngineeringRDServices = () => {
  return (
    <UniversalServicePage 
      service={servicesData['engineering-rd-services']} 
      department={departmentsData.foundry} 
    />
  );
};

export default EngineeringRDServices;
