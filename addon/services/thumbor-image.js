import Service from '@ember/service';

export default class ThumborImageService extends Service {
  getImage(imageName, size) {
    let { meta } = this;
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
}
