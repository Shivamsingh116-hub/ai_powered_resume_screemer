import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <p className="text-gray-600 mt-2">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
