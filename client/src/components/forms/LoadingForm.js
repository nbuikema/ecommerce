import React from 'react';

import { Skeleton } from 'antd';

const LoadingForm = () => {
  return <Skeleton.Input className="w-100" active size="large" />;
};

export default LoadingForm;
