import ThumborImageService from '../services/thumbor-image';

export function initialize() {
  let metaDOM = document.querySelector('#ember_thumbor_image_meta');

  if (!metaDOM) {
    return;
  }

  let meta = JSON.parse(metaDOM.textContent);

  ThumborImageService.reopen({
    meta
  })
}

export default {
  initialize
};
