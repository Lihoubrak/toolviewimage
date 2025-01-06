import React, { useEffect, useMemo, useState } from 'react';
import { Button, Modal, Table, Select, message } from 'antd';
import { FaEye, FaFileExcel, FaUpload } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import TopDrawer from '../components/TopDrawer';
import { getNamesAndValues } from '../utils/getNamesAndValues';
import { processFile } from '../utils/excelUtils';

const { Option } = Select;

const ViewImageImt = () => {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [originalData, setOriginalData] = useState([]);
console.log("selectedImages",selectedImages);

  // Extract column names
  const { names: ResonBranchCol } = getNamesAndValues('Reson Branch', data);
  const { names: DetailCol } = getNamesAndValues('DETAIL', data);
  const { names: UnitCheckCol } = getNamesAndValues('Unit Check', data);
  const { names: UnitOperationCol } = getNamesAndValues('Unit Operation', data);
  const { names: AccountCol } = getNamesAndValues('Account', data);
  const { names: SiteCol } = getNamesAndValues('Site', data);

  // Handle window close or reload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (data.length > 0) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Unsaved data will be lost.';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [data]);

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(selectedFile);
      processFile(selectedFile, (processedData) => {
        setData(processedData);
        setOriginalData(processedData);
      });
    } else {
      alert('Please upload a valid Excel file.');
    }
  };

  // Filter data based on search query
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      row['ID Task']?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  // Handle approval status change
  const handleApproveChange = (index, column, value) => {
    // Validate 'filteredData' and 'index'
    if (!filteredData || !Array.isArray(filteredData) || index < 0 || index >= filteredData.length) {
      message.error('Invalid filtered data or index.');
      return;
    }
  
    // Get the target task ID
    const targetTaskId = filteredData[index-1]['ID Task'];
  
    // Find the record index in the main 'data' array
    const recordIndex = data.findIndex((row) => row['ID Task'] === targetTaskId);
  
    if (recordIndex === -1) {
      // If the record is not found
      message.error(`Task ID ${targetTaskId} not found in the main data.`);
      return;
    }

  
    // Update the specific column in the main 'data' array
    const updatedData = [...data];
    updatedData[recordIndex] = {
      ...updatedData[recordIndex],
      [column]: value,
    };
    // Update state
    setData(updatedData);
    // Display success message
    message.success('Approval status updated successfully!');
  };
  
  // Handle table change (pagination, sorting, etc.)
  const handleTableChange = (pagination, filters, sorter) => {
    if (Object.keys(filters).every((columnKey) => !filters[columnKey]?.length)) {
      setData(originalData);
      return;
    }
  };

// Export data to Excel
const handleExportToExcel = () => {
  const updatedData = data.filter(
    (row) => row['Metfone Approve / Not approve'] || row['Partner approve / Not approve']
  );
  if (!updatedData.length) {
    message.warning('No data to export.');
    return;
  }

  const formattedData = updatedData.map((row) => {
    if (row['File Photo']) {
      if (Array.isArray(row['File Photo'])) {
        row['File Photo'] = row['File Photo']
          .filter((imageId) => imageId && imageId !== '#N/A')
          .map((imageId) => `https://drive.google.com/file/d/${imageId}/view`)
          .join(', ');
      } else if (row['File Photo'] !== '#N/A' && row['File Photo'] !== '') {
        row['File Photo'] = `https://drive.google.com/file/d/${row['File Photo']}/view`;
      } else {
        row['File Photo'] = '#N/A';
      }
    }
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Updated Data');
  XLSX.writeFile(workbook, 'updated_data.xlsx');
  message.success('Exported to Excel successfully!');
};



  // Handle image viewing
  const handleViewImages = (images) => {
    setSelectedImages(images || []);
    setIsModalOpen(true);
  };

  // Handle Reason Branch detail view
  const handleViewDetail = () => {
    setIsDrawerVisible(true);
  };

  // Table columns definition
  const columns = [
    { title: 'No.', dataIndex: 'Nº', key: 'No.', width: 20 },
    { title: 'ID Task', dataIndex: 'ID Task', key: 'ID Task', width: 100 },
    {
      title: 'Account',
      dataIndex: 'Account',
      key: 'Account',
      width: 150,
      filters: AccountCol.map((item) => ({ text: item, value: item })),
      onFilter: (value, record) => record['Account']?.toString().includes(value),
      filterSearch: true,
      sorter: (a, b) => a['Account'] - b['Account'],
    },
    { title: 'PRO', dataIndex: 'PRO', key: 'PRO', width: 100 },
    {
      title: 'Site',
      dataIndex: 'Site',
      key: 'Site',
      width: 120,
      sorter: (a, b) => (a['Site'] < b['Site'] ? -1 : 1),
      filters: SiteCol.map((item) => ({ text: item, value: item })),
      onFilter: (value, record) => record['Site']?.includes(value),
      filterSearch: true,
    },
    {
      title: 'Date Start',
      dataIndex: 'Date Start',
      key: 'Date Start',
      width: 120,
      sorter: (a, b) => new Date(b['Date Start']) - new Date(a['Date Start']),
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Date Finish',
      dataIndex: 'Date Finish',
      key: 'Date Finish',
      width: 120,
      sorter: (a, b) => new Date(b['Date Finish']) - new Date(a['Date Finish']),
      render: (text) => new Date(text).toLocaleDateString(),
    },
    { title: 'Service Type', dataIndex: 'Service Type', key: 'Service Type', width: 120 },
    { title: 'Duration', dataIndex: 'Duration', key: 'Duration', width: 100 },
    { title: 'Complaint / Install', dataIndex: 'Complaint / Install', key: 'Complaint / Install', width: 150 },
    {
      title: 'Reason Branch',
      dataIndex: 'Reson Branch',
      key: 'Reson Branch',
      width: 160,
      sorter: (a, b) => (a['Reson Branch'] < b['Reson Branch'] ? -1 : 1),
      filters: ResonBranchCol.map((item) => ({ text: item, value: item })),
      onFilter: (value, record) => record['Reson Branch']?.includes(value),
      filterSearch: true,
    },
    {
      title: 'DETAIL',
      dataIndex: 'DETAIL',
      key: 'DETAIL',
      width: 200,
      sorter: (a, b) => (a['DETAIL'] < b['DETAIL'] ? -1 : 1),
      filters: DetailCol.map((item) => ({ text: item, value: item })),
      onFilter: (value, record) => record['DETAIL']?.includes(value),
      filterSearch: true,
    },
    {
      title: 'Unit Check',
      dataIndex: 'Unit Check',
      key: 'Unit Check',
      width: 150,
      sorter: (a, b) => (a['Unit Check'] < b['Unit Check'] ? -1 : 1),
      filters: UnitCheckCol.map((item) => ({ text: item, value: item })),
      onFilter: (value, record) => record['Unit Check']?.includes(value),
      filterSearch: true,
    },
    {
      title: 'Unit Operation',
      dataIndex: 'Unit Operation',
      key: 'Unit Operation',
      width: 160,
      sorter: (a, b) => (a['Unit Operation'] < b['Unit Operation'] ? -1 : 1),
      filters: UnitOperationCol.map((item) => ({ text: item, value: item })),
      onFilter: (value, record) => record['Unit Operation']?.includes(value),
      filterSearch: true,
    },
    {
      title: 'Partner Approve',
      dataIndex: 'Partner approve / Not approve',
      key: 'Partner approve / Not approve',
      render: (value, record) => (
        <Select
          defaultValue={value}
          onChange={(val) => handleApproveChange(record['Nº'], 'Partner approve / Not approve', val)}
        >
          <Option value="approve">Approve</Option>
          <Option value="not_approve">Not Approve</Option>
        </Select>
      ),
    },
    {
      title: 'Metfone Approve',
      dataIndex: 'Metfone Approve / Not approve',
      key: 'Metfone Approve / Not approve',
      render: (value, record) => {
        return (
          <Select
            defaultValue={value}
            onChange={(val) => handleApproveChange(record['Nº'], 'Metfone Approve / Not approve', val)} // Use the correct index here
          >
            <Option value="approve">Approve</Option>
            <Option value="not_approve">Not Approve</Option>
          </Select>
        );
      },
    },
    
   
    {
      title: "File Photo",
      key: "File Photo",
      width: 120,
      render: (text, record) => {
        const hasImage = record["File Photo"] && record["File Photo"].some((url) => url && url !== "#N/A");
        return (
          <Button
            onClick={() => handleViewImages(record["File Photo"])}
            type={hasImage ? "primary" : "default"}  // Change button type based on condition
            style={{
              backgroundColor: hasImage ? "#4CAF50" : "#f44336", // Green if has image, Red if not
              color: "#fff", // White text color
              borderRadius: "5px", // Rounded corners
              padding: "5px 10px", // Button padding
            }}
          >
            {hasImage ? "View Images" : "No Images"}
          </Button>
        );
      },
      filters: [
        { text: 'Has Image', value: 'hasImage' },
        { text: 'No Image', value: 'noImage' },
      ],
      onFilter: (value, record) => {
        const hasImage = record["File Photo"] && record["File Photo"].some((url) => url && url !== "#N/A");
        if (value === 'hasImage') {
          return hasImage; 
        } else if (value === 'noImage') {
          return !hasImage; 
        }
        return false;
      },
    },
  ];

  return (
    <div >
     <div className='flex gap-3'>
      <div>
      <input
        id="file-upload"
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        onClick={() => document.getElementById('file-upload').click()}
        className="px-4 py-2 flex justify-center items-center rounded text-white font-semibold bg-blue-500 hover:bg-blue-600"
      >
        <FaUpload className="mr-2" />
        <p>Upload Excel</p>
      </Button>
      </div>
      <div>
      <Button
        onClick={handleExportToExcel}
        className="px-4 py-2 flex justify-center items-center rounded text-white font-semibold bg-green-500 hover:bg-green-600"
      >
        <FaFileExcel className="mr-2" />
        <p>Export to Excel</p>
      </Button>

    
      </div>
      <div>
      </div>
     </div>

     <input
        type="text"
        placeholder="Search by Task ID"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="my-4 p-2 border border-gray-300 rounded"
      />

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination
        rowKey={(record) => record["ID Task"]}
        scroll={{ x: "max-content" }}
        onChange={handleTableChange}
      />

      {/* Ant Design Modal */}
      <Modal
  open={isModalOpen}
  onCancel={() => setIsModalOpen(false)}
  footer={null}
  width="80%"
  key={selectedImages.join(",")} 
>

     <div className="flex flex-wrap p-4">
  {selectedImages.length > 0 ? (
    selectedImages.map((fileId, idx) => {
      // Generate the full Google Drive URL to view the file
      const imageUrl = (fileId && fileId !== '#N/A' && fileId !== "") ? `https://drive.google.com/file/d/${fileId}/view` : null;
   
      return (
        <div key={idx} className="w-1/3 p-2">
          {imageUrl ? (
            <img
              src={`https://drive.google.com/thumbnail?id=${fileId}`}
              alt={`Image ${idx + 1} - Image loading late , please click to open full size`}
              loading="lazy"
              onClick={() => window.open(imageUrl, "_blank")}
              className="cursor-pointer border border-gray-300 rounded w-full h-auto object-contain"
            />
          ) : (
            <p className="text-center text-red-500 text-xl">No image available</p>
          )}
        </div>
      );
    })
  ) : (
    <p className="text-center text-red-500 text-xl">No images available</p>
  )}
</div>
      </Modal>
    </div>
  );
};

export default ViewImageImt;
