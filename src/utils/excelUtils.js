import * as XLSX from "xlsx";

export const processFile = (file, setData) => {
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


export const exportToExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, fileName);
};
