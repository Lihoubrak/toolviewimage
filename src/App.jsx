import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Table, Button, Select, Modal, message } from "antd";
import { FaFileExcel, FaUpload, FaEye } from "react-icons/fa";
import TopDrawer from "./components/TopDrawer";
import { getNamesAndValues } from "./utils/getNamesAndValues";
// Configure Modal
const { Option } = Select;

const App = () => {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
 const { names:Reson_BranchCol } = getNamesAndValues("Reson Branch", data);
 const { names:detailCol } = getNamesAndValues("DETAIL", data);
 const { names:Unit_CheckCol } = getNamesAndValues("Unit Check", data);
 const { names:Unit_OperationCol} = getNamesAndValues("Unit Operation", data);
 const { names:AccountCol} = getNamesAndValues("Account", data);
  // Handle unsaved data warning on page close
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
    processFile(selectedFile); // Process the file immediately after selection
  } else {
    alert("Please upload a valid Excel file.");
  }
};

// Process the uploaded file
const processFile = (file) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const binaryStr = event.target.result;
    const workbook = XLSX.read(binaryStr, { type: "binary" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    let rows = XLSX.utils.sheet_to_json(sheet);

    // Process the rows and extract Google Drive file IDs
    rows = rows.map((row) => {
      if (row["File Photo"]) {
        row["File Photo"] = row["File Photo"].split(",").map((url) => {
          // Match and extract file ID from various Google Drive URLs
          const fileIdMatch = url.match(
            /(?:drive|docs)\.google\.com\/(?:.*\/d\/|.*\/file\/d\/|.*\/drive\/folders\/|.*\/open\?id=)([^\/?&=]+)/) ||
            url.match(/googleusercontent\.com\/.*\/d\/([^\/?&=]+)/) ||
            url.match(/drive\.google\.com\/.*id=([^\/?&=]+)/);
          
          if (fileIdMatch && fileIdMatch[1]) {
            // Return only the file ID
            return fileIdMatch[1];
          }
          return url; 
        });
      }
      return row;
    });

    setData(rows); // Set the data state with the processed rows
  };
  reader.readAsBinaryString(file);
};


  const handleApproveChange = (index, column, value) => {
    const newData = [...data];
    newData[index][column] = value;
    setData(newData);
    message.success('Approval status updated successfully!');
  };

  const handleExportToExcel = () => {
    // Filter out the rows that have an approval status (Metfone or Partner)
    const updatedData = data.filter(
      (row) => row["Metfone Approve / Not approve"] || row["Partner approve / Not approve"]
    );
  
    // Ensure that the image links are correctly handled (you may need to format them properly if not already done)
    const formattedData = updatedData.map((row) => {
      if (row["File Photo"]) {
        // Ensure the image URL is included in the exported data (keep it in the correct format)
        row["File Photo"] = row["File Photo"].join(", "); // If there are multiple images, join them with a comma
      }
      return row;
    });
  
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Updated Data");
  
    // Export the data with the images (links)
    XLSX.writeFile(workbook, "updated_data.xlsx");
  };
  

  const handleViewImages = (images) => {
    setSelectedImages(images || []);
    setIsModalOpen(true);
  };
  

  const filteredData = data.filter((row) =>
    row["ID Task"]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    { title: "Site", dataIndex: "Site", key: "Site", width: 120 },
    { title: "Date Start", dataIndex: "Date Start", key: "Date Start", width: 120 },
    { title: "Date Finish", dataIndex: "Date Finish", key: "Date Finish", width: 120 },
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
          value={record["Partner approve / Not approve"]} // This ensures the value is correctly bound to the state
          onChange={(value) => handleApproveChange(index, "Partner approve / Not approve", value)} // Update the specific field
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
      key: "Metfone Approve/Not Approve",
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
      render: (text, record) => (
        <Button onClick={() => handleViewImages(record["File Photo"])} type="primary">
          View Images
        </Button>
      ),
    }
    
  ];

  const handleViewDetail = () => {
    setIsDrawerVisible(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
   <div className="flex  items-center justify-center mb-5 gap-2">
  <img
    src="/assets/images/imt4.png"
    alt="Logo"
    className="object-cover w-32 h-32" // Adjust the width and height as needed
  />
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
      console.log(imageUrl);
      
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
    <p className="text-center text-gray-500">No images available</p>
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
  );
};

export default App;
