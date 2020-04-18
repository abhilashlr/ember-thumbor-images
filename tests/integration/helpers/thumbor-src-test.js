import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | thumbor-src', function(hooks) {
  setupRenderingTest(hooks);

  test('it gets the right image source', async function(assert) {
    await render(hbs`{{thumbor-src "images/chicago-zoey.png"}}`);

    assert.equal(this.element.textContent.trim(), '/assets/images/chicago-zoey.png');
  });
});
