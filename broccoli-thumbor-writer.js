'use strict';

const ThumborUrlBuilder = require('thumbor-url-builder');
const { ensureDirSync, readdirSync } = require('fs-extra');
const Plugin = require('broccoli-plugin');
const { join, parse } = require('path');

class ThumborImageComposerPlugin extends Plugin {
  constructor(inputNodes, options = {}, metaData, ui) {
    super(inputNodes, options);

    this.thumborOptions = options;
    this.metaData = metaData;
    this.ui = ui;
  }

  writeInfoLine(message) {
    if (this.ui) {
      this.ui.writeInfoLine(message);
    }
  }

  build() {
    let sourcePath = this.inputPaths[0];
    let destinationPath = join(this.outputPath, '/');

    ensureDirSync(destinationPath);

    let files = readdirSync(sourcePath);
    let filesPromise = [];

    files
      .forEach((file) => {
        filesPromise.push(
          this.constructMeta(file).then(([filePathKey, meta]) => {
            this.metaData[filePathKey] = meta;
          })
        );
      });

    Promise.all(filesPromise).then(() => {
      this.output.writeFileSync('thumbor-asset-manifest.json', JSON.stringify(this.metaData));
    });
  }

  constructMeta(file) {
    const thumborURL = new ThumborUrlBuilder(process.env.THUMBOR_SECRET_KEY, this.thumborOptions.host);
    const sizesToConvert = this.thumborOptions.sizes;
    let meta = {};
    let filePath = `${this.thumborOptions.assetPrepend}${join(this.thumborOptions.rootURL, this.thumborOptions.sourceDir, file)}`;
    let currentGeneratedURL;

    // TODO:: Find better ways to just get the file path without fingerprint
    let filePathKey = parse(filePath).name.split('-');
    filePathKey = filePath.replace(`-${filePathKey[filePathKey.length - 1]}`, '');
    this.writeInfoLine(`Added meta for: ${filePathKey}`);
    // TODO:: Find better ways to just get the file path without fingerprint

    sizesToConvert.forEach((size) => {
      if (this.thumborOptions.enabled) {
        currentGeneratedURL = thumborURL
                  .setImagePath(filePath)
                  .resize(size, 0)
                  .smartCrop(true)
                  .buildUrl();
      } else {
        currentGeneratedURL = filePath;
      }

      meta[size] = currentGeneratedURL; // Adds the first key generated to the meta.
    });

    return Promise.resolve([filePathKey, meta]);
  }
}

module.exports = ThumborImageComposerPlugin;
