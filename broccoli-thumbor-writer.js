'use strict';

const ThumborUrlBuilder = require('thumbor-url-builder');
const { ensureDirSync } = require('fs-extra');
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

    // TODO:: This is a hacky fix for 1-level deep folder. Figure out a stable solution
    // for deep-nested folders for images.
    let folders = this.input.readdirSync(sourcePath);
    let filesPromise = [];
    let files = [];
    
    folders.forEach((folder) => {
      files = this.input.readdirSync(folder);

      files
        .forEach((file) => {
          let folderedFile = `${folder}/${file}`;

          filesPromise.push(
            this.constructMeta(folderedFile).then(([filePathKey, meta]) => {
              this.metaData[filePathKey] = meta;
            })
          );
        });

      Promise.all(filesPromise).then(() => {
        this.output.writeFileSync('thumbor-asset-manifest.json', JSON.stringify(this.metaData));
      });
    });
  }

  constructMeta(file) {
    const thumborURL = new ThumborUrlBuilder(process.env.THUMBOR_SECRET_KEY, this.thumborOptions.host);
    const sizesToConvert = this.thumborOptions.sizes;
    let meta = {};
    let filePath = join(this.thumborOptions.rootURL, this.thumborOptions.sourceDir, file);
    let fullFilePath = `${this.thumborOptions.assetPrepend}${filePath}`;
    let currentGeneratedURL;

    this.writeInfoLine(`Added meta for: ${file}`);

    sizesToConvert.forEach((size) => {
      if (this.thumborOptions.enabled) {
        currentGeneratedURL = thumborURL
                  .setImagePath(fullFilePath)
                  .resize(size, 0)
                  .smartCrop(true)
                  .buildUrl();
      } else {
        currentGeneratedURL = filePath;
      }

      meta[size] = currentGeneratedURL; // Adds the first key generated to the meta.
    });

    return Promise.resolve([file, meta]);
  }
}

module.exports = ThumborImageComposerPlugin;
