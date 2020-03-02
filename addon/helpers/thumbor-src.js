import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';

export default Helper.extend({
  thumborImage: service(),

  compute(params) {
    let [image, size] = params;
    let responsive = this.thumborImage.getImage(image, size);

    return htmlSafe(responsive);
  }
});
