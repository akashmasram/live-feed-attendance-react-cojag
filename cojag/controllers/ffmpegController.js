const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const onvif = require('node-onvif');

const HLS_FOLDER = path.join(__dirname, '../hls');
const FFMPEG_PATH = 'ffmpeg';


let ffmpegProcess;
let retryTimeout = 5000; // Retry every 5 seconds

// Function to find camera IP using ONVIF discovery
async function findCameraIPByMAC(macAddress){
    try {
        console.log('Searching for ONVIF devices...');
        const deviceInfoList = await onvif.startProbe();

        if (deviceInfoList.length === 0) {
            console.log('No ONVIF devices found.');
            return null;
        }

        console.log(`${deviceInfoList.length} ONVIF device(s) found.`);
        const device = deviceInfoList[0]; // Taking the first device (modify for multiple devices)
        const deviceIP = new URL(device.xaddrs[0]).hostname;

        console.log(`Discovered Camera IP: ${deviceIP}`);
        return deviceIP;
    } catch (error) {
        console.error('Error discovering devices:', error);
        return null;
    }
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
