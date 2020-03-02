import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class ResponsiveImageComponent extends Component {
  @service thumborImage;

  constructor() {
    super(...arguments);

    this.sizes = this.thumborImage.getSizes();
  }
}
