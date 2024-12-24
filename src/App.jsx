import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import DataTable from "react-data-table-component";

// Configure Modal
Modal.setAppElement("#root");

const App = () => {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid Excel file.");
    }
  };

  const handleFileUpload = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      let rows = XLSX.utils.sheet_to_json(sheet);

      rows = rows.map((row) => {
        if (row["File Photo"]) {
          row["File Photo"] = row["File Photo"].split(",").map((url) => {
            const fileId = url.split("id=")[1];
            return fileId
              ? `https://drive.google.com/open?id=${fileId}`
              : "https://via.placeholder.com/150";
          });
        }
        return row;
      });

      setData(rows);
    };

    reader.readAsBinaryString(file);
  };
  const handleApproveChange = (rowIndex, field, value) => {
    const updatedData = [...data];
    updatedData[rowIndex][field] = value;
    setData(updatedData);
  };

  const handleExportToExcel = () => {
    // Filter the data to include only rows where 'Metfone Approve/Not Approve' has been updated
    const updatedData = data.filter(
      (row) => row["Metfone Approve/Not Approve"]
    );

    // Create a new worksheet with the filtered data
    const worksheet = XLSX.utils.json_to_sheet(updatedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Updated Data");

    // Export the filtered data to an Excel file
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
    { name: "No.", selector: (row) => row["Nº"], sortable: true, wrap: true },
    {
      name: "ID Task",
      selector: (row) => row["ID Task"],
      sortable: true,
      wrap: true,
    },
    {
      name: "Account",
      selector: (row) => row["Account"],
      sortable: true,
      wrap: true,
    },
    { name: "PRO", selector: (row) => row["PRO"], sortable: true, wrap: true },
    {
      name: "Site",
      selector: (row) => row["Site"],
      sortable: true,
      wrap: true,
    },
    {
      name: "Date Start",
      selector: (row) => row["Date Start"],
      sortable: true,
      wrap: true,
    },
    {
      name: "Date Finish",
      selector: (row) => row["Date Finish"],
      sortable: true,
      wrap: true,
    },
    {
      name: "Service Type",
      selector: (row) => row["Service Type"],
      sortable: true,
      wrap: true,
    },
    {
      name: "Duration",
      selector: (row) => row["Duration"],
      sortable: true,
      wrap: true,
    },
    {
      name: "Complaint / Install",
      selector: (row) => row["Complaint / Install"],
      sortable: true,
      wrap: true,
    },
    {
      name: "Reason Branch",
      selector: (row) => row["Reson Branch"],
      sortable: true,
      wrap: true,
    },
    {
      name: "DETAIL",
      selector: (row) => row["DETAIL"],
      sortable: true,
      wrap: true,
    },
    {
      name: "Unit Check",
      selector: (row) => row["Unit Check"],
      sortable: true,
      wrap: true,
    },
    {
      name: "Unit Operation",
      selector: (row) => row["Unit Operation"],
      sortable: true,
      wrap: true,
    },
    // {
    //   name: "Partner Approve/Not Approve",
    //   cell: (row, index) => (
    //     <select
    //       value={row["Partner Approve/Not Approve"]}
    //       onChange={(e) =>
    //         handleApproveChange(
    //           index,
    //           "Partner Approve/Not Approve",
    //           e.target.value
    //         )
    //       }
    //       className="p-2 border rounded"
    //     >
    //       <option value="">Select</option>
    //       <option value="Approve">Approve</option>
    //       <option value="Not Approve">Not Approve</option>
    //     </select>
    //   ),
    // },
    {
      name: "Metfone Approve/Not Approve",
      width: "150px",
      cell: (row, index) => (
        <select
          value={row["Metfone Approve/Not Approve"]}
          onChange={(e) =>
            handleApproveChange(
              index,
              "Metfone Approve/Not Approve",
              e.target.value
            )
          }
          className="p-2 border rounded"
        >
          <option value="">Select</option>
          <option value="Approve">Approve</option>
          <option value="Not Approve">Not Approve</option>
        </select>
      ),
    },
    {
      name: "File Photo",
      width: "150px",
      cell: (row) => (
        <button
          onClick={() => handleViewImages(row["File Photo"])}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          View Images
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Excel Data Display
      </h1>

      <div className="flex flex-col items-center mb-6">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="mb-4 p-2 border border-gray-300 rounded shadow-sm"
        />
        <button
          onClick={handleFileUpload}
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

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by ID Task"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded shadow-sm"
        />
      </div>
      <div className="my-4 flex justify-end">
        <button
          onClick={handleExportToExcel}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Export to Excel
        </button>
      </div>

      <DataTable
        title="Excel Data"
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        responsive
      />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            top: "0%",
            left: "0%",
            right: "0%",
            bottom: "0%",
            margin: 0,
            padding: 0,
            transform: "none",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden", // Ensure overflow is hidden for the background
            backgroundColor: "#000",
          },
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
        }}
      >
        <div className="relative w-full h-full">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-2 hover:bg-red-600 z-10"
          >
            <FaTimes />
          </button>
          <div className="flex flex-wrap justify-center gap-4 p-4 overflow-y-auto w-full h-full">
            {selectedImages.length > 0 ? (
              selectedImages.map((url, idx) => (
                <div key={idx} className="w-1/3 p-2">
                  <img
                    src={`https://drive.google.com/thumbnail?id=${
                      url.split("id=")[1]
                    }`}
                    alt={`Thumbnail ${idx + 1}`}
                    onClick={() => window.open(url, "_blank")}
                    className="cursor-pointer border border-gray-300 rounded shadow-md w-full h-auto object-contain"
                  />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No images available</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default App;
