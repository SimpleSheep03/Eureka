import React from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

const BeatLoaderComponent = () => {

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <BeatLoader color="#ffffff" loading={true} size={30} />
    </div>
  );
};

export default BeatLoaderComponent;
