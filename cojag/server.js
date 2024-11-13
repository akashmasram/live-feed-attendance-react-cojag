const express = require('express');
const app = express();
require('dotenv').config()

const PORT = 8000;
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const { default: mongoose } = require('mongoose');
const httpProxy = require('http-proxy-middleware');
const { Cam } = require('onvif');
const multer = require('multer');
const upload = multer()

const auth = require('./routes/index')
const face = require('./routes/index')
const fetch = require('./routes/index')
const ffmpeg = require('./routes/index')
const macAddress = require('./routes/index')
const users = require('./routes/index')


// Import db connection
const connectDB = require('./dbConfig/db'); 
connectDB();


// Middlewares
app.use(cors());
app.use(bodyParser.json());


// Constants
const HLS_FOLDER = path.join(__dirname, 'hls');

// Ensure the HLS folder exists
if (!fs.existsSync(HLS_FOLDER)) {
    fs.mkdirSync(HLS_FOLDER);
}

// Serve HLS files
app.use('/hls', express.static(HLS_FOLDER));
app.use(express.static(path.join(__dirname, 'public')));

// Proxy HLS requests to allow CORS
app.use('/proxy', httpProxy.createProxyMiddleware({
    target: 'http://localhost:8000/hls',
    changeOrigin: true,
    pathRewrite: {
        '^/proxy': '',
    },
    onProxyRes: (proxyRes, req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
    }
}));


// Endpoint to retrieve all face descriptors (for debugging)
app.get('/faceDescriptors', (req, res) => {
    res.json(faceDescriptors);
});

app.use('/api/auth', auth);
app.use('/api/ffmpeg', ffmpeg);
app.use('/api/face', face);
app.use('/api/faces', fetch);
app.use('/api', macAddress);
app.use('/api', users);

// Starting server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
