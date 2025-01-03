export const getNamesAndValues = (columnName, data) => {
  const counts = {};

  // Loop through the data array to count occurrences
  data.forEach((row) => {
    const value = row[columnName];
    if (value) {
      counts[value] = (counts[value] || 0) + 1;
    }
  });

  // Extract keys (names) and values
  const names = Object.keys(counts); // Array of names
  const values = Object.values(counts); // Array of corresponding values

  return { names, values };
};

