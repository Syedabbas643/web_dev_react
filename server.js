const express = require('express');
const app = express();
const PORT = 5000; // Choose any available port number

// Middleware to parse JSON data in requests
app.use(express.json());

// Sample route to test the server
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is up and running!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});