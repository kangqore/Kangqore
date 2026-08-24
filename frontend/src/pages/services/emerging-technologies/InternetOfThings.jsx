import React from 'react';
import UniversalServicePage from '../../../components/services/shared/UniversalServicePage';
import { servicesData } from '../../../data/servicesData';
import { departmentsData } from '../../../data/departmentsData';

const InternetOfThings = () => {
  return (
    <UniversalServicePage 
      service={servicesData['internet-of-things']} 
      department={departmentsData.foundry} 
    />
  );
};

export default InternetOfThings;
