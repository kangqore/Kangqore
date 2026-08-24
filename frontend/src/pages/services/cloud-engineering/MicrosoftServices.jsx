import React from 'react';
import UniversalServicePage from '../../../components/services/shared/UniversalServicePage';
import { servicesData } from '../../../data/servicesData';
import { departmentsData } from '../../../data/departmentsData';

const MicrosoftServices = () => {
  return (
    <UniversalServicePage 
      service={servicesData['microsoft-services']} 
      department={departmentsData.foundry} 
    />
  );
};

export default MicrosoftServices;
