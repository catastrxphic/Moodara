const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Ensure assets directory exists
const assetsDir = path.join(__dirname);
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// Draw cute character avatar
function drawAvatar(ctx) {
    // Face
    ctx.fillStyle = '#FFE4E1';
    ctx.beginPath();
    ctx.arc(60, 60, 40, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#4A4A4A';
    ctx.beginPath();
    ctx.arc(45, 50, 5, 0, Math.PI * 2);
    ctx.arc(75, 50, 5, 0, Math.PI * 2);
    ctx.fill();

    // Blush
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.arc(35, 60, 8, 0, Math.PI * 2);
    ctx.arc(85, 60, 8, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = '#4A4A4A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(60, 65, 15, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();

    // Hair
    ctx.fillStyle = '#F8B5D3';
    ctx.beginPath();
    ctx.arc(60, 30, 25, Math.PI, 0);
    ctx.fill();
}

// Draw extension icon
function drawIcon(ctx, size) {
    // Background
    ctx.fillStyle = '#F8B5D3';
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
    ctx.fill();

    // Letter M
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('M', size/2, size/2);
}

// Generate and save avatar
const avatarCanvas = createCanvas(120, 120);
const avatarCtx = avatarCanvas.getContext('2d');
drawAvatar(avatarCtx);
const avatarBuffer = avatarCanvas.toBuffer('image/png');
fs.writeFileSync(path.join(assetsDir, 'avatar.png'), avatarBuffer);

// Generate and save icons
const sizes = [16, 48, 128];
sizes.forEach(size => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    drawIcon(ctx, size);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(assetsDir, `icon${size}.png`), buffer);
});

console.log('Assets generated successfully!'); 