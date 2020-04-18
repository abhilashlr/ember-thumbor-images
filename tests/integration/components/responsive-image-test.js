import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | responsive-image', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<ResponsiveImage @src="images/chicago-zoey.png" @alt="Chicago tomster" />`);

    assert.equal(this.element.querySelector('img').src, 'http://localhost:7357/assets/images/chicago-zoey.png');
  });
});
