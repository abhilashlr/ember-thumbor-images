import ThumborImageService from 'ember-thumbor-images/services/thumbor-image';

export function initialize(/* appInstance */) {
  ThumborImageService.reopen({
    meta: '__ember_thumbor_image_meta__'
  });
}

export default {
  name: 'thumbor-setup',
  initialize
};
