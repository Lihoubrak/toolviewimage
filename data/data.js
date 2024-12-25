 export  const columns = [
    { title: "No.", dataIndex: "Nº", key: "No."},
    { title: "ID Task", dataIndex: "ID Task", key: "ID Task",  },
    { title: "Account", dataIndex: "Account", key: "Account",  },
    { title: "PRO", dataIndex: "PRO", key: "PRO" },
    { title: "Site", dataIndex: "Site", key: "Site" },
    { title: "Date Start", dataIndex: "Date Start", key: "Date Start" },
    { title: "Date Finish", dataIndex: "Date Finish", key: "Date Finish" },
    { title: "Service Type", dataIndex: "Service Type", key: "Service Type" },
    { title: "Duration", dataIndex: "Duration", key: "Duration" },
    { title: "Complaint / Install", dataIndex: "Complaint / Install", key: "Complaint / Install" ,sorter: (a, b) => a["Complaint / Install"] - b["Complaint / Install"]},
    { title: "Reason Branch", dataIndex: "Reson Branch", key: "Reason Branch" },
    { title: "DETAIL", dataIndex: "DETAIL", key: "DETAIL" },
    {
        title: "Unit Check",
        dataIndex: "Unit Check",
        key: "Unit Check",
        sorter: (a, b) => a["Unit Check"] - b["Unit Check"],
        filters: [
          {
            text: '98361248133',
            value: '98361248133',
          },
          {
            text: '98361552095',
            value: '98361552095',
          },
        ],
        onFilter: (value, record) => record["Unit Check"]?.includes(value),
      }
,      
    { title: "Unit Operation", dataIndex: "Unit Operation", key: "Unit Operation",sorter: (a, b) => a["Unit Operation"] - b["Unit Operation"] },
    {
      title: "Partner Approve/Not Approve",
      dataIndex: "Partner Approve/Not Approve",
      key: "Partner Approve/Not Approve",
      render: (text, record, index) => (
        <Select
          value={text}
          onChange={(value) => handleApproveChange(index, "Partner Approve/Not Approve", value)}
          style={{ width: 120 }}
        >
          <Option value="Approve">Approve</Option>
          <Option value="Not Approve">Not Approve</Option>
        </Select>
      ),
    },
    {
      title: "Metfone Approve/Not Approve",
      dataIndex: "Metfone Approve/Not Approve",
      key: "Metfone Approve/Not Approve",
      render: (text, record, index) => (
        <Select
          value={text || ""}
          onChange={(value) => handleApproveChange(index, "Metfone Approve/Not Approve", value)}
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
      render: (text, record) => (
        <Button
          onClick={() => handleViewImages(record["File Photo"])}
          type="primary"
        >
          View Images
        </Button>
      ),
    },
  ];