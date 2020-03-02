'use strict';

const ThumborUrlBuilder = require('thumbor-url-builder');
const path = require('path');
const fs = require('fs-extra');
const CachingWriter = require('broccoli-caching-writer');

class ThumborImageComposer extends CachingWriter {
  constructor(inputNodes, options, metaData, ui) {
    options = options || {};
    options.cacheInclude = [/.*/];

    super(inputNodes, options);

    this.thumborOptions = options;
    this.metaData = metaData || {};
    this.ui = ui;
  }

  writeInfoLine(message) {
    if (this.ui) {
      this.ui.writeInfoLine(message);
    }
  }

  build() {
    let sourcePath = this.inputPaths[0];
    let destinationPath = path.join(this.outputPath, sourcePath);

    fs.ensureDirSync(destinationPath);

    let files = fs.readdirSync(sourcePath);

    files
      .map((file) => {
        this.writeInfoLine(`File prepared: ${file}`);

        this.constructMeta(file);
      });
  }

  constructMeta(file) {
    const thumborURL = new ThumborUrlBuilder(process.env.THUMBOR_SECRET_KEY, this.thumborOptions.host);
    const sizesToConvert = this.thumborOptions.sizes;
    let meta = {};
    let filePath = `${this.metaData.prepend}${path.join(this.thumborOptions.rootURL, this.thumborOptions.sourceDir, file)}`;

    sizesToConvert.forEach((size) => {
      meta[size] = thumborURL
                .setImagePath(filePath)
                .resize(size, 0)
                .smartCrop(true)
                .buildUrl();
    });

    this.metaData[filePath] = meta;
  }
}

module.exports = ThumborImageComposer;
