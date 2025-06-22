import React from "react";
import { ClimbingBoxLoader } from "react-spinners";

const SuspenseLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <ClimbingBoxLoader />
    </div>
  );
};

export default SuspenseLoader;
