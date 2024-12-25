import React from "react";
import DataTable from "react-data-table-component";

const DataTableComponent = ({
  data,
  columns,
  searchQuery,
  onSearchChange,
  onExportToExcel,
}) => (
  <div>
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search by ID Task"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded shadow-sm"
      />
    </div>
    <div className="my-4 flex justify-end">
      <button
        onClick={onExportToExcel}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Export to Excel
      </button>
    </div>
    <DataTable
      title="Excel Data"
      columns={columns}
      data={data}
      pagination
      highlightOnHover
      responsive
    />
  </div>
);

export default DataTableComponent;
