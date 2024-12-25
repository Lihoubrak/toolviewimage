import React from "react";

const FileUploadComponent = ({ file, onFileChange, onFileUpload }) => (
  <div className="flex flex-col items-center mb-6">
    <input
      type="file"
      accept=".xlsx,.xls"
      onChange={onFileChange}
      className="mb-4 p-2 border border-gray-300 rounded shadow-sm"
    />
    <button
      onClick={onFileUpload}
      disabled={!file}
      className={`px-4 py-2 rounded text-white font-semibold ${
        file
          ? "bg-blue-500 hover:bg-blue-600"
          : "bg-gray-400 cursor-not-allowed"
      }`}
    >
      Upload Excel
    </button>
  </div>
);

export default FileUploadComponent;
