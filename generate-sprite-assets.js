// Node.js script to generate sprite PNG and JSON files
// Run with: node generate-sprite-assets.js

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function createTriangleImageData(fillColor, strokeColor, size = 27) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Calculate triangle points (equilateral triangle pointing up)
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size - 4) / 2; // Leave space for stroke
  
  const points = [];
  for (let i = 0; i < 3; i++) {
    const angle = (i * 120 - 90) * Math.PI / 180; // Start at top (-90°)
    points.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    });
  }
  
  // Draw triangle
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  ctx.lineTo(points[1].x, points[1].y);
  ctx.lineTo(points[2].x, points[2].y);
  ctx.closePath();
  
  // Fill and stroke
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  return canvas;
}

function createCircleImageData(fillColor, strokeColor, size = 27, actualRadius = null) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  const centerX = size / 2;
  const centerY = size / 2;
  // Use actualRadius if provided (for matching OpenLayers sizes), otherwise use default calculation
  const radius = actualRadius !== null ? actualRadius : (size - 4) / 2;
  
  // Draw circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  
  // Fill and stroke
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  return canvas;
}



// Helper function to generate sprite at specific scale
function generateSpriteAtScale(scale = 1) {
  const size = 27 * scale;
  const padding = 1 * scale;
  const cols = 5;
  const rows = 2;
  
  // Define colors for each priority
  const colors = [
    { name: 'red', fill: '#FF0000', stroke: '#990000' },
    { name: 'orange', fill: '#FF6600', stroke: '#B84F09' },
    { name: 'yellow', fill: '#FFFF00', stroke: '#99990B' },
    { name: 'gray', fill: '#666666', stroke: '#333333' },
    { name: 'lightgray', fill: '#E5E5E5', stroke: '#4C4C4C' }
  ];
  
  // Create sprite canvas
  const spriteWidth = cols * (size + padding) - padding;
  const spriteHeight = rows * (size + padding) - padding;
  const spriteCanvas = createCanvas(spriteWidth, spriteHeight);
  const spriteCtx = spriteCanvas.getContext('2d');
  
  // JSON metadata for sprite
  const spriteJson = {};
  
  let x = 0;
  let y = 0;
  
  // Generate triangles (top row)
  colors.forEach((color, index) => {
    const triangleCanvas = createTriangleImageData(color.fill, color.stroke, size);
    
    // Draw to sprite canvas
    spriteCtx.drawImage(triangleCanvas, x, y);
    
    // Add to JSON metadata
    spriteJson[`triangle-${color.name}`] = {
      x: x,
      y: y,
      width: size,
      height: size,
      pixelRatio: scale
    };
    
    x += size + padding;
  });
  
  // Generate circles (bottom row)
  x = 0;
  y = size + padding;
  
  colors.forEach((color, index) => {
    // OpenLayers vs Canvas stroke rendering difference:
    // - OpenLayers: stroke extends outside the radius (total visual size = radius + stroke/2)
    // - Canvas: stroke is centered on the path (half inside, half outside)
    // To match OpenLayers visual appearance, we need to add half stroke width to the radius
    const strokeWidth = 2 * scale;
    const olRadius = (color.name === 'lightgray' ? 8 : 9) * scale; // Original OpenLayers radius scaled
    const canvasRadius = olRadius + (strokeWidth / 2); // Adjust for Canvas stroke centering
    
    // Calculate the visual size: diameter of the circle including stroke
    const visualSize = Math.ceil((canvasRadius * 2) + strokeWidth);
    
    // Create circle with appropriate canvas size
    const circleCanvas = createCircleImageData(color.fill, color.stroke, visualSize, canvasRadius);
    
    // Center the circle within the standard grid slot
    const centerX = x + (size - visualSize) / 2;
    const centerY = y + (size - visualSize) / 2;
    
    // Draw to sprite canvas
    spriteCtx.drawImage(circleCanvas, centerX, centerY);
    
    // Add to JSON metadata with actual circle dimensions and position
    spriteJson[`circle-${color.name}`] = {
      x: Math.round(centerX),
      y: Math.round(centerY),
      width: visualSize,
      height: visualSize,
      pixelRatio: scale
    };
    
    x += size + padding;
  });
  
  return {
    canvas: spriteCanvas,
    json: spriteJson
  };
}

// Generate regular and high-resolution sprites
const sprite1x = generateSpriteAtScale(1);
const sprite2x = generateSpriteAtScale(2);

// Ensure public directory exists
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Save 1x PNG and JSON files
const png1xBuffer = sprite1x.canvas.toBuffer('image/png');
fs.writeFileSync(path.join(publicDir, 'sprite.png'), png1xBuffer);
fs.writeFileSync(path.join(publicDir, 'sprite.json'), JSON.stringify(sprite1x.json, null, 2));

// Save 2x PNG and JSON files
const png2xBuffer = sprite2x.canvas.toBuffer('image/png');
fs.writeFileSync(path.join(publicDir, 'sprite@2x.png'), png2xBuffer);
fs.writeFileSync(path.join(publicDir, 'sprite@2x.json'), JSON.stringify(sprite2x.json, null, 2));

console.log('Sprite files generated:');
console.log('- public/sprite.png');
console.log('- public/sprite.json');
console.log('- public/sprite@2x.png');
console.log('- public/sprite@2x.json');
console.log('1x Sprite dimensions:', sprite1x.canvas.width + 'x' + sprite1x.canvas.height);
console.log('2x Sprite dimensions:', sprite2x.canvas.width + 'x' + sprite2x.canvas.height);
console.log('Icons included:', Object.keys(sprite1x.json).join(', '));