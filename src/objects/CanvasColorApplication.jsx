export class CanvasColorApplication {

  getCanvas(sourceCanvas) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = sourceCanvas.width;
    canvas.height = sourceCanvas.height;
    return { canvas, ctx };
  }

  colorCanvas(sourceCanvas, sourceImage, skinTone, gender) {
    if (!sourceCanvas) {
      return;
    }

    // Desired color
    let rgb_dest;
    if (skinTone === 4) {
      rgb_dest = [192, 142, 104]; // Tone IV
    } else if (skinTone === 5) {
      rgb_dest = [156, 99, 61]; // Tone V
    } else if (skinTone === 6) {
      rgb_dest = [89, 69, 57]; // Tone VI
    } else {
      // The default image already has the lightest skin tone
      let { canvas, ctx } = this.getCanvas(sourceCanvas);
      ctx.putImageData(sourceImage, 0, 0);
      return { canvas, ctx };
    }

    // Base color
    let rgb_origin, rgb_shadow;
    if (gender === 'male') {
      rgb_origin = [186, 166, 158]; // Base Color for Male
      rgb_shadow = [112, 112, 107]; // Shadow Color for Male
    } else if (gender === 'female') {
      rgb_origin = [202, 176, 166]; // Base Color for Female
      rgb_shadow = [123, 121, 116]; // Shadow Color for Female
    }

    let rgb_diff = [
      Math.abs(rgb_origin[0] - rgb_dest[0]),
      Math.abs(rgb_origin[1] - rgb_dest[1]),
      Math.abs(rgb_origin[2] - rgb_dest[2])
    ];

    const MAGIC_BASE_COLOR_GAP_MULT = 3;
    const APPLY_COLOR_BURN_OUTLINE = true;

    let { canvas, ctx } = this.getCanvas(sourceCanvas);

    // Clear everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get the body image, use the original default image
    ctx.putImageData(sourceImage, 0, 0);

    // Create the cutout canvas
    let cutout = this.getCanvas(sourceCanvas);
    cutout.ctx.drawImage(canvas, 0, 0);

    // Apply the cutout
    cutout.ctx.globalCompositeOperation = 'source-in';
    cutout.ctx.fillStyle = `rgb(${rgb_diff.join(',')})`;
    cutout.ctx.fillRect(0, 0, cutout.canvas.width, cutout.canvas.height);
    cutout.ctx.globalCompositeOperation = 'source-over';

    // Cut out all of the black & white pixels
    let rgb_base_diff = [
      Math.abs(rgb_origin[0] - rgb_shadow[0]),
      Math.abs(rgb_origin[1] - rgb_shadow[1]),
      Math.abs(rgb_origin[2] - rgb_shadow[2])
    ];

    let rgb_midpoint = [
      rgb_origin[0] - (rgb_base_diff[0])/2,
      rgb_origin[1] - (rgb_base_diff[1])/2,
      rgb_origin[2] - (rgb_base_diff[2])/2
    ];

    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgData.data;
    let rgb_removed = [];
    for (let color_i = 0; color_i < data.length; color_i += 4) {
      const red = data[color_i];
      const green = data[color_i + 1];
      const blue = data[color_i + 2];
      const alpha = data[color_i + 3];

      // If the color difference is vastly outside of this expected range, then save
      if (
        Math.abs(red - rgb_midpoint[0]) < MAGIC_BASE_COLOR_GAP_MULT * (rgb_base_diff[0])/2 &&
        Math.abs(green - rgb_midpoint[1]) < MAGIC_BASE_COLOR_GAP_MULT * (rgb_base_diff[1])/2 &&
        Math.abs(blue - rgb_midpoint[2]) < MAGIC_BASE_COLOR_GAP_MULT * (rgb_base_diff[2])/2
      ) {
        rgb_removed.push(0,0,0,0);
      } else {
        rgb_removed.push(red, green, blue, alpha);
      }
    }

    // Apply the transformation to the original canvas
    ctx.globalCompositeOperation = 'difference';
    ctx.drawImage(cutout.canvas, 0, 0);

    // Replace the outline
    imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let color_i = 0; color_i < imgData.data.length; color_i += 4) {
      const red = rgb_removed[color_i];
      const green = rgb_removed[color_i + 1];
      const blue = rgb_removed[color_i + 2];
      const alpha = rgb_removed[color_i + 3];

      // If the color difference is vastly outside of this expected range, then save
      if (alpha !== 0) {
        imgData.data[color_i] = red;
        imgData.data[color_i + 1] = green;
        imgData.data[color_i + 2] = blue;
        imgData.data[color_i + 3] = alpha;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    if (APPLY_COLOR_BURN_OUTLINE) {
      // Try to color the outline to tint the lighter areas
      // Set up the outline canvas
      let outline = this.getCanvas(sourceCanvas);
      let outlineImgData = outline.ctx.getImageData(0, 0, outline.canvas.width, outline.canvas.height);
      for (let color_i = 0; color_i < outlineImgData.data.length; color_i += 4) {
        const red = rgb_removed[color_i];
        const green = rgb_removed[color_i + 1];
        const blue = rgb_removed[color_i + 2];
        const alpha = rgb_removed[color_i + 3];

        // If the color difference is vastly outside of this expected range, then save
        if (alpha !== 0) {
          if ((red + green + blue) <= 200 * 3) {
            outlineImgData.data[color_i] = red;
            outlineImgData.data[color_i + 1] = green;
            outlineImgData.data[color_i + 2] = blue;
            outlineImgData.data[color_i + 3] = alpha;
          }
        }
      }
      outline.ctx.putImageData(outlineImgData, 0, 0);

      // Apply color to the outline canvas for grey areas
      outline.ctx.globalCompositeOperation = 'source-in';
      outline.ctx.fillStyle = `rgb(${rgb_diff.join(',')})`;
      outline.ctx.fillRect(0, 0, outline.canvas.width, outline.canvas.height);
      outline.ctx.globalCompositeOperation = 'source-over';

      // Apply the transformation to the original canvas
      ctx.globalCompositeOperation = 'color-burn';
      ctx.drawImage(outline.canvas, 0, 0);
    }

    // Return the new image
    return { canvas, ctx };
  }

}
