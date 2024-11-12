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

// Start stream for the selected MAC address
exports.startStream = async (req, res) => {
    const { macAddress } = req.body;

    if (!macAddress) {
        return res.status(400).json({ error: 'MAC address is required' });
    }

    console.log(`Received MAC Address: ${macAddress}`);

    try {
        let ip = null;
        let retries = 0;
        const maxRetries = 1000; // Limit the number of retries if needed
        const retryInterval = 5000; // Retry every 5 seconds

        // Retry until IP is found or the maximum number of retries is reached
        while (!ip && retries < maxRetries) {
            console.log(`Attempt ${retries + 1}: Trying to find IP for MAC ${macAddress}`);
            ip = await findCameraIPByMAC(macAddress);

            if (!ip) {
                console.log(`IP not found. Retrying in ${retryInterval / 1000} seconds...`);
                retries++;
                await new Promise(resolve => setTimeout(resolve, retryInterval)); // Wait before retrying
            }
        }

        // Log the found IP address or handle if not found
        if (ip) {
            console.log(`Found IP Address: ${ip} for MAC ${macAddress}`);

            // Construct the RTSP URL using the found IP
            const rtspURL = `rtsp://${ip}:5543/live/channel0`;
            // const rtspURL = rtsp://${ip}/live/ch00_1`;


            // Start the FFmpeg streaming process
            startFFmpeg(rtspURL);

            // Send success response
            return res.status(200).json(`{ message: Stream started for MAC ${macAddress} }`);
        } else {
            // If the camera is not found after retries, return a 404 response
            console.log(`Camera with MAC address ${macAddress} not found after ${retries} attempts`);
            return res.status(404).json({ error: 'Camera not found for this MAC address' });
        }
    } catch (error) {
        // Log the error details
        console.error('Error in startStream:', error);

        // Return a 500 response if something goes wrong
        return res.status(500).json({ error: 'Failed to start stream' });
    }
};

// Start stream for the selected MAC address
// exports.startStream = async (req, res) => {
//     const { macAddress } = req.body;

//     if (!macAddress) {
//         return res.status(400).json({ error: 'MAC address is required' });
//     }

//     console.log(`Received MAC Address: ${macAddress}`);

//     try {
//         let ip = null;
//         let retries = 0;
//         const maxRetries = 1000;
//         const retryInterval = 5000;

//         while (!ip && retries < maxRetries) {
//             console.log(`Attempt ${retries + 1}: Trying to find IP for MAC ${macAddress}`);
//             ip = await findCameraIPByMAC(macAddress);

//             if (!ip) {
//                 console.log(`IP not found. Retrying in ${retryInterval / 1000} seconds...`);
//                 retries++;
//                 await new Promise(resolve => setTimeout(resolve, retryInterval));
//             }
//         }

//         if (ip) {
//             console.log(`Found IP Address: ${ip} for MAC ${macAddress}`);

//             // Construct RTSP URLs
//             const rtspURL1 = `rtsp://${ip}:5543/live/channel0`;
//             const rtspURL2 = `rtsp://${ip}/live/ch00_1`;

//             // Try the first RTSP URL
//             try {
//                 await startFFmpeg(rtspURL1);
//                 console.log(`Stream started successfully with ${rtspURL1}`);
//                 return res.status(200).json({ message: `Stream started for MAC ${macAddress}` });
//             } catch (err) {
//                 console.log(`Failed to start stream with ${rtspURL1}. Error:`, err);
                
//                 // If the first URL fails, try the second RTSP URL
//                 try {
//                     await startFFmpeg(rtspURL2);
//                     console.log(`Stream started successfully with ${rtspURL2}`);
//                     return res.status(200).json({ message: `Stream started for MAC ${macAddress}` });
//                 } catch (err) {
//                     console.log(`Failed to start stream with ${rtspURL2}. Error:`, err);
//                     return res.status(404).json({ error: 'Camera not found or unable to start stream' });
//                 }
//             }
//         } else {
//             console.log(`Camera with MAC address ${macAddress} not found after ${retries} attempts`);
//             return res.status(404).json({ error: 'Camera not found for this MAC address' });
//         }
//     } catch (error) {
//         console.error('Error in startStream:', error);
//         return res.status(500).json({ error: 'Failed to start stream' });
//     }
// };



