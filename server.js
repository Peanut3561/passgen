const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the project directory
app.use(express.static(path.join(__dirname)));

// Serve files from the js directory
app.use('/js', express.static(path.join(__dirname, 'js')));

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Routes for other pages
app.get('/generator', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/generator.html'));
});

app.get('/history', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/history.html'));
});

app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/settings.html'));
});

// Serve specific JavaScript files
app.get('/js/generator.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'js/generator.js'));
});

app.get('/js/history.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'js/history.js'));
});

app.get('/js/settings.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'js/settings.js'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Available routes:');
    console.log('  - Home: http://localhost:3000');
    console.log('  - Generator: http://localhost:3000/generator');
    console.log('  - History: http://localhost:3000/history');
    console.log('  - Settings: http://localhost:3000/settings');
    console.log(`Press Ctrl+C to stop the server`);
});
