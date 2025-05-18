const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import the cors package
const app = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// File path for the CSV file
const filePath = path.join(__dirname, 'helix_data.csv');

// Function to initialize the CSV file with headers if it doesn't exist
const initializeCsvFile = () => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, 'timestamp,helix15m,helix1h\n'); // Writing the header
        console.log('CSV file initialized with headers');
    }
};

// Initialize the CSV file when the server starts
initializeCsvFile();

// POST endpoint to receive the Helix data
app.post('/api/saveHelixData', (req, res) => {
    const { timestamp, helix15m, helix1h } = req.body;

    if (!timestamp || helix15m === undefined || helix1h === undefined) {
        return res.status(400).json({ error: 'Invalid data' });
    }

    // Format the data to append to the CSV
    const csvData = `${timestamp},${helix15m},${helix1h}\n`;

    // Append data to the CSV file
    fs.appendFileSync(filePath, csvData);

    // Log the saved data to the console
    console.log(`Data saved: ${csvData.trim()}`);

    // Respond back to frontend
    res.status(200).json({ message: 'Data saved successfully' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
