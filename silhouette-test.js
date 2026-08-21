const { Jimp } = require('jimp');

(async () => {
  const input = process.argv[2];
  const output = process.argv[3];
  const image = await Jimp.read(input);
  const threshold = 170;
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    const brightness = (r + g + b) / 3;
    if (brightness < threshold) {
      this.bitmap.data[idx] = 0;
      this.bitmap.data[idx + 1] = 0;
      this.bitmap.data[idx + 2] = 0;
      this.bitmap.data[idx + 3] = 255;
    } else {
      this.bitmap.data[idx + 3] = 0;
    }
  });
  await image.write(output);
  console.log('done:', output);
})();
