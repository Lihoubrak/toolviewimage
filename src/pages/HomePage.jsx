import React, { useEffect, useMemo, useState } from 'react'
import TopDrawer from '../components/TopDrawer';
import * as XLSX from "xlsx";
import { FaEye, FaFileExcel, FaUpload } from 'react-icons/fa';
import { Button, Modal, Table, Select, message } from 'antd';
import { getNamesAndValues } from '../utils/getNamesAndValues';
import { processFile } from '../utils/excelUtils';
const { Option } = Select;
const HomePage = () => {
      const [data, setData] = useState([]);
      const [file, setFile] = useState(null);
      const [selectedImages, setSelectedImages] = useState([]);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [searchQuery, setSearchQuery] = useState("");
      const [isDrawerVisible, setIsDrawerVisible] = useState(false);
      const [originalData, setOriginalData] = useState([]);
     const { names:Reson_BranchCol } = getNamesAndValues("Reson Branch", data);
     const { names:detailCol } = getNamesAndValues("DETAIL", data);
     const { names:Unit_CheckCol } = getNamesAndValues("Unit Check", data);
     const { names:Unit_OperationCol} = getNamesAndValues("Unit Operation", data);
     const { names:AccountCol} = getNamesAndValues("Account", data);
     const { names:SiteCol} = getNamesAndValues("Site", data);
     
     useEffect(() => {
        const handleBeforeUnload = (e) => {
          if (data.length > 0) {
            e.preventDefault();
            e.returnValue =
              "Are you sure you want to leave? Unsaved data will be lost.";
          }
        };
    
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
      }, [data]);
 // Handle file change (triggered by the file input)
 const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setFile(selectedFile);
      processFile(selectedFile, (processedData) => {
        setData(processedData);
        setOriginalData(processedData);
      });
    } else {
      alert("Please upload a valid Excel file.");
    }
  };
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      row["ID Task"]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);
  const handleApproveChange = (index, column, value) => {
    const newData = [...data];
    const recordIndex = data.findIndex(
      (row) => row["ID Task"] === filteredData[index]["ID Task"]
    );
  
    if (recordIndex !== -1) {
      newData[recordIndex] = { ...newData[recordIndex], [column]: value };
      setData(newData); // Update the main data source
      message.success("Approval status updated successfully!");
    } else {
      message.error("Failed to update approval status.");
    }
  };
  const handleTableChange = (pagination, filters, sorter) => {
    // If no filters are applied, reset the data to the original data
    if (Object.keys(filters).every((columnKey) => !filters[columnKey]?.length)) {
      console.log("No filters applied, showing original data");
      setData(originalData); // Reset to the original data
      return;
    }
  };
  
  
  const handleExportToExcel = () => {
    const updatedData = data.filter(
      (row) => row["Metfone Approve /Not approve"] || row["Partner approve /Not approve"]
    );
  
    const formattedData = updatedData.map((row) => {
      if (row["File Photo"]) {
        if (Array.isArray(row["File Photo"])) {
          // Filter out invalid IDs from the array
          row["File Photo"] = row["File Photo"]
            .filter((imageId) => imageId && imageId !== "#N/A")
            .map((imageId) => `https://drive.google.com/file/d/${imageId}/view`)
            .join(", ");
        } else if (row["File Photo"] !== "#N/A" && row["File Photo"] !== "") {
          // Handle single valid ID
          row["File Photo"] = `https://drive.google.com/file/d/${row["File Photo"]}/view`;
        } else {
          // If invalid, set it as empty
          row["File Photo"] = "#N/A";
        }
      }
      return row;
    });
  
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Updated Data");
  
    XLSX.writeFile(workbook, "updated_data.xlsx");
  };
  
  
  
    const handleViewImages = (images) => {
      setSelectedImages(images || []);
      setIsModalOpen(true);
    };
    

  
    const handleViewDetail = () => {
      setIsDrawerVisible(true);
    };
  const columns = [
    { title: "No.", dataIndex: "Nº", key: "No.", width: 20 },
    { title: "ID Task", dataIndex: "ID Task", key: "ID Task", width: 100 },
    {
      title: "Account",
      dataIndex: "Account",
      key: "Account",
      width: 150,
      filters: AccountCol.map((item) => ({
        text: item,
        value: item,
      })),
      onFilter: (value, record) => {
        // Convert Account to string before calling includes
        return record["Account"]?.toString().includes(value);
      },
      filterSearch: true,
      sorter: (a, b) => {
        const accountA = parseFloat(a["Account"]);
        const accountB = parseFloat(b["Account"]);
        return accountA - accountB;
      },
    }
    
,    
    { title: "PRO", dataIndex: "PRO", key: "PRO", width: 100 },
    { title: "Site", dataIndex: "Site", key: "Site", width: 120,  sorter: (a, b) => a["Site"] < b["Site"] ? -1 : 1,
      filters: SiteCol.map((item) => ({
        text: item,  
        value: item, 
      })),
      onFilter: (value, record) => record["Site"]?.includes(value),filterSearch: true, },
    {
      title: "Date Start",
      dataIndex: "Date Start",
      key: "Date Start",
      width: 120,
      sorter: (a, b) => {
        const dateA = new Date(a["Date Start"]);
        const dateB = new Date(b["Date Start"]);
        return dateB - dateA; // Sorting by descending order (latest date first)
      },
      render: (text) => new Date(text).toLocaleDateString(), // Optional: format date for display
    },
  
    {
      title: "Date Finish",
      dataIndex: "Date Finish",
      key: "Date Finish",
      width: 120,
      sorter: (a, b) => {
        const dateA = new Date(a["Date Finish"]);
        const dateB = new Date(b["Date Finish"]);
        return dateB - dateA; // Sorting by descending order (latest date first)
      },
      render: (text) => new Date(text).toLocaleDateString(), // Optional: format date for display
    },
    { title: "Service Type", dataIndex: "Service Type", key: "Service Type", width: 120 },
    { title: "Duration", dataIndex: "Duration", key: "Duration", width: 100 },
    { title: "Complaint / Install", dataIndex: "Complaint / Install", key: "Complaint / Install", width: 150 },
    { title: "Reason Branch", dataIndex: "Reson Branch", key: "Reson Branch", width: 160 , 
      sorter: (a, b) => a["Reson Branch"] < b["Reson Branch"] ? -1 : 1,
      filters: Reson_BranchCol.map((item) => ({
        text: item,  
        value: item, 
      })),
      onFilter: (value, record) => record["Reson Branch"]?.includes(value),filterSearch: true,
    },
    {
      title: "DETAIL",
      dataIndex: "DETAIL",
      key: "DETAIL",
      width: 200,
      sorter: (a, b) => a["DETAIL"] < b["DETAIL"] ? -1 : 1,
      filters: detailCol.map((item) => ({
        text: item,  
        value: item, 
      })),
      onFilter: (value, record) => record["DETAIL"]?.includes(value), filterSearch: true,

    },
    {
      title: "Unit Check",
      dataIndex: "Unit Check",
      key: "Unit Check",
      width: 150,
      sorter: (a, b) => a["Unit Check"] < b["Unit Check"] ? -1 : 1,
      filters: Unit_CheckCol.map((item) => ({
        text: item,  
        value: item, 
      })),
      onFilter: (value, record) => record["Unit Check"]?.includes(value),filterSearch: true,

    },
    {
      title: "Unit Operation",
      dataIndex: "Unit Operation",
      key: "Unit Operation",
      width: 160,
      sorter: (a, b) => a["Unit Operation"] < b["Unit Operation"] ? -1 : 1,
      filters: Unit_OperationCol.map((item) => ({
        text: item,  
        value: item, 
      })),
      onFilter: (value, record) => record["Unit Operation"]?.includes(value),filterSearch: true,

    },
    {
      title: "Partner approve / Not approve",
      dataIndex: "Partner approve / Not approve",
      key: "Partner approve / Not approve",
      width: 180,
      render: (text, record, index) => (
        <Select
          value={record["Partner approve / Not approve"]} 
          onChange={(value) => handleApproveChange(index, "Partner approve / Not approve", value)} 
          style={{ width: 120 }}
        >
          <Option value="Approve">Approve</Option>
          <Option value="Not Approve">Not Approve</Option>
        </Select>
      ),
    },
    {
      
      title: "Metfone Approve/Not Approve",
      dataIndex: "Metfone Approve / Not approve",
      key: "Metfone Approve / Not Approve",
      width: 180,
      render: (text, record, index) => (
        <Select
          value={record["Metfone Approve / Not approve"]} // Correct binding here as well
          onChange={(value) => handleApproveChange(index, "Metfone Approve / Not approve", value)}
          style={{ width: 120 }}
        >
          <Option value="Approve">Approve</Option>
          <Option value="Not Approve">Not Approve</Option>
        </Select>
      ),
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
<div className="min-h-screen bg-gray-100 p-6">
   <div className="flex  items-center justify-center mb-5 gap-2">
  <h1 className="text-3xl font-bold text-center mt-8 text-blue-600">
    TOOL VIEW IMAGE
  </h1>
</div>

      <div className="flex gap-2">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by ID Task"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded shadow-sm"
          />
        </div>

        <div className="flex flex-col items-center mb-6">
          <button
            onClick={handleViewDetail}
            className="px-4 py-2 flex justify-center items-center rounded text-white font-semibold bg-green-500 hover:bg-green-600"
          >
            <FaEye className="mr-2" />
            <p>Reason Branch</p>
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <button
            onClick={handleExportToExcel}
            className="px-4 py-2 flex justify-center items-center rounded text-white font-semibold bg-red-500 hover:bg-red-600"
          >
            <FaFileExcel className="mr-2" />
            <p>Export to Excel</p>
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <button
            onClick={() => document.getElementById('file-upload').click()}
            className="px-4 py-2 rounded flex justify-center items-center text-white font-semibold bg-blue-500 hover:bg-blue-600"
          >
            <FaUpload className="mr-2" /> Upload Excel
          </button>
        </div>
      </div>

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

      {/* Drawer to display Reason Branch details */}
      <TopDrawer
        title="Reason Branch Detail"
        placement="right"
        onClose={() => setIsDrawerVisible(false)}
        visible={isDrawerVisible}
        width={400}
        data={data}
      />
    </div>
  )
}

export default HomePage