import Service, { inject as service } from '@ember/service';

export default class ThumborImageService extends Service {
  @service('-document') document;

  getImage(imageName, size) {
    let { meta } = this;

    meta = meta || this.cacheImagesFromMeta();

    if (!meta) {
      return imageName;
    }

    let sizes = this.getSizes();

    size = size || Math.max(...sizes);

    return meta[imageName][size];
  }

  getSizes() {
    return this.meta && this.meta.sizes;
  }

  cacheImagesFromMeta() {
    if (!(typeof Fastboot === undefined)) {
      return;
    }

    let metaDOM = this.document.querySelector('#ember_thumbor_image_meta');

    if (!metaDOM) {
      return;
    }

    this.meta = JSON.parse(metaDOM.textContent);

    return this.meta;
  }
}
