import Service from '@ember/service';

export default class ThumborImageService extends Service {
  meta = '__ember_thumbor_image_meta__';

  getImage(imageName, size) {
    let { meta } = this;

    if (!meta || !meta[imageName]) {
      return imageName;
    }

    let sizes = this.getSizes();

    size = sizes.includes(size) ? size : Math.max(...sizes);

    return meta[imageName][size];
  }

  getSizes() {
    return this.meta && this.meta.sizes;
  }
}
