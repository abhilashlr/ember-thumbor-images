import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | thumbor-image', function(hooks) {
  setupTest(hooks);

  test('if getImage returns the image name as is, since it is not part of the meta', function(assert) {
    let service = this.owner.lookup('service:thumbor-image');

    assert.equal(service.getImage('random'), 'random');
  });

  test('if getImage returns the meta image with path and different sizes', function(assert) {
    let service = this.owner.lookup('service:thumbor-image');

    assert.equal(service.getImage('images/chicago-zoey.png'), '/assets/images/chicago-zoey.png', 'When size is not passed');
    assert.equal(service.getImage('images/chicago-zoey.png', 25), '/assets/images/chicago-zoey.png', 'When wrong size is passed');
    assert.equal(service.getImage('images/chicago-zoey.png', 320), '/assets/images/chicago-zoey.png', 'When correct size is passed');
  });

  test('if cacheImagesFromMeta returns undefined when the config was not set during build', function(assert) {
    let tmp = window.thumborConfig;

    window.thumborConfig = () => { return null; };

    let service = this.owner.lookup('service:thumbor-image');

    assert.equal(service.cacheImagesFromMeta(), undefined);

    window.thumborConfig = tmp;
  });
});
