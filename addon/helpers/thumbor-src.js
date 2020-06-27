import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';

export default class ThumborSrcHelper extends Helper {
  @service thumborImage;

  compute(params) {
    let [image, size] = params;
    let responsive = this.thumborImage.getImage(image, size);

    return htmlSafe(responsive);
  }
}
