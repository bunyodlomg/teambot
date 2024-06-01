const xlsx = require('xlsx');

// Data to be written to the Excel file
const data = [
    { name: 'John Doe', age: 28, email: 'john.doe@example.com' },
    { name: 'Jane Smith', age: 34, email: 'jane.smith@example.com' },
    { name: 'Bob Johnson', age: 45, email: 'bob.johnson@example.com' }
];

// Convert the data to a worksheet
const worksheet = xlsx.utils.json_to_sheet(data);

// Create a new workbook and add the worksheet to it
const workbook = {
    SheetNames: ['Sheet1'],
    Sheets: {
        'Sheet1': worksheet
    }
};

// Write the workbook to a file
xlsx.writeFile(workbook, 'output.xlsx');

console.log('Excel file created successfully.');
