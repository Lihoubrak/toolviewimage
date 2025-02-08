import * as XLSX from "xlsx";

export const processFile = (file, setData, setLoading) => {
  if (!file.name.endsWith(".xlsx")) {
    alert("Please upload a valid Excel file.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const binaryStr = event.target.result;
    try {
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      let rows = XLSX.utils.sheet_to_json(sheet);

      // Process the rows and handle Google Drive file IDs
      rows = rows.map((row) => {
        if (row["File Photo"]) {
          row["File Photo"] = row["File Photo"].split(",").map((url) => {
            // Check if the URL is a Google Drive link
            const fileIdMatch =
              url.match(
                /(?:drive|docs)\.google\.com\/(?:.*\/d\/|.*\/file\/d\/|.*\/drive\/folders\/|.*\/open\?id=)([^\/?&=]+)/
              ) ||
              url.match(/googleusercontent\.com\/.*\/d\/([^\/?&=]+)/) ||
              url.match(/drive\.google\.com\/.*id=([^\/?&=]+)/);

            // If it's a Google Drive link, extract the file ID
            if (fileIdMatch && fileIdMatch[1]) {
              return fileIdMatch[1]; // Return only the file ID
            }
            // If it's not a Google Drive link, return the URL as-is
            return url;
          });
        }
        return row;
      });

      setData(rows);
    } catch (error) {
      alert("Error processing the file.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  reader.readAsBinaryString(file);
};
