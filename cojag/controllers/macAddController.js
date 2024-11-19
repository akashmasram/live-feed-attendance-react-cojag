const AddMacAddress = require('../models/macAddressModel');
const { findCameraIPByMAC, startFFmpeg} = require('./ffmpegController');


exports.AddMac = async (req, res) => {
    const { macAddress, name } = req.body;

    try {
        const newMacAddress = new AddMacAddress({ macAddress, name, user:req.user.id });
        await newMacAddress.save();
        res.status(201).json({ message: 'MAC address added successfully' });
    } catch (error) {
        if (error.code === 11000) { // Handle duplicate MAC address error
            return res.status(400).json({ error: 'MAC address already exists' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all MAC addresses
exports.getAllMacAddresses = async (req, res) => {
    try {
        const macAddresses = await AddMacAddress.find(
            {user: req.user.id }
        );
        res.status(200).json(macAddresses);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



exports.startStream = async (req, res) => {
    const { macAddress } = req.body;

    if (!macAddress) {
        return res.status(400).json({ error: 'IP address is required' });
    }

    console.log(`Received IP Address: ${macAddress}`);

    try {
        // Construct the RTSP URL using the provided IP
        const rtspURL = `rtsp://${macAddress}:5543/live/channel0`;

        // Start the FFmpeg streaming process
        startFFmpeg(rtspURL);

        // Send success response
        return res.status(200).json({ message: `Stream started for IP ${macAddress}` });
    } catch (error) {
        // Log the error details
        console.error('Error in startStream:', error);

        // Return a 500 response if something goes wrong
        return res.status(500).json({ error: 'Failed to start stream' });
    }
};



