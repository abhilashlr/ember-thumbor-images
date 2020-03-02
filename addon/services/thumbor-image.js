import Service from '@ember/service';

export default class ThumborImageService extends Service {
  getImage(imageName, size) {
    let sizes = this.getSizes();
    let { meta } = this;

    size = size || Math.max(...sizes);

    return meta ? meta[imageName][size] : imageName;
  }

  getSizes() {
    return this.meta.sizes;
  }
}
