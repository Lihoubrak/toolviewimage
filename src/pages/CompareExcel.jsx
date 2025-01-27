import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import LayoutGlobal from '../layout/LayoutGlobal';

const CompareExcel = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [result, setResult] = useState([]);
  const [columns, setColumns] = useState([]); // To hold column names
  const [selectedColumn, setSelectedColumn] = useState(''); // To store selected column for comparison
  const [isCompared, setIsCompared] = useState(false); // Track if comparison is done

  // Handle file input changes
  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
    setResult([]); // Reset results when a new file is uploaded
    setIsCompared(false); // Reset comparison status
  };

  // Extract columns from the first Excel file
  const extractColumns = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData = e.target.result;
      const workbook = XLSX.read(fileData, { type: 'binary' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Assume we're working with the first sheet
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Get the headers as an array of rows
      const columnNames = data[0]; // Get the first row as the column names
      setColumns(columnNames); // Set column names for selection
    };
    reader.readAsBinaryString(file);
  };

  // Compare two Excel files based on the selected column
  const compareFiles = () => {
    if (!file1 || !file2) {
      alert('Please select both files.');
      return;
    }
    if (!selectedColumn) {
      alert('Please select a column to compare.');
      return;
    }

    // Read Excel files as binary string
    const reader1 = new FileReader();
    const reader2 = new FileReader();

    reader1.onload = (e1) => {
      const file1Data = e1.target.result;
      const workbook1 = XLSX.read(file1Data, { type: 'binary' });

      reader2.onload = (e2) => {
        const file2Data = e2.target.result;
        const workbook2 = XLSX.read(file2Data, { type: 'binary' });

        // Assuming both files have one sheet
        const sheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
        const sheet2 = workbook2.Sheets[workbook2.SheetNames[0]];

        // Convert sheets to JSON
        const data1 = XLSX.utils.sheet_to_json(sheet1);
        const data2 = XLSX.utils.sheet_to_json(sheet2);

        // Compare based on the selected column
        const file1Values = data1.map((row) => row[selectedColumn]);
        const file2Values = data2.map((row) => row[selectedColumn]);

        // Find non-matching rows
        const onlyInFile1 = data1.filter(
          (row) => !file2Values.includes(row[selectedColumn])
        );
        const onlyInFile2 = data2.filter(
          (row) => !file1Values.includes(row[selectedColumn])
        );

        // Combine the results
        setResult([...onlyInFile1, ...onlyInFile2]);
        setIsCompared(true); // Mark comparison as done
      };

      reader2.readAsBinaryString(file2);
    };

    reader1.readAsBinaryString(file1);
  };

  // Download the result as an Excel file
  const downloadResult = () => {
    const ws = XLSX.utils.json_to_sheet(result);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Results');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    // Create a Blob and download it
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'unique_rows.xlsx';
    link.click();
  };

  // Helper function to convert binary string to array buffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };

  return (
    <LayoutGlobal>
       <div className="flex items-center justify-center mb-8 gap-2">
        <h1 className="text-4xl font-extrabold text-center text-blue-600">
        Compare Excel Files
        </h1>
      </div>
      <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white shadow-lg rounded-lg">

        {/* File Input Section */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload File 1:
            </label>
            <input
              type="file"
              onChange={(e) => {
                handleFileChange(e, setFile1);
                extractColumns(e.target.files[0]);
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload File 2:
            </label>
            <input
              type="file"
              onChange={(e) => {
                handleFileChange(e, setFile2);
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Column Selection */}
        {columns.length > 0 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Column to Compare:
            </label>
            <select
              value={selectedColumn}
              onChange={(e) => {
                setSelectedColumn(e.target.value);
                setResult([]); // Reset results when a new column is selected
                setIsCompared(false); // Reset comparison status
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Column --</option>
              {columns.map((col, index) => (
                <option key={index} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Compare Button */}
        <button
          onClick={compareFiles}
          className="w-full py-2 mt-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Compare Files
        </button>

        {/* Download Button */}
        <button
          onClick={downloadResult}
          disabled={!isCompared} // Disable button if comparison is not done
          className={`w-full py-2 mt-4 ${
            isCompared
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gray-400 cursor-not-allowed'
          } text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
        >
          Download Results
        </button>
      </div>
    </LayoutGlobal>
  );
};

export default CompareExcel;