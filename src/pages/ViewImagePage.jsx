import React from 'react';
import LayoutGlobal from '../layout/LayoutGlobal';
import ViewImageImt from '../components/ViewImageImt';

const ViewImagePage = () => {
  return (
    <LayoutGlobal>
      {/* Tiêu đề trang */}
      <div className="flex items-center justify-center mb-8 gap-2">
        <h1 className="text-4xl font-extrabold text-center text-blue-600">
          View Image Page
        </h1>
      </div>

      {/* Nội dung của trang View Image */}
      <div className=" mx-auto">
        <div className="bg-white shadow-lg p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Image Viewer</h2>
          <p className="text-gray-600 mb-6">View your images here, explore and analyze them.</p>

          {/* Component ViewImageImt - Chỗ để hiển thị hình ảnh */}
          <ViewImageImt />
        </div>
      </div>
    </LayoutGlobal>
  );
};

export default ViewImagePage;
