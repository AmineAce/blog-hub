const fs = require('fs');
const path = require('path');

// Image filename mapping from Title-Case to kebab-case
const imageMappings = {
  'Autumn-Is-Coming-Cozy-Up-Your-Home-with-Etsy-Digital-Prints.webp': 'autumn-is-coming-cozy-up-your-home-with-etsy-digital-prints.webp',
  'Capture-Crisp-Audio-Anywhere-Why-the-RODE-Wireless-ME-Is-a-Game-Changer-for-Content-Creator.webp': 'capture-crisp-audio-anywhere-why-the-rode-wireless-me-is-a-game-changer-for-content-creator.webp',
  'Capture-Crisp-Audio-Anywhere-Why-the-Shure-MV6-Is-a-Game-Changer-for-Content-Creators.webp': 'capture-crisp-audio-anywhere-why-the-shure-mv6-is-a-game-changer-for-content-creators.webp',
  'Cozy-Autumn-Cat-Art-Print-Elevate-Your-Home-with-Instant-Fall-Magic.webp': 'cozy-autumn-cat-art-print-elevate-your-home-with-instant-fall-magic.webp',
  'iPhone-17-Pro-Max-vs-Galaxy-S25-Ultra-Head-to-Head-Comparison.webp': 'i-phone-17-pro-max-vs-galaxy-s25-ultra-head-to-head-comparison.webp',
  'The-Allure-of-the-Casino-Cat-Why-Every-Man-Cave-Needs-This-Sophisticated-Feline-Gambler-Poster.webp': 'the-allure-of-the-casino-cat-why-every-man-cave-needs-this-sophisticated-feline-gambler-poster.webp',
  'Transform-Your-Home-with-Smart-Sound-Why-the-Echo-Dot-5th-Gen-Is-a-Must-Have.webp': 'transform-your-home-with-smart-sound-why-the-echo-dot-5th-gen-is-a-must-have.webp'
};

const imagesDir = path.join(process.cwd(), 'public', 'images', 'posts');

console.log('🖼️  Renaming image files to kebab-case...\n');

Object.entries(imageMappings).forEach(([oldName, newName]) => {
  const oldPath = path.join(imagesDir, oldName);
  const newPath = path.join(imagesDir, newName);
  
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`✅ Renamed: ${oldName} → ${newName}`);
  } else {
    console.log(`❌ File not found: ${oldName}`);
  }
});

console.log('\n🎉 Image renaming completed!');
console.log('📝 Next: Update migration data with image references');
