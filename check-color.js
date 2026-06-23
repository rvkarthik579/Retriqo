const fs = require('fs');
const PNG = require('pngjs').PNG;

fs.createReadStream('screenshot-after-click.png')
  .pipe(new PNG())
  .on('parsed', function() {
    let isWhite = true;
    let isDark = true;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let idx = (this.width * y + x) << 2;
        if (this.data[idx] !== 255 || this.data[idx+1] !== 255 || this.data[idx+2] !== 255) {
          isWhite = false;
        }
        if (this.data[idx] > 20 || this.data[idx+1] > 20 || this.data[idx+2] > 20) {
          isDark = false;
        }
      }
    }
    console.log('Is the screen completely white?', isWhite);
    console.log('Is the screen completely dark?', isDark);
    
    // sample the middle pixel
    let midX = Math.floor(this.width/2);
    let midY = Math.floor(this.height/2);
    let idx = (this.width * midY + midX) << 2;
    console.log('Middle pixel color:', this.data[idx], this.data[idx+1], this.data[idx+2]);
  });
