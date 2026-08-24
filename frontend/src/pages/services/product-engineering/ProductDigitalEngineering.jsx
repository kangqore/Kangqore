import React from 'react';
import UniversalServicePage from '../../../components/services/shared/UniversalServicePage';
import { servicesData } from '../../../data/servicesData';
import { departmentsData } from '../../../data/departmentsData';

const ProductDigitalEngineering = () => {
  return (
    <UniversalServicePage 
      service={servicesData['product-digital-engineering']} 
      department={departmentsData.foundry} 
    />
  );
};

export default ProductDigitalEngineering;
