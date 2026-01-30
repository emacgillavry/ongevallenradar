// Node.js script to generate sprite PNG and JSON files
// Run with: node generate-sprite-assets.js

import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createTriangleImageData(
  fillColor,
  strokeColor,
  size = 27,
  actualRadius = null,
  strokeWidth = 2
) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Disable anti-aliasing for crisp rendering
  ctx.imageSmoothingEnabled = false;

  // OpenLayers vs Canvas stroke rendering difference:
  // - OpenLayers: stroke extends outside the radius (total visual size = radius + stroke/2)
  // - Canvas: stroke is centered on the path (half inside, half outside)
  // Use actualRadius if provided (for matching OpenLayers sizes), otherwise use default calculation
  const radius = actualRadius !== null ? actualRadius : (size - 4) / 2;

  // Calculate triangle points (equilateral triangle pointing up)
  const centerX = size / 2;
  // For an equilateral triangle inscribed in a circle:
  // - Top vertex (angle -90°): y = centerY - radius
  // - Bottom vertices (angles 30° and 150°): y = centerY + radius * sin(30°) = centerY + radius/2
  // With stroke centered on the path, we need strokeWidth/2 padding on all sides
  // Position centerY so top vertex with stroke fits: centerY = radius + strokeWidth
  const centerY = radius + strokeWidth;

  const points = [];
  for (let i = 0; i < 3; i++) {
    const angle = ((i * 120 - 90) * Math.PI) / 180; // Start at top (-90°)
    points.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
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
  ctx.lineWidth = strokeWidth;
  ctx.stroke();

  return canvas;
}

function createCircleImageData(
  fillColor,
  strokeColor,
  size = 27,
  actualRadius = null,
  strokeWidth = 2
) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Disable anti-aliasing for crisp rendering
  ctx.imageSmoothingEnabled = false;

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
  ctx.lineWidth = strokeWidth;
  ctx.stroke();

  return canvas;
}

function createSmallMarkerImageData(fillColor, strokeColor, size = 5, strokeWidth = 1) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Disable anti-aliasing for crisp rendering
  ctx.imageSmoothingEnabled = false;

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size - strokeWidth) / 2;

  // Draw small circle marker
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);

  // Fill and stroke
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.stroke();

  // Add white highlight in upper right (similar to logo)
  ctx.save();
  ctx.beginPath();
  // Create a larger arc highlight on the edge of the circle in upper right
  const highlightStartAngle = -Math.PI / 2; // Start at top
  const highlightEndAngle = 0; // End at right side

  // Create gradient from upper right (whiter) to lower left (more blue)
  const gradientStartX = centerX + radius * Math.cos(-Math.PI / 4);
  const gradientStartY = centerY + radius * Math.sin(-Math.PI / 4);
  const gradientEndX = centerX + radius * Math.cos((3 * Math.PI) / 4);
  const gradientEndY = centerY + radius * Math.sin((3 * Math.PI) / 4);

  const gradient = ctx.createLinearGradient(
    gradientStartX,
    gradientStartY,
    gradientEndX,
    gradientEndY
  );
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)'); // Whiter at upper right
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)'); // More transparent at lower left

  ctx.arc(centerX, centerY, radius - strokeWidth / 2, highlightStartAngle, highlightEndAngle);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = Math.max(1, strokeWidth * 0.8); // Slightly thinner than main stroke
  ctx.stroke();
  ctx.restore();

  return canvas;
}

// Helper function to generate sprite at specific scale
function generateSpriteAtScale(scale = 1) {
  const size = 27 * scale;
  const padding = 1 * scale;
  const cols = 6; // Increased to accommodate 5 colors
  const rows = 3; // Added row for custom small marker

  // Define colors for each priority
  const colors = [
    { name: 'red', fill: '#FF0000', stroke: '#990000' },
    { name: 'orange', fill: '#FF6600', stroke: '#B84F09' },
    { name: 'yellow', fill: '#FFFF00', stroke: '#99990B' },
    { name: 'lightgray', fill: '#E5E5E5', stroke: '#4C4C4C' },
    { name: 'custom', fill: 'rgb(68, 149, 175)', stroke: 'rgb(50, 120, 140)' }, // Custom marker color
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
    // Match OpenLayers triangle size with stroke width 2
    // OpenLayers stroke extends outside, Canvas stroke is centered
    // To match visual appearance, add half stroke width to the radius
    const strokeWidth = 2 * scale;
    // lightgray uses radius 10, all others use radius 13.5
    const olRadius = (color.name === 'lightgray' ? 10 : 13.5) * scale;
    const canvasRadius = olRadius + strokeWidth / 2; // Adjust for Canvas stroke centering

    // Calculate the visual size needed to contain the triangle
    // For an equilateral triangle pointing up:
    // - Height from center to top vertex: radius
    // - Height from center to bottom edge: radius * 0.5
    // - Total height: radius * 1.5
    // Stroke is centered on the path, so it adds strokeWidth/2 on each side
    // Since we already adjusted canvasRadius to include stroke, we only need to add strokeWidth once more
    const triangleHeight = canvasRadius * 1.5;
    const triangleWidth = canvasRadius * Math.sqrt(3); // Width of equilateral triangle
    const visualSize = Math.ceil(Math.max(triangleHeight, triangleWidth) + strokeWidth);

    const triangleCanvas = createTriangleImageData(
      color.fill,
      color.stroke,
      visualSize,
      canvasRadius,
      strokeWidth
    );

    // Center the triangle within the standard grid slot
    const centerX = x + (size - visualSize) / 2;
    const centerY = y + (size - visualSize) / 2;

    // Draw to sprite canvas
    spriteCtx.drawImage(triangleCanvas, centerX, centerY);

    // Add to JSON metadata
    spriteJson[`triangle-${color.name}`] = {
      x: Math.round(centerX),
      y: Math.round(centerY),
      width: visualSize,
      height: visualSize,
      pixelRatio: scale,
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
    // Use 1.5x scale for stroke to look visually consistent on high-DPI (2px base, 3px for @2x)
    const strokeWidth = 2 * (scale === 1 ? 1 : 1.5);
    const olRadius = (color.name === 'lightgray' ? 8 : 9) * scale; // Original OpenLayers radius scaled
    const canvasRadius = olRadius + strokeWidth / 2; // Adjust for Canvas stroke centering

    // Calculate the visual size: diameter of the circle including stroke
    const visualSize = Math.ceil(canvasRadius * 2 + strokeWidth);

    // Create circle with appropriate canvas size
    const circleCanvas = createCircleImageData(
      color.fill,
      color.stroke,
      visualSize,
      canvasRadius,
      strokeWidth
    );

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
      pixelRatio: scale,
    };

    x += size + padding;
  });

  // Generate custom small marker (third row)
  x = 0;
  y = 2 * (size + padding);

  // Find the custom color
  const customColor = colors.find((c) => c.name === 'custom');
  if (customColor) {
    const markerSize = 5 * scale; // 5px base size
    const strokeWidth = 1 * scale;

    const markerCanvas = createSmallMarkerImageData(
      customColor.fill,
      customColor.stroke,
      markerSize,
      strokeWidth
    );

    // Center the small marker within the standard grid slot
    const centerX = x + (size - markerSize) / 2;
    const centerY = y + (size - markerSize) / 2;

    // Draw to sprite canvas
    spriteCtx.drawImage(markerCanvas, centerX, centerY);

    // Add to JSON metadata
    spriteJson['pinpoint'] = {
      x: Math.round(centerX),
      y: Math.round(centerY),
      width: markerSize,
      height: markerSize,
      pixelRatio: scale,
    };
  }

  return {
    canvas: spriteCanvas,
    json: spriteJson,
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
