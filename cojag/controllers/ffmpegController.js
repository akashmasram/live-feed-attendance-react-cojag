const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const HLS_FOLDER = path.join(__dirname, '../hls');
const FFMPEG_PATH = 'ffmpeg';


let ffmpegProcess;
let retryTimeout = 5000; // Retry every 5 seconds



async function findCameraIPByMAC(macAddress) {
    return new Promise((resolve, reject) => {
        exec('arp -a', (error, stdout, stderr) => {
            if (error) {
                console.error('Error executing arp command:', error);
                return reject(error);
            }

            console.log('ARP output:', stdout); // Log the entire ARP table output

            // Normalize MAC address to match the format used in arp output
            const normalizedMacAddress = macAddress.toLowerCase(); // Keep original hyphen format

            const lines = stdout.split('\n');
            for (const line of lines) {
                // Check if the line contains the MAC address
                if (line.toLowerCase().includes(normalizedMacAddress)) { // Case-insensitive match
                    // Split the line into parts; using regex to handle varying spaces
                    const parts = line.split(/\s+/).filter(part => part); // Use regex to split by whitespace

                    if (parts.length > 1) {
                        const ip = parts[0]; // First part is the IP address
                        console.log(`Found IP: ${ip} for MAC: ${macAddress}`); // Log found IP
                        return resolve(ip);
                    }
                }
            }

            console.log(`MAC address ${macAddress} not found in ARP table`);
            resolve(null); // MAC address not found
        });
    });
}





// Function to start FFmpeg with RTSP URL
function startFFmpeg(rtspURL) {
    if (ffmpegProcess) {
        ffmpegProcess.kill('SIGKILL'); // Kill the previous process if exists
    }

    ffmpegProcess = spawn(FFMPEG_PATH, [
        '-i', rtspURL,
        '-vf', 'crop=in_w-10:in_h-220',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-tune', 'zerolatency',
        '-crf', '28',
        '-c:a', 'aac',
        '-ar', '44100',
        '-b:a', '128k',
        '-f', 'hls',
        '-hls_time', '0.5',
        '-hls_list_size', '10',
        '-hls_flags', 'delete_segments',
        '-hls_delete_threshold', '1',
        '-hls_allow_cache', '0',
        // '-flush_packets', '1',
        '-g', '30',
        '-hls_playlist_type', 'event',
        path.join(HLS_FOLDER, 'stream.m3u8')
    ]);

    ffmpegProcess.stderr.on('data', data => {
        console.error(`FFmpeg stderr: ${data}`);
    });

    ffmpegProcess.on('close', code => {
        console.log(`FFmpeg process exited with code ${code}`);
        setTimeout(() => startFFmpeg(rtspURL), retryTimeout);
    });

    ffmpegProcess.on('error', (err) => {
        console.error('Failed to start FFmpeg process:', err);
        setTimeout(() => startFFmpeg(rtspURL), retryTimeout);
    });
}

module.exports = {
    findCameraIPByMAC,
    startFFmpeg
};