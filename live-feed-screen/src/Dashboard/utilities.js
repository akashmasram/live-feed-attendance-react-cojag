// utilities.js
export const drawRect = (detections, ctx) => {
    detections.forEach((detection) => {
        const [x, y, width, height] = detection.bbox;
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red'; // Color for object bounding box
        ctx.stroke();
        ctx.font = '100px';
        ctx.fillStyle = 'red';
        ctx.fillText(detection.class, x, y > 10 ? y - 10 : 10); // Label above the box
    });
};
